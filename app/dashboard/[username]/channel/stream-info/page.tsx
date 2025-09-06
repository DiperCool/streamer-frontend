"use client"

import React from "react"
import { StreamInfoWidget } from "@/src/components/dashboard/widgets/stream-info-widget"

export default function StreamInfoSettingsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Stream Information</h2>
      <StreamInfoWidget />
    </div>
  )
}