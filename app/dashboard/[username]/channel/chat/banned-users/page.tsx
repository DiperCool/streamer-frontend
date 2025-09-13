"use client"

import React from "react"
import { BannedUsersTab } from "@/src/components/dashboard/chat/BannedUsersTab"

export default function BannedUsersPage() {
  return (
    <div className="space-y-8">
      <BannedUsersTab />
    </div>
  )
}