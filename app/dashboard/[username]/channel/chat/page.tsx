"use client"

import React from "react"
import { ChatSettingsForm } from "./ChatSettingsForm"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDashboard } from "@/src/contexts/DashboardContext"

export default function ChatSettingsPage() {
  const pathname = usePathname();
  const { activeStreamer } = useDashboard();
  const streamerUsername = activeStreamer?.userName ?? "";

  // Determine the active tab based on the current pathname
  const activeTab = pathname.includes("banned-users") ? "banned-users" : "settings";

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

        <TabsContent value="settings">
          <ChatSettingsForm />
        </TabsContent>
        {/* The BannedUsersTab content is now rendered by its own page.tsx */}
      </Tabs>
    </div>
  )
}