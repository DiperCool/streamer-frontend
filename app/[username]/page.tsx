"use client"

import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useGetStreamerQuery, useGetVodsQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { VodCard } from "@/src/components/vod-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StreamerSubscribeButton } from "@/src/components/streamer-subscribe-button" // Import the new component

export default function StreamerRootProfilePage({ params }: { params: { username: string } }) {
  const { username } = params
  const { isAuthenticated, isLoading } = useAuth0()

  const { data: streamerData, loading: streamerLoading } = useGetStreamerQuery({
    variables: { userName: username },
  })

  const streamer = streamerData?.streamer;
  const streamerId = streamer?.id;
  const subscriptionEnabled = streamer?.subscriptionEnabled ?? false;

  const {
    data: vodsData,
    loading: vodsLoading,
    error: vodsError,
  } = useGetVodsQuery({
    variables: {
      streamerId: streamerId ?? "",
      first: 4,
      order: [{ createdAt: SortEnumType.Desc }],
    },
    skip: !streamerId,
  });

  if (isLoading || streamerLoading || vodsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const vods = vodsData?.vods?.nodes || [];

  if (vodsError) {
    return <div className="text-red-500 p-4">Error loading videos: {vodsError.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Streamer Profile</h3> {/* Placeholder for streamer info */}
        {streamerId && subscriptionEnabled && (
          <StreamerSubscribeButton streamerId={streamerId} streamerUserName={username} />
        )}
      </div>

      {vods.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Latest Videos</h3>

            <Link href={`/${username}/videos`} passHref>
              <Button variant="ghost" className="text-green-500 hover:text-white">
                Show More
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vods.map((vod) => (
              <VodCard key={vod.id} vod={vod} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}