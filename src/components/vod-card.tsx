"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { MoreVertical } from "lucide-react"
import { VodDto } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { formatDistanceToNowStrict } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Import Avatar components

interface VodCardProps {
  vod: VodDto
  isCurrentStream?: boolean // To show "Current Stream" badge
}

// Helper to format duration from milliseconds into HH:MM:SS
const formatDuration = (milliseconds: number): string => {
  if (isNaN(milliseconds) || milliseconds < 0) return "00:00";
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(String(hours).padStart(2, '0'));
  parts.push(String(minutes).padStart(2, '0'));
  parts.push(String(remainingSeconds).padStart(2, '0'));

  return parts.join(':');
};

export function VodCard({ vod, isCurrentStream = false }: VodCardProps) {
  const thumbnailUrl = vod.preview ? getMinioUrl(vod.preview) : "/placeholder.jpg"
  const timeAgo = formatDistanceToNowStrict(new Date(vod.createdAt), { addSuffix: true });

  const streamerName = vod.streamer?.userName || "Unknown Streamer";
  const streamerAvatar = vod.streamer?.avatar;

  return (
    <div className="group relative w-full cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
      <Link href={`/vods/${vod.id}`} className="block">
        <div className="relative w-full aspect-video">
          <Image
            src={thumbnailUrl}
            alt={vod.title || "Video thumbnail"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-200 group-hover:scale-105"
          />
          {isCurrentStream && (
            <Badge className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
              Current Stream
            </Badge>
          )}
          <Badge className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
            {formatDuration(vod.duration)}
          </Badge>
          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
            {vod.views} views
          </Badge>
        </div>
      </Link>
      <div className="p-3 flex items-start justify-between">
        <div className="flex-1 pr-2">
          <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-green-400 transition-colors">
            {vod.title || "Untitled Video"}
          </h3>
          <div className="flex items-center mt-1"> {/* Container for avatar and time ago */}
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage src={getMinioUrl(streamerAvatar!)} alt={streamerName} />
              <AvatarFallback className="bg-gray-600 text-white text-xs">
                {streamerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-gray-400">
              {timeAgo}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => e.stopPropagation()} // Prevent navigating when opening dropdown
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-gray-700 border-gray-600 text-white">
            <DropdownMenuItem className="hover:bg-green-600 hover:text-white cursor-pointer">
              Add to Watchlist
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-green-600 hover:text-white cursor-pointer">
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem className="hover:bg-red-600 hover:text-white cursor-pointer text-red-400">
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}