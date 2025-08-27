"use client"

import React from "react"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import ReactPlayer from "react-player"; // Re-import ReactPlayer

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: StreamSourceType
  }>
  isPlayerMaximized: boolean;
  onTogglePlayerMaximize: () => void;
}

export function StreamPlayer({ sources, isPlayerMaximized, onTogglePlayerMaximize }: StreamPlayerProps) {
  const whepSource = sources.find(s => s.sourceType === "WEB_RTC")
  const urlToPlay = whepSource ? whepSource.url : "";

  if (!urlToPlay) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        No WHEP stream source available.
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <ReactPlayer
        url={urlToPlay} // Используем проп 'url' для ReactPlayer
        playing
        controls={true}
        width="100%"
        height="100%"
        className="z-[15]"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 right-4 z-20 text-white hover:bg-gray-700/50"
        onClick={onTogglePlayerMaximize}
      >
        {isPlayerMaximized ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
      </Button>
    </div>
  )
}