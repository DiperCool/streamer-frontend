"use client"

import React from "react"
import { StreamerAboutSection } from "@/src/components/streamer-about-section"
import { useGetProfileQuery, useGetStreamerQuery } from "@/graphql/__generated__/graphql"

export default function StreamerAboutPage({ params }: { params: { username: string } }) {
  const { username } = params

  const { data: streamerData, loading: streamerLoading } = useGetStreamerQuery({
    variables: {
      userName: username,
    },
  })
  const { data: profileData, loading: profileLoading } = useGetProfileQuery({
    variables: {
      streamerId: streamerData?.streamer.id ?? "",
    },
    skip: !streamerData?.streamer.id,
  })

  if (streamerLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamerProfile = profileData?.profile
  const streamer = streamerData?.streamer

  if (!streamer || !streamerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer not found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StreamerAboutSection streamer={streamer} profile={streamerProfile} />
    </div>
  )
}