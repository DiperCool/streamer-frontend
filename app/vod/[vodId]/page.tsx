"use client"

import React from "react"
import { useGetVodQuery, useGetStreamerQuery, useGetProfileQuery } from "@/graphql/__generated__/graphql"
import ReactPlayer from "react-player"
import { Loader2 } from "lucide-react"
import { getMinioUrl } from "@/utils/utils"
import { VodDetailsSection } from "@/src/components/vod-details-section"

export default function VodDetailPage({ params }: { params: { vodId: string } }) {
  const { vodId } = params

  const { data: vodData, loading: vodLoading, error: vodError } = useGetVodQuery({
    variables: { vodId },
  })

  const streamerId = vodData?.vod?.streamer?.id ?? ""

  const { data: streamerData, loading: streamerLoading, error: streamerError } = useGetStreamerQuery({
    variables: { userName: vodData?.vod?.streamer?.userName ?? "" },
    skip: !streamerId,
  })

  const { data: profileData, loading: profileLoading, error: profileError } = useGetProfileQuery({
    variables: { streamerId },
    skip: !streamerId,
  })

  if (vodLoading || streamerLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    )
  }

  if (vodError || streamerError || profileError || !vodData?.vod) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Error loading VOD or streamer data: {vodError?.message || streamerError?.message || profileError?.message || "VOD not found."}</p>
      </div>
    )
  }

  const vod = vodData.vod
  const streamer = streamerData?.streamer
  const profile = profileData?.profile

  if (!streamer || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer profile not found for this VOD.</p>
      </div>
    )
  }

  const videoSource = vod.source ? getMinioUrl(vod.source) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Video Player Section */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-6">
          {videoSource ? (
            <ReactPlayer
              url={videoSource}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              className="z-10"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400">
              <p>No video source available for this VOD.</p>
            </div>
          )}
        </div>

        {/* VOD Details and Streamer Info */}
        <VodDetailsSection vod={vod} streamer={streamer} profile={profile} />
      </div>
    </div>
  )
}