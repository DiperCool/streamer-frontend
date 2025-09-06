"use client"

import React from "react"
import { StreamInfoWidget } from "@/src/components/dashboard/widgets/stream-info-widget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Import Card components

export default function StreamInfoSettingsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Stream Information</h2>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Current Stream Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0"> {/* StreamInfoWidget now returns content directly */}
          <StreamInfoWidget />
        </CardContent>
      </Card>
    </div>
  )
}