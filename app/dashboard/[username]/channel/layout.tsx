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
    if (pathname.includes(`/dashboard/${streamerUsername}/channel/chat`)) {
      return "chat-settings";
    }
    if (pathname.includes(`/dashboard/${streamerUsername}/channel/roles`)) {
      return "roles";
    }
    if (pathname.includes(`/dashboard/${streamerUsername}/channel/community`)) {
      return "community"; 
    }
    return "stream-info"; // Default tab
  };
  const activeTab = getActiveTab();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-2 text-white">Channel Management</h1>

      <Tabs value={activeTab} className="w-full">
        <TabsList className="bg-gray-900 mb-8" currentValue={activeTab}>
          <Link href={`/dashboard/${streamerUsername}/channel/stream-info`} passHref>
            <TabsTrigger value="stream-info">
              Stream Info
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/${streamerUsername}/channel/chat`} passHref>
            <TabsTrigger value="chat-settings">
              Chat
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/${streamerUsername}/channel/roles`} passHref>
            <TabsTrigger value="roles">
              Roles
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/${streamerUsername}/channel/community`} passHref> {/* Обновлена ссылка на базовый URL */}
            <TabsTrigger value="community">
              Community
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}