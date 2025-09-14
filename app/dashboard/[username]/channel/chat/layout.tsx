"use client"

import React from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDashboard } from "@/src/contexts/DashboardContext"

export default function ChatLayout({
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
    return "settings";
  };
  const activeTab = getActiveTab();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-2 text-white">Chat Management</h1>

      <Tabs value={activeTab} className="w-full">
        <TabsList className="bg-gray-900 mb-8" currentValue={activeTab}>
          <Link href={`/dashboard/${streamerUsername}/channel/chat`} passHref>
            <TabsTrigger value="settings">
              Settings
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/${streamerUsername}/channel/chat/banned-users`} passHref>
            <TabsTrigger value="banned-users">
              Banned Users
            </TabsTrigger>
          </Link>
        </TabsList>

        {/* Children will be the actual page content (ChatSettingsForm or BannedUsersTab) */}
        {children}
      </Tabs>
    </div>
  );
}