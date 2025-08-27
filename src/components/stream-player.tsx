"use client"

import React from "react"
import ReactPlayer from "react-player"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: StreamSourceType
  }>
  isPlayerMaximized: boolean;
  onTogglePlayerMaximize: () => void;
}

export function StreamPlayer({ sources, isPlayerMaximized, onTogglePlayerMaximize }: StreamPlayerProps) {
  const hlsSource = sources.find(s => s.sourceType === "HLS")
  const urlToPlay = hlsSource ? hlsSource.url : "";

  if (!urlToPlay) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        No HLS stream source available.
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <ReactPlayer
        url={urlToPlay}
        playing
        controls={true}
        width="100%"
        height="100%"
        className="z-[15]"
      />
    </div>
  )
}