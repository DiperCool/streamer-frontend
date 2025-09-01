"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGetMeQuery, useGetMyRolesQuery, RoleDto } from "@/graphql/__generated__/graphql";
import { useRouter } from "next/navigation";

interface ActiveStreamer {
  id: string;
  userName: string;
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
  });
  const [activeStreamer, setActiveStreamerState] = useState<ActiveStreamer | null>(null);
  const router = useRouter();

  // Initialize activeStreamer with current user's data
  useEffect(() => {
    if (meData?.me && !activeStreamer) {
      setActiveStreamerState({
        id: meData.me.id,
        userName: meData.me.userName || "my-channel", // Fallback username
      });
    }
  }, [meData, activeStreamer]);

  const setActiveStreamer = (streamer: ActiveStreamer) => {
    setActiveStreamerState(streamer);
    // Optionally redirect to the new streamer's dashboard home
    router.push(`/dashboard/${streamer.userName}`);
  };

  const myRoles = myRolesData?.myRoles?.nodes || [];

  if (meLoading || myRolesLoading) {
    // You might want a global loading spinner here or handle it in MainLayout
    return null;
  }

  if (meError || myRolesError) {
    console.error("Error loading user or roles data:", meError || myRolesError);
    // Handle error state, maybe show an error message
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