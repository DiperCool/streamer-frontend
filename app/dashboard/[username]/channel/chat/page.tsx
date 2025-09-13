"use client"

import React, { useState } from "react"
import { ChatSettingsForm } from "./ChatSettingsForm"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BannedUsersTab } from "@/src/components/dashboard/chat/BannedUsersTab"
import { useDashboard } from "@/src/contexts/DashboardContext"

export default function ChatSettingsPage() {
  const pathname = usePathname();
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";

  const getActiveTab = () => {
    if (pathname.includes("banned-users")) {
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
          <Link href={`/dashboard/${activeStreamer?.userName}/channel/chat`} passHref>
            <TabsTrigger value="settings">
              Settings
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/${activeStreamer?.userName}/channel/chat/banned-users`} passHref>
            <TabsTrigger value="banned-users">
              Banned Users
            </TabsTrigger>
          </Link>
        </TabsList>

        <TabsContent value="settings">
          <ChatSettingsForm />
        </TabsContent>
        <TabsContent value="banned-users">
          <BannedUsersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}