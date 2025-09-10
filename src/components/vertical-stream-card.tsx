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
          "group relative w-full flex items-center space-x-3 cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors duration-200",
          selected && "border-2 border-green-500"
        )}
        onClick={onClick}
      >
        <div className="relative flex-shrink-0 w-64 h-36 rounded-md overflow-hidden">
          <Image
            src={previewUrl}
            alt={stream.title || "Stream preview"}
            fill
            sizes="256px"
            style={{ objectFit: "cover" }}
          />
          {stream.active && (
            <Badge className="absolute top-1 left-1 bg-red-600 text-white px-1 py-0.5 rounded-md text-xs font-semibold z-10">
              LIVE
            </Badge>
          )}
        </div>

        <div className="flex-1 min-w-0 p-3"> {/* Added padding to the text content */}
          <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-green-400 transition-colors">
            {stream.title || "Untitled Stream"}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1">{streamerName}</p>
          <div className="flex items-center text-gray-500 text-xs mt-1">
            <Users className="w-3 h-3 mr-1" />
            <span>{currentViewers >= 1000 ? `${(currentViewers / 1000).toFixed(1)}K` : currentViewers}</span>
          </div>
        </div>
      </div>
    );
  }
);

VerticalStreamCard.displayName = "VerticalStreamCard";