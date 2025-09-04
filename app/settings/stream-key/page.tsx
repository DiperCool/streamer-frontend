"use client"

import React from "react"
import { StreamSettingsForm } from "@/app/dashboard/[username]/channel/stream-key/StreamSettingsForm" // Используем существующую форму

export default function StreamKeySettingsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Stream URL and Key</h2>
      <StreamSettingsForm />
    </div>
  )
}