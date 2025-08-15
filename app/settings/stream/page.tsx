"use client"

import React from "react"
import { StreamSettingsForm } from "./StreamSettingsForm"

export default function StreamSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <StreamSettingsForm />
      </div>
    </div>
  )
}