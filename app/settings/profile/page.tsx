"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {ProfileSettings} from "@/app/settings/profile/profileSettings";

export default function SettingsProfilePage() {
  return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
          </div>

          {/* Navigation Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-gray-900 mb-8">
              <TabsTrigger value="profile">
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <ProfileSettings/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}