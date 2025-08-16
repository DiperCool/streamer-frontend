"use client"

import React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useGetProfileQuery, useGetStreamerQuery, useGetCurrentStreamQuery } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Share2, Settings, ExternalLink, Users } from "lucide-react"
import Link from "next/link"
import { StreamPlayer } from "@/src/components/stream-player"
import { StreamerInfoBar } from "@/src/components/streamer-info-bar" // Import the new component

export default function StreamerProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const { username } = params
  const pathname = usePathname()

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

  const { data: currentStreamData, loading: currentStreamLoading } = useGetCurrentStreamQuery({
    variables: {
      streamerId: streamerData?.streamer.id ?? "",
    },
    skip: !streamerData?.streamer.id,
  });

  if (streamerLoading || profileLoading || currentStreamLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamerProfile = profileData?.profile
  const streamer = streamerData?.streamer
  const currentStream = currentStreamData?.currentStream;
  const isLive = currentStream?.active;

  const isCurrentUserProfile = false; 

  if (!streamer || !streamerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer not found.</p>
      </div>
    )
  }

  const bannerImage = streamerProfile.offlineStreamBanner || streamerProfile.channelBanner || "/placeholder.jpg"

  const getActiveTab = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === username) return 'home';
    if (lastSegment === 'about') return 'about';
    if (lastSegment === 'videos') return 'videos';
    if (lastSegment === 'clips') return 'clips';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Banner/Stream Section */}
      {isLive && currentStream?.sources && currentStream.sources.length > 0 ? (
        <div className="relative w-full pt-[56.25%] bg-black"> {/* 16:9 aspect ratio container */}
          <StreamPlayer sources={currentStream.sources} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        </div>
      ) : (
        <div className="relative w-full pt-[56.25%] bg-gray-800 overflow-hidden"> {/* 16:9 aspect ratio container */}
          <Image
            src={getMinioUrl(bannerImage)}
            alt="Channel Banner"
            fill
            style={{ objectFit: "cover" }}
            sizes="100vw"
            priority
            className="absolute top-0 left-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        </div>
      )}

      {/* Streamer Info Bar */}
      <StreamerInfoBar
        streamer={streamer}
        profile={streamerProfile}
        currentStream={currentStream}
        isCurrentUserProfile={isCurrentUserProfile}
      />

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 border-b border-gray-800">
        <Tabs value={activeTab} className="w-full">
          <TabsList className="bg-gray-900" currentValue={activeTab}>
            <Link href={`/${username}`} passHref>
              <TabsTrigger value="home">
                Home
              </TabsTrigger>
            </Link>
            <Link href={`/${username}/about`} passHref>
              <TabsTrigger value="about">
                About
              </TabsTrigger>
            </Link>
            <Link href={`/${username}/videos`} passHref>
              <TabsTrigger value="videos">
                Videos
              </TabsTrigger>
            </Link>
            <Link href={`/${username}/clips`} passHref>
              <TabsTrigger value="clips">
                Clips
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  )
}