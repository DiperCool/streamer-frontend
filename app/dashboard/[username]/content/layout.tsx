"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/src/contexts/DashboardContext"

export default function ContentLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const { username } = params;
  const pathname = usePathname();
  const { activeStreamerPermissions } = useDashboard();

  const getActiveTab = () => {
    if (pathname.includes(`/dashboard/${username}/content/vods-settings`)) {
      return "vods-settings";
    }
    if (pathname.includes(`/dashboard/${username}/content/vods`)) {
      return "vods";
    }
    // Default to vods if no specific tab is matched
    return "vods";
  };

  const activeTab = getActiveTab();
  const canManageVods = activeStreamerPermissions?.isAll || activeStreamerPermissions?.isVod;

  if (!canManageVods) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500">
        You do not have permission to manage VODs.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Content Management</h1>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsList className="bg-gray-900 mb-8" currentValue={activeTab}>
          <Link href={`/dashboard/${username}/content/vods`} passHref>
            <TabsTrigger value="vods">
              VODs
            </TabsTrigger>
          </Link>
          <Link href={`/dashboard/${username}/content/vods-settings`} passHref>
            <TabsTrigger value="vods-settings">
              VOD Settings
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}