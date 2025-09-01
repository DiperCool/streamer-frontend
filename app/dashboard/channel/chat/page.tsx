"use client"

import React from "react"
import { ChatSettingsForm } from "./ChatSettingsForm" // Updated import path

export default function ChatSettingsPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Chat Settings</h2>
      <ChatSettingsForm />
    </div>
  )
}