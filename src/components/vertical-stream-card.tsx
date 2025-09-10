"use client"

import React from "react"
import Image from "next/image"
import { Users } from "lucide-react"
import { StreamDto } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface VerticalStreamCardProps {
  stream: StreamDto;
  onClick: () => void;
  selected?: boolean;
}

export const VerticalStreamCard: React.FC<VerticalStreamCardProps> = React.memo(
  ({ stream, onClick, selected }) => {
    const previewUrl = stream.preview ? getMinioUrl(stream.preview) : "/placeholder.jpg";
    const streamerName = stream.streamer?.userName || "Unknown Streamer";
    const streamerAvatar = stream.streamer?.avatar || "/placeholder-user.jpg";
    const currentViewers = stream.currentViewers || 0;

    return (
      <div
        className={cn(
          "group relative w-full h-40 cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-200",
          selected && "border-2 border-green-500"
        )}
        onClick={onClick}
      >
        <Image
          src={previewUrl}
          alt={stream.title || "Stream preview"}
          fill
          sizes="256px"
          style={{ objectFit: "cover" }}
          className="absolute inset-0 w-full h-full"
        />
        {/* Overlay for darkening and text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

        {stream.active && (
          <Badge className="absolute top-2.5 left-2.5 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold z-10 flex items-center">
            <Users className="w-3.5 h-3.5 mr-1" />
            {currentViewers >= 1000 ? `${(currentViewers / 1000).toFixed(1)}K` : currentViewers}
          </Badge>
        )}

        {/* Stream Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10 flex items-center space-x-2.5">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={getMinioUrl(streamerAvatar)} alt={streamerName} />
            <AvatarFallback className="bg-green-600 text-white text-sm">
              {streamerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-semibold text-white line-clamp-1 group-hover:text-green-400 transition-colors">
              {stream.title || "Untitled Stream"}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-1">{streamerName}</p>
          </div>
        </div>
      </div>
    );
  }
);

VerticalStreamCard.displayName = "VerticalStreamCard";