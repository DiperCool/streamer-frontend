"use client"

import React from "react"
import { StreamerAboutSection } from "@/src/components/streamer-about-section"
import { useGetProfileQuery, useGetStreamerQuery, useStreamerInteractionQuery } from "@/graphql/__generated__/graphql"
import { StreamerBannersSection } from "@/src/components/streamer-banners-section"
import { Loader2 } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"

export default function StreamerAboutPage({ params }: { params: { username: string } }) {
  const { username } = params
  const { isAuthenticated, isLoading: authLoading } = useAuth0();

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

  const { data: streamerInteractionData, loading: streamerInteractionLoading } = useStreamerInteractionQuery({
    variables: { streamerId: streamerData?.streamer.id ?? "" },
    skip: !isAuthenticated || authLoading || !streamerData?.streamer.id,
  });

  if (streamerLoading || profileLoading || authLoading || streamerInteractionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamerProfile = profileData?.profile
  const streamer = streamerData?.streamer
  // canManageBanners теперь используется только для определения, может ли пользователь редактировать/добавлять баннеры
  const canManageBanners = streamerInteractionData?.streamerInteraction?.permissions?.isAll || streamerInteractionData?.streamerInteraction?.permissions?.isBanners;

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
      
      {/* StreamerBannersSection теперь всегда рендерится */}
      <StreamerBannersSection streamerId={streamer.id} canManageBanners={canManageBanners ?? false} className="mt-8" />
    </div>
  )
}