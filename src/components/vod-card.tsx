"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { MoreVertical } from "lucide-react"
import { VodDto, VodType } from "@/graphql/__generated__/graphql"
import { getMinioUrl, formatVodDuration } from "@/utils/utils"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface VodCardProps {
  vod: VodDto
  isCurrentStream?: boolean
}

export function VodCard({ vod, isCurrentStream = false }: VodCardProps) {
  const thumbnailUrl = vod.preview ? getMinioUrl(vod.preview) : "/placeholder.jpg"
  const timeAgo = formatDistanceToNowStrict(new Date(vod.createdAt), { addSuffix: true });

  const streamerName = vod.streamer?.userName || "Unknown Streamer";
  const streamerAvatar = vod.streamer?.avatar;

  const isPrivate = vod.type === VodType.Private;

  return (
    <div className="group relative w-full cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
      <Link href={`/vod/${vod.id}`} className="block">
        <div className="relative w-full aspect-video">
          <Image
            src={thumbnailUrl}
            alt={vod.title || "Video thumbnail"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className={cn(
              "transition-transform duration-200 group-hover:scale-105",
              isPrivate && "filter brightness-50"
            )}
          />
          {isPrivate && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="text-white text-xl font-bold bg-black/50 px-4 py-2 rounded-md">PRIVATE</span>
            </div>
          )}
          {isCurrentStream && (
            <Badge variant="statusCurrentStream" className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-semibold z-10">
              Current Stream
            </Badge>
          )}
          <Badge variant="infoViewers" className="absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-semibold z-10">
            {formatVodDuration(vod.duration)}
          </Badge>
          <Badge variant="infoViewers" className="absolute bottom-2 right-2 px-2 py-1 rounded-md text-xs font-semibold z-10">
            {vod.views} views
          </Badge>
        </div>
      </Link>
      <div className="p-3 flex items-start justify-between">
        <div className="flex-1 pr-2">
          <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-green-400 transition-colors">
            {vod.title || "Untitled Video"}
          </h3>
          <div className="flex items-center mt-1">
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
          <div className="flex flex-wrap gap-1.5 mt-2">
            {vod.category?.title && (
              <Badge variant="itemCategory">
                {vod.category.title}
              </Badge>
            )}
            {vod.language && (
              <Badge variant="itemLanguage">
                {vod.language}
              </Badge>
            )}
            {vod.tags && vod.tags.length > 0 && (
              vod.tags.map((tag) => (
                <Badge key={tag.id} variant="itemTag">
                  {tag.title}
                </Badge>
              ))
            )}
          </div>
        </div>
        <div className="h-8 w-8 flex-shrink-0" />
      </div>
    </div>
  )
}