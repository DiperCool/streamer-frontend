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

export default function CommunityLayout({
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
    if (pathname.includes(`/dashboard/${streamerUsername}/channel/community/followers`)) {
      return "followers";
    }
    return "overview"; // Default tab
  };
  const activeTab = getActiveTab();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-2 text-white">Community Management</h1>

      <Tabs value={activeTab} className="w-full">
        <TabsList className="bg-gray-900 mb-8" currentValue={activeTab}>
          <Link href={`/dashboard/${streamerUsername}/channel/community/overview`} passHref>
            <TabsTrigger value="overview">
              Overview
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/${streamerUsername}/channel/community/followers`} passHref>
            <TabsTrigger value="followers">
              Followers
            </TabsTrigger>
          </Link>
        </TabsList>

        {children}
      </Tabs>
    </div>
  );
}