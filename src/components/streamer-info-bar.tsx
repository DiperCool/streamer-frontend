"use client"

import React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Share2, Settings, ExternalLink, Users, CheckCircle } from "lucide-react"
import { ProfileDto, StreamerDto, StreamDto } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"

interface StreamerInfoBarProps {
  streamer: StreamerDto
  profile: ProfileDto
  currentStream?: StreamDto | null
  isCurrentUserProfile: boolean
  isLive: boolean; // Добавляем пропс isLive
}

export function StreamerInfoBar({ streamer, profile, currentStream, isCurrentUserProfile, isLive }: StreamerInfoBarProps) {
  const avatarImage = streamer.avatar || "/placeholder-user.jpg";

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        {/* Left Section: Avatar, Name, Followers */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-green-500">
              <AvatarImage src={getMinioUrl(avatarImage)} alt="Streamer Avatar" />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {streamer.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isLive && (
              <Badge className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                LIVE
              </Badge>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-white">{streamer.userName}</h1>
              <CheckCircle className="w-5 h-5 text-green-500" /> {/* Verified badge */}
            </div>
            <p className="text-gray-400">{streamer.followers} followers</p>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white">
            Follow
          </Button>
          <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-white">
            Gift Subs
          </Button>
          <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-white">
            Subscribe
          </Button>
        </div>
      </div>

      {/* Stream Title, Live Status, Tags (left) and Viewers, Share, Settings (right) */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-3">
          {isLive ? (
            <>
              {currentStream?.title && (
                <p className="text-white text-lg font-semibold">{currentStream.title}</p>
              )}
            </>
          ) : (
            <Badge className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-semibold">
              OFFLINE
            </Badge>
          )}
          {/* Placeholder for tags - these would typically come from the stream or profile data */}
          <Badge variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
            Live DJ
          </Badge>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
            English
          </Badge>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
            Music
          </Badge>
        </div>
        <div className="flex items-center space-x-2"> {/* Group for Viewers, Share, Settings */}
          {isLive && currentStream?.currentViewers !== undefined && (
            <span className="text-white text-sm flex items-center">
              <Users className="w-4 h-4 mr-1" /> {currentStream.currentViewers} Viewers
            </span>
          )}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}