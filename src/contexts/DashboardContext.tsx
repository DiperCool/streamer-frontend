"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { useGetMeQuery, useGetMyRolesQuery, useGetStreamerLazyQuery, RoleDto, SortEnumType } from "@/graphql/__generated__/graphql";
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
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: meData, loading: meLoading, error: meError } = useGetMeQuery();
  const { data: myRolesData, loading: myRolesLoading, error: myRolesError } = useGetMyRolesQuery({
    skip: !meData?.me.id,
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
    if (meData?.me && usernameFromUrl && usernameFromUrl !== meData.me.userName && !urlStreamerData && !urlStreamerLoading && !urlStreamerError) {
      const roleExists = myRolesData?.myRoles?.nodes?.some(
        (role) => role.broadcaster?.userName === usernameFromUrl
      );
      if (!roleExists) { // Only fetch if not current user and no role found
        getStreamerByUrlUsername({ variables: { userName: usernameFromUrl } });
      }
    }
  }, [meData, usernameFromUrl, myRolesData, urlStreamerData, urlStreamerLoading, urlStreamerError, getStreamerByUrlUsername]);


  // Effect to set activeStreamer based on all available data
  useEffect(() => {
    if (meLoading || myRolesLoading) {
      return; // Wait for essential data to load
    }

    if (meData?.me && !activeStreamer) { // Only try to set if meData is loaded and activeStreamer is not yet set
      const currentUserUsername = meData.me.userName || "my-channel";
      let resolvedStreamer: ActiveStreamer | null = null;

      // 1. Check if URL username matches current user's channel
      if (usernameFromUrl === currentUserUsername) {
        resolvedStreamer = {
          id: meData.me.id,
          userName: currentUserUsername,
          avatar: meData.me.avatar,
        };
      } 
      // 2. Check if URL username corresponds to a channel the user has a role for
      else {
        const roleForUrlStreamer = myRolesData?.myRoles?.nodes?.find(
          (role) => role.broadcaster?.userName === usernameFromUrl
        );
        if (roleForUrlStreamer?.broadcaster) {
          resolvedStreamer = {
            id: roleForUrlStreamer.broadcaster.id,
            userName: roleForUrlStreamer.broadcaster.userName,
            avatar: roleForUrlStreamer.broadcaster.avatar,
          };
        }
      }

      // 3. Check if URL username is a valid streamer (fetched via lazy query)
      if (!resolvedStreamer && urlStreamerData?.streamer && urlStreamerData.streamer.userName === usernameFromUrl) {
        resolvedStreamer = {
          id: urlStreamerData.streamer.id,
          userName: urlStreamerData.streamer.userName,
          avatar: urlStreamerData.streamer.avatar,
        };
      }

      // Final decision and potential redirect
      if (resolvedStreamer) {
        setActiveStreamerState(resolvedStreamer);
        // Ensure URL is consistent with the resolved streamer
        if (pathname !== `/dashboard/${resolvedStreamer.userName}`) {
          router.replace(`/dashboard/${resolvedStreamer.userName}`);
        }
      } else {
        // Fallback: If no valid streamer found for URL, default to current user's channel and redirect
        setActiveStreamerState({
          id: meData.me.id,
          userName: currentUserUsername,
          avatar: meData.me.avatar,
        });
        router.replace(`/dashboard/${currentUserUsername}`);
      }
    } else if (meData?.me && pathname === "/dashboard") {
        // Handle direct access to /dashboard without username
        const currentUserUsername = meData.me.userName || "my-channel";
        router.replace(`/dashboard/${currentUserUsername}`);
    }
  }, [meData, meLoading, myRolesData, myRolesLoading, activeStreamer, usernameFromUrl, urlStreamerData, urlStreamerLoading, urlStreamerError, pathname, router]);


  const setActiveStreamer = (streamer: ActiveStreamer) => {
    setActiveStreamerState(streamer);
    router.push(`/dashboard/${streamer.userName}`);
  };

  const myRoles = myRolesData?.myRoles?.nodes || [];

  if (meLoading || myRolesLoading || urlStreamerLoading) {
    return null; // Or a loading spinner for the entire app if this is critical
  }

  if (meError || myRolesError || urlStreamerError) {
    console.error("Error loading user or roles data:", meError || myRolesError || urlStreamerError);
    // Potentially render an error state or redirect to a generic error page
    return null;
  }

  return (
    <DashboardContext.Provider value={{ activeStreamer, setActiveStreamer, myRoles, myRolesLoading }}>
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