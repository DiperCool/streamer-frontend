"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useGetMyRolesQuery, useGetStreamerQuery, useGetMeQuery, RoleDto, SortEnumType, useGetMyRoleQuery, PermissionsFlags } from "@/graphql/__generated__/graphql";
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
  activeStreamerPermissions: PermissionsFlags | null;
  activeStreamerPermissionsLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  
  const { data: meData, loading: meLoading } = useGetMeQuery({
    skip: !isAuthenticated,
  });

  const currentAuthUserStreamer: ActiveStreamer | null = useMemo(() => {
    if (isAuthenticated && meData?.me.id && meData?.me.userName) {
      return {
        id: meData.me.id,
        userName: meData.me.userName,
        avatar: meData.me.avatar || null,
      };
    }
    return null;
  }, [isAuthenticated, meData]);

  const { data: myRolesData, loading: myRolesLoading, error: myRolesError } = useGetMyRolesQuery({
    skip: !currentAuthUserStreamer?.id,
    variables: {
      order: [{ id: SortEnumType.Asc }],
    },
  });
  const [activeStreamer, setActiveStreamerState] = useState<ActiveStreamer | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const usernameFromUrl = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const dashboardIndex = pathSegments.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
      return pathSegments[dashboardIndex + 1];
    }
    return null;
  }, [pathname]);

  const myRoles = myRolesData?.myRoles?.nodes || [];

  const { data: urlStreamerData, loading: urlStreamerLoading, error: urlStreamerError } = useGetStreamerQuery({
    variables: { userName: usernameFromUrl! },
    skip: 
      !usernameFromUrl || 
      !isAuthenticated || 
      meLoading || 
      !currentAuthUserStreamer || 
      usernameFromUrl === currentAuthUserStreamer.userName || 
      myRoles.some(role => role.broadcaster?.userName === usernameFromUrl),
  });

  const { data: myRoleData, loading: myRoleLoading, error: myRoleError } = useGetMyRoleQuery({
    variables: { broadcasterId: activeStreamer?.id ?? "" },
    skip: !isAuthenticated || !activeStreamer?.id,
  });

  const activeStreamerPermissions = myRoleData?.myRole?.permissions || null;

  useEffect(() => {
    if (authLoading || meLoading || myRolesLoading || urlStreamerLoading) {
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
          const roleForUrlStreamer = myRoles.find(
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
    meData,
    meLoading,
    myRoles,
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

  if (authLoading || meLoading || myRolesLoading || urlStreamerLoading || myRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (myRolesError || urlStreamerError || myRoleError) {
    console.error("Error loading roles or streamer data:", myRolesError || urlStreamerError || myRoleError);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-red-500 text-lg">Access Denied: You do not have permission to view this dashboard.</p>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{
      activeStreamer,
      setActiveStreamer,
      myRoles,
      myRolesLoading,
      currentAuthUserStreamer,
      activeStreamerPermissions,
      activeStreamerPermissionsLoading: myRoleLoading,
    }}>
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