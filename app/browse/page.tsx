"use client"

import React from "react"
import { useGetTopStreamsQuery } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { TopStreamCard } from "@/src/components/top-stream-card"

export default function BrowsePage() {
  const { data, loading, error } = useGetTopStreamsQuery();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-red-500">Error loading top streams: {error.message}</p>
      </div>
    )
  }

  const topStreams = data?.topStreams || [];

  return (
    <div className="px-4 py-8"> {/* Removed container mx-auto */}
      <h1 className="text-3xl font-bold text-white mb-6">Top Live Streams</h1>
      {topStreams.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No live streams currently available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topStreams.map((stream) => (
            <TopStreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      )}
    </div>
  )
}