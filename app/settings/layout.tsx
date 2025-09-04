"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const getActiveTab = () => {
    if (pathname.includes("/settings/profile")) {
      return "profile";
    }
    if (pathname.includes("/settings/stream-key")) {
      return "stream-key";
    }
    return "profile"; 
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} className="w-full">
          <TabsList className="bg-gray-900 mb-8" currentValue={activeTab}>
            <Link href="/settings/profile" passHref>
              <TabsTrigger value="profile">
                Profile
              </TabsTrigger>
            </Link>
            <Link href="/settings/stream-key" passHref>
              <TabsTrigger value="stream-key">
                Stream URL & Key
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
        {children}
      </div>
    </div>
  )
}