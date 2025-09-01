"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import useAuth0
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
  currentAuthUserStreamer: ActiveStreamer | null; // Add currentAuthUserStreamer
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0(); // Get Auth0 user
  const currentAuthUserStreamer: ActiveStreamer | null = useMemo(() => {
    if (isAuthenticated && user?.sub && user?.nickname) {
      return {
        id: user.sub,
        userName: user.nickname,
        avatar: user.picture || null, // Auth0 user might have a picture
      };
    }
    return null;
  }, [isAuthenticated, user]);

  const { data: myRolesData, loading: myRolesLoading, error: myRolesError } = useGetMyRolesQuery({
    skip: !currentAuthUserStreamer?.id, // Use Auth0 user ID for roles query
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

  // Extract username from URL
  const usernameFromUrl = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const dashboardIndex = pathSegments.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
      return pathSegments[dashboardIndex + 1];
    }
    return null;
  }, [pathname]);

  // Effect to fetch streamer by URL username if needed
  useEffect(() => {
    if (usernameFromUrl && !urlStreamerData && !urlStreamerLoading && !urlStreamerError) {
      // Check if it's the current auth user's channel
      if (currentAuthUserStreamer?.userName === usernameFromUrl) {
        setActiveStreamerState(currentAuthUserStreamer);
        return;
      }
      // Check if it's a channel the user has a role for
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
      // Otherwise, try to fetch it as a generic streamer
      getStreamerByUrlUsername({ variables: { userName: usernameFromUrl } });
    }
  }, [usernameFromUrl, urlStreamerData, urlStreamerLoading, urlStreamerError, getStreamerByUrlUsername, currentAuthUserStreamer, myRolesData]);


  // Effect to set activeStreamer based on all available data and handle redirects
  useEffect(() => {
    if (authLoading || myRolesLoading || urlStreamerLoading) {
      return; // Wait for essential data to load
    }

    if (!isAuthenticated) {
      // If not authenticated, and on a dashboard route, redirect to home or login
      if (pathname.startsWith("/dashboard")) {
        router.replace("/"); // Or router.push('/login')
      }
      return;
    }

    if (currentAuthUserStreamer && !activeStreamer) {
      let resolvedStreamer: ActiveStreamer | null = null;

      // 1. Prioritize URL username if it's valid
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

      // 2. Fallback to current authenticated user's channel if no valid streamer from URL
      if (!resolvedStreamer) {
        resolvedStreamer = currentAuthUserStreamer;
      }

      if (resolvedStreamer) {
        setActiveStreamerState(resolvedStreamer);
        // Ensure URL is consistent with the resolved streamer
        if (pathname !== `/dashboard/${resolvedStreamer.userName}` && pathname.startsWith("/dashboard")) {
          router.replace(`/dashboard/${resolvedStreamer.userName}`);
        }
      } else if (pathname === "/dashboard") {
        // Handle direct access to /dashboard without username, redirect to current user's dashboard
        router.replace(`/dashboard/${currentAuthUserStreamer.userName}`);
      }
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
    return null; // Or a loading spinner for the entire app if this is critical
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