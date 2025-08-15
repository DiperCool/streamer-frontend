"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/app/settings/profile/profileSettings"
import { usePathname, useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine the active tab based on the current URL path
  // Since only 'profile' tab will remain, we can simplify this.
  const activeTab = "profile";

  const handleTabChange = (value: string) => {
    if (value === "profile") {
      router.push("/settings/profile");
    }
    // No other tabs to handle
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
            {/* Removed Stream URL and Key tab */}
          </TabsList>

          <TabsContent value="profile" className="space-y-8">
            <ProfileSettings />
          </TabsContent>
          {/* Removed Stream URL and Key content */}
        </Tabs>
      </div>
    </div>
  )
}