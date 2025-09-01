"use client"

import React from "react"

export default function DashboardHomePage({ params }: { params: { username: string } }) {
  const { username } = params;
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Creator Dashboard for {username}</h1>
      <p className="text-gray-400">Welcome to your creator dashboard! Here you can manage your streams, content, and community.</p>
      {/* Add more dashboard home content here */}
    </div>
  )
}