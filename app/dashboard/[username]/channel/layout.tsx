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

  return (
    <div className="space-y-8">
      {/* Заголовок "Channel Management" удален */}
      {children}
    </div>
  );
}