"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/app/settings/profile/profileSettings"
import StreamSettingsPage from "@/app/settings/stream/page" // Import the new StreamSettingsPage
import { usePathname, useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine the active tab based on the current URL path
  const getActiveTab = () => {
    if (pathname.includes("/settings/stream")) {
      return "stream";
    }
    return "profile"; // Default to profile
  };

  const activeTab = getActiveTab();

  const handleTabChange = (value: string) => {
    if (value === "profile") {
      router.push("/settings/profile");
    } else if (value === "stream") {
      router.push("/settings/stream");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-gray-900 mb-8" currentValue={activeTab}>
            <TabsTrigger value="profile">
              Profile
            </TabsTrigger>
            <TabsTrigger value="stream">
              Stream URL and Key
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-8">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="stream" className="space-y-8">
            <StreamSettingsPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}