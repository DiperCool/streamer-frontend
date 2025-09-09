"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Users } from "lucide-react"
import { StreamDto } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface TopStreamCardProps {
  stream: StreamDto
}

export function TopStreamCard({ stream }: TopStreamCardProps) {
  const previewUrl = stream.preview ? getMinioUrl(stream.preview) : "/placeholder.jpg"
  const streamerAvatar = stream.streamer?.avatar || "/placeholder-user.jpg"
  const streamerName = stream.streamer?.userName || "Unknown Streamer"
  const currentViewers = stream.currentViewers || 0

  return (
    <Link href={`/${streamerName}`} passHref>
      <div className="group relative w-full cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
        {/* Stream Preview Image */}
        <div className="relative w-full aspect-video">
          <Image
            src={previewUrl}
            alt={stream.title || "Stream preview"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-200 group-hover:scale-105"
          />
          {/* Live Badge */}
          {stream.active && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
              LIVE
            </Badge>
          )}
          {/* Viewers Count */}
          <Badge className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold z-10 flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {currentViewers >= 1000 ? `${(currentViewers / 1000).toFixed(1)}K` : currentViewers} watching
          </Badge>
        </div>

        {/* Streamer Info and Title */}
        <div className="p-3 flex items-start space-x-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={getMinioUrl(streamerAvatar)} alt={streamerName} />
            <AvatarFallback className="bg-green-600 text-white text-sm">
              {streamerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-green-400 transition-colors">
              {stream.title || "Untitled Stream"}
            </h3>
            <p className="text-sm text-gray-400">{streamerName}</p>
            {stream.category?.title && (
              <p className="text-xs text-gray-500 mt-1">{stream.category.title}</p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {stream.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                  {tag.title}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}