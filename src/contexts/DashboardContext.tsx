"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useGetMyRolesQuery, useGetStreamerLazyQuery, RoleDto, SortEnumType } from "@/graphql/__generated__/graphql";
import { useRouter, usePathname } from "next/navigation";

interface ActiveStreamer {
  id: string;
  userName: string;
  avatar?: string | null;
}

interface DashboardContextType {
  activeStreamer: ActiveStreamer | null;
  setActiveStreamer: (streamer: ActiveStreamer) => void;
  myRoles: RoleDto[];
  myRolesLoading: boolean;
  currentAuthUserStreamer: ActiveStreamer | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const currentAuthUserStreamer: ActiveStreamer | null = useMemo(() => {
    if (isAuthenticated && user?.sub && user?.nickname) {
      return {
        id: user.sub,
        userName: user.nickname,
        avatar: user.picture || null,
      };
    }
    return null;
  }, [isAuthenticated, user]);

  const { data: myRolesData, loading: myRolesLoading, error: myRolesError } = useGetMyRolesQuery({
    skip: !currentAuthUserStreamer?.id,
    variables: {
      order: [{ id: SortEnumType.Asc }],
    },
  });
  const [activeStreamer, setActiveStreamerState] = useState<ActiveStreamer | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [
    getStreamerByUrlUsername,
    { data: urlStreamerData, loading: urlStreamerLoading, error: urlStreamerError }
  ] = useGetStreamerLazyQuery();

  const usernameFromUrl = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const dashboardIndex = pathSegments.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
      return pathSegments[dashboardIndex + 1];
    }
    return null;
  }, [pathname]);

  useEffect(() => {
    if (usernameFromUrl && !urlStreamerData && !urlStreamerLoading && !urlStreamerError) {
      if (currentAuthUserStreamer?.userName === usernameFromUrl) {
        setActiveStreamerState(currentAuthUserStreamer);
        return;
      }
      const roleForUrlStreamer = myRolesData?.myRoles?.nodes?.find(
        (role) => role.broadcaster?.userName === usernameFromUrl
      );
      if (roleForUrlStreamer?.broadcaster) {
        setActiveStreamerState({
          id: roleForUrlStreamer.broadcaster.id,
          userName: roleForUrlStreamer.broadcaster.userName,
          avatar: roleForUrlStreamer.broadcaster.avatar,
        });
        return;
      }
      getStreamerByUrlUsername({ variables: { userName: usernameFromUrl } });
    }
  }, [usernameFromUrl, urlStreamerData, urlStreamerLoading, urlStreamerError, getStreamerByUrlUsername, currentAuthUserStreamer, myRolesData]);

  useEffect(() => {
    if (authLoading || myRolesLoading || urlStreamerLoading) {
      return;
    }

    if (!isAuthenticated) {
      if (pathname.startsWith("/dashboard")) {
        router.replace("/");
      }
      return;
    }

    if (currentAuthUserStreamer && !activeStreamer) {
      let resolvedStreamer: ActiveStreamer | null = null;

      if (usernameFromUrl) {
        if (currentAuthUserStreamer.userName === usernameFromUrl) {
          resolvedStreamer = currentAuthUserStreamer;
        } else {
          const roleForUrlStreamer = myRolesData?.myRoles?.nodes?.find(
            (role) => role.broadcaster?.userName === usernameFromUrl
          );
          if (roleForUrlStreamer?.broadcaster) {
            resolvedStreamer = {
              id: roleForUrlStreamer.broadcaster.id,
              userName: roleForUrlStreamer.broadcaster.userName,
              avatar: roleForUrlStreamer.broadcaster.avatar,
            };
          } else if (urlStreamerData?.streamer && urlStreamerData.streamer.userName === usernameFromUrl) {
            resolvedStreamer = {
              id: urlStreamerData.streamer.id,
              userName: urlStreamerData.streamer.userName,
              avatar: urlStreamerData.streamer.avatar,
            };
          }
        }
      }

      if (!resolvedStreamer) {
        resolvedStreamer = currentAuthUserStreamer;
      }

      if (resolvedStreamer) {
        setActiveStreamerState(resolvedStreamer);
        const expectedBaseDashboardPath = `/dashboard/${resolvedStreamer.userName}`;
        
        // Redirect if the current path is exactly '/dashboard' OR
        // if the current path starts with '/dashboard/' but the username part is incorrect.
        // This prevents redirecting sub-routes like /dashboard/user/settings
        if (pathname === "/dashboard" || (usernameFromUrl && !pathname.startsWith(expectedBaseDashboardPath))) {
          router.replace(expectedBaseDashboardPath);
        }
      } else {
        console.error("DashboardContext: Could not resolve active streamer, falling back to home.");
        router.replace("/");
      }
    } else if (currentAuthUserStreamer && pathname === "/dashboard") {
        router.replace(`/dashboard/${currentAuthUserStreamer.userName}`);
    }
  }, [
    isAuthenticated,
    authLoading,
    myRolesData,
    myRolesLoading,
    activeStreamer,
    usernameFromUrl,
    urlStreamerData,
    urlStreamerLoading,
    urlStreamerError,
    pathname,
    router,
    currentAuthUserStreamer,
  ]);

  const setActiveStreamer = (streamer: ActiveStreamer) => {
    setActiveStreamerState(streamer);
    router.push(`/dashboard/${streamer.userName}`);
  };

  const myRoles = myRolesData?.myRoles?.nodes || [];

  if (authLoading || myRolesLoading || urlStreamerLoading) {
    return null;
  }

  if (myRolesError || urlStreamerError) {
    console.error("Error loading roles or streamer data:", myRolesError || urlStreamerError);
    return null;
  }

  return (
    <DashboardContext.Provider value={{ activeStreamer, setActiveStreamer, myRoles, myRolesLoading, currentAuthUserStreamer }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};