"use client"

import React from "react"
import Image from "next/image"
import { StreamDto } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface SmallStreamPreviewCardProps {
  stream: StreamDto
  onClick: (index: number) => void
  index: number
  selected: boolean
}

export const SmallStreamPreviewCard: React.FC<SmallStreamPreviewCardProps> = React.memo(
  ({ stream, onClick, index, selected }) => {
    const previewUrl = stream.preview ? getMinioUrl(stream.preview) : "/placeholder.jpg"
    const streamerAvatar = stream.streamer?.avatar || "/placeholder-user.jpg"
    const streamerName = stream.streamer?.userName || "Unknown Streamer"

    return (
      <div
        className={cn(
          "flex-shrink-0 w-40 cursor-pointer rounded-lg overflow-hidden transition-all duration-200",
          "border-2",
          selected ? "border-green-500 scale-105" : "border-transparent hover:border-gray-600",
          "bg-gray-800"
        )}
        onClick={() => onClick(index)}
      >
        <div className="relative w-full aspect-video">
          <Image
            src={previewUrl}
            alt={stream.title || "Stream preview"}
            fill
            sizes="160px"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="p-2 flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={getMinioUrl(streamerAvatar)} alt={streamerName} />
            <AvatarFallback className="bg-green-600 text-white text-xs">
              {streamerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-white font-medium truncate">{streamerName}</span>
        </div>
      </div>
    )
  }
)

SmallStreamPreviewCard.displayName = "SmallStreamPreviewCard";