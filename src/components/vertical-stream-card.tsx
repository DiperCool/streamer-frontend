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
    const currentViewers = stream.currentViewers || 0;

    return (
      <div
        className={cn(
          "group relative w-full flex cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-200",
          selected && "border-2 border-green-500"
        )}
        onClick={onClick}
      >
        <div className="relative flex-shrink-0 w-full h-full rounded-md overflow-hidden">
          <Image
            src={previewUrl}
            alt={stream.title || "Stream preview"}
            fill
            sizes="256px"
            style={{ objectFit: "cover" }}
          />
          {/* Overlay for darkening and text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          {stream.active && (
            <Badge className="absolute top-1 left-1 bg-red-600 text-white px-1 py-0.5 rounded-md text-xs font-semibold z-10">
              LIVE
            </Badge>
          )}

          {/* Stream Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
            <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-green-400 transition-colors">
              {stream.title || "Untitled Stream"}
            </h3>
            <p className="text-xs text-gray-300 line-clamp-1">{streamerName}</p>
            <div className="flex items-center text-gray-400 text-xs mt-1">
              <Users className="w-3 h-3 mr-1" />
              <span>{currentViewers >= 1000 ? `${(currentViewers / 1000).toFixed(1)}K` : currentViewers}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VerticalStreamCard.displayName = "VerticalStreamCard";