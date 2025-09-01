"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGetMeQuery, useGetMyRolesQuery, RoleDto, SortEnumType } from "@/graphql/__generated__/graphql";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname

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

  // Initialize activeStreamer based on URL or current user
  useEffect(() => {
    if (meData?.me && !activeStreamer) {
      const pathSegments = pathname.split('/').filter(Boolean);
      const dashboardIndex = pathSegments.indexOf('dashboard');
      let initialUsername = meData.me.userName || "my-channel";

      if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
        // If we are on a dashboard route like /dashboard/someusername
        initialUsername = pathSegments[dashboardIndex + 1];
      }

      // Find the streamer by username, either current user or from roles
      let foundStreamer: ActiveStreamer | null = null;
      if (meData.me.userName === initialUsername) {
        foundStreamer = {
          id: meData.me.id,
          userName: meData.me.userName,
          avatar: meData.me.avatar,
        };
      } else {
        const roleForStreamer = myRolesData?.myRoles?.nodes?.find(
          (role) => role.broadcaster?.userName === initialUsername
        );
        if (roleForStreamer?.broadcaster) {
          foundStreamer = {
            id: roleForStreamer.broadcaster.id,
            userName: roleForStreamer.broadcaster.userName,
            avatar: roleForStreamer.broadcaster.avatar,
          };
        }
      }

      if (foundStreamer) {
        setActiveStreamerState(foundStreamer);
      } else {
        // Fallback to current user if no matching streamer found in URL
        setActiveStreamerState({
          id: meData.me.id,
          userName: meData.me.userName || "my-channel",
          avatar: meData.me.avatar,
        });
      }
    }
  }, [meData, activeStreamer, pathname, myRolesData]);

  const setActiveStreamer = (streamer: ActiveStreamer) => {
    setActiveStreamerState(streamer);
    router.push(`/dashboard/${streamer.userName}`); // Navigate to the new streamer's dashboard
  };

  const myRoles = myRolesData?.myRoles?.nodes || [];

  if (meLoading || myRolesLoading) {
    return null;
  }

  if (meError || myRolesError) {
    console.error("Error loading user or roles data:", meError || myRolesError);
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