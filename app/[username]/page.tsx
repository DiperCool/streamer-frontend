"use client"

import React from "react" // Import React for useState
import Image from "next/image"
import {useGetProfileQuery, useGetMeQuery, useGetStreamerQuery} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Share2, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"
import { StreamerAboutSection } from "@/src/components/streamer-about-section"

export default function StreamerProfilePage({ params }: { params: { username: string } }) {
  const { username } = params
  const [activeTab, setActiveTab] = React.useState("home"); // Add state for active tab

  const { data: currentUserData, loading: currentUserLoading } = useGetStreamerQuery({
    variables:{
      userName: username
    }
  })
  const { data: profileData, loading: profileLoading } = useGetProfileQuery({
    variables: {
      streamerId: currentUserData?.streamer.id ?? "",
    },
    skip: !currentUserData?.streamer.id,
  })

  if (currentUserLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamerProfile = profileData?.profile
  const streamer = currentUserData?.streamer // Use streamer from currentUserData
  const isCurrentUserProfile = currentUserData?.streamer.id === streamer?.id

  if (!streamer || !streamerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer not found.</p>
      </div>
    )
  }

  const bannerImage = streamerProfile.offlineStreamBanner || streamerProfile.channelBanner || "/placeholder.jpg"
  const avatarImage = streamer.avatar || "/placeholder-user.jpg"

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"> {/* Make Tabs controlled */}
          <TabsList className="grid w-full grid-cols-4 bg-gray-900" currentValue={activeTab}> {/* Pass activeTabValue */}
            <TabsTrigger value="home">
              Home
            </TabsTrigger>
            <TabsTrigger value="about">
              About
            </TabsTrigger>
            <TabsTrigger value="videos">
              Videos
            </TabsTrigger>
            <TabsTrigger value="clips">
              Clips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="py-8">
            <h2 className="text-2xl font-semibold">Home Content</h2>
            <p className="text-gray-400">This is the home section for {streamer.userName}.</p>
          </TabsContent>
          <TabsContent value="about" className="py-8">
            {streamer && streamerProfile && (
              <StreamerAboutSection streamer={streamer} profile={{streamerId: streamer.id ,...streamerProfile}} />
            )}
          </TabsContent>
          <TabsContent value="videos" className="py-8">
            <h2 className="text-2xl font-semibold">Videos Content</h2>
            <p className="text-gray-400">This is the videos section for {streamer.userName}.</p>
          </TabsContent>
          <TabsContent value="clips" className="py-8">
            <h2 className="text-2xl font-semibold">Clips Content</h2>
            <p className="text-gray-400">This is the clips section for {streamer.userName}.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}