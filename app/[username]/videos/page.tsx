"use client"

import React from "react"

export default function StreamerVideosPage({ params }: { params: { username: string } }) {
  const { username } = params
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Videos Content</h2>
      <p className="text-gray-400">This is the videos section for {username}.</p>
    </div>
  )
}