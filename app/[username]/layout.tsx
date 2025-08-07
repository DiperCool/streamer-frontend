"use client"

import React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useGetProfileQuery, useGetStreamerQuery } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Share2, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"

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

  if (streamerLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamerProfile = profileData?.profile
  const streamer = streamerData?.streamer
  const isCurrentUserProfile = streamerData?.streamer.id === streamer?.id // This logic might need adjustment if 'me' query is available

  if (!streamer || !streamerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer not found.</p>
      </div>
    )
  }

  const bannerImage = streamerProfile.offlineStreamBanner || streamerProfile.channelBanner || "/placeholder.jpg"
  const avatarImage = streamer.avatar || "/placeholder-user.jpg"

  // Determine the active tab based on the current pathname
  const getActiveTab = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === username) return 'home'; // If URL is just /username, it's home
    if (lastSegment === 'about') return 'about';
    if (lastSegment === 'videos') return 'videos';
    if (lastSegment === 'clips') return 'clips';
    return 'home'; // Default to home if no specific tab is found
  };

  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Banner Section */}
      <div className="relative w-full h-24 md:h-32 lg:h-40 bg-gray-800 overflow-hidden">
        <Image
          src={getMinioUrl(bannerImage)}
          alt="Channel Banner"
          fill
          style={{ objectFit: "cover" }}
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 flex items-center space-x-3">
          <Badge className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            OFFLINE
          </Badge>
          <span className="text-white text-lg font-semibold">
            {streamer.userName} is offline
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      {/* Profile Header Section */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <Avatar className="w-20 h-20 border-2 border-green-500">
            <AvatarImage src={getMinioUrl(avatarImage)} alt="Streamer Avatar" />
            <AvatarFallback className="bg-blue-600 text-white text-xl">
              {streamer.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-white">{streamer.userName}</h1>
            <p className="text-gray-400">{streamer.followers} followers</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {isCurrentUserProfile && (
            <Link href="/settings/profile" passHref>
              <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-white">
                Customize channel
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 border-b border-gray-800">
        <Tabs value={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900" currentValue={activeTab}>
            <Link href={`/${username}`} passHref legacyBehavior> {/* Link to root for home */}
              <TabsTrigger value="home">
                Home
              </TabsTrigger>
            </Link>
            <Link href={`/${username}/about`} passHref legacyBehavior>
              <TabsTrigger value="about">
                About
              </TabsTrigger>
            </Link>
            <Link href={`/${username}/videos`} passHref legacyBehavior>
              <TabsTrigger value="videos">
                Videos
              </TabsTrigger>
            </Link>
            <Link href={`/${username}/clips`} passHref legacyBehavior>
              <TabsTrigger value="clips">
                Clips
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      {children} {/* This is where the nested page content will be rendered */}
    </div>
  )
}