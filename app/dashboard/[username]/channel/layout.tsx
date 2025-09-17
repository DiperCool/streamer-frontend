"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/src/contexts/DashboardContext"

export default function ChannelLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const { username } = params;
  const pathname = usePathname();
  const { activeStreamer } = useDashboard();
  const streamerUsername = activeStreamer?.userName ?? username;

  // Determine the active tab based on the current pathname
  const getActiveTab = () => {
    if (pathname.includes(`/dashboard/${streamerUsername}/channel/chat/banned-users`)) {
      return "banned-users";
    }
    if (pathname.includes(`/dashboard/${streamerUsername}/channel/chat`)) {
      return "chat-settings";
    }
    if (pathname.includes(`/dashboard/${streamerUsername}/channel/roles`)) {
      return "roles";
    }
    if (pathname.includes(`/dashboard/${streamerUsername}/channel/community`)) {
      return "community";
    }
    // Removed notifications tab check
    return "stream-info"; // Default tab
  };
  const activeTab = getActiveTab();

  return (
    <div className="space-y-8">
      {/* Удален заголовок Channel Management */}
      {/* Удалены Tabs и все связанные с ними компоненты */}
      {children}
    </div>
  );
}