"use client"

import React, { useRef, useState } from "react"
import ReactPlayer from "react-player"
import { Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: string
  }>
}

export function StreamPlayer({ sources }: StreamPlayerProps) {
  const playerRef = useRef<React.ElementRef<typeof ReactPlayer>>(null)
  const [internalVideoElement, setInternalVideoElement] = useState<HTMLVideoElement | null>(null);

  const hlsSource = sources.find(s => s.sourceType === "HLS")

  let urlToPlay = ""
  if (hlsSource) {
    urlToPlay = hlsSource.url
  }

  if (!urlToPlay) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        No HLS stream source available.
      </div>
    )
  }

  const handleReady = () => { // Изменено: теперь без аргументов
    if (playerRef.current) { // Доступ к экземпляру через ref
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer instanceof HTMLVideoElement) {
        setInternalVideoElement(internalPlayer);
      }
    }
  };

  const handleFullscreen = () => {
    if (internalVideoElement) {
      if (internalVideoElement.requestFullscreen) {
        internalVideoElement.requestFullscreen();
      } else if ((internalVideoElement as any).webkitEnterFullscreen) {
        (internalVideoElement as any).webkitEnterFullscreen();
      }
    } else {
      console.warn("Internal video element not ready for fullscreen.");
    }
  }

  return (
    <div className="absolute inset-0">
      <ReactPlayer
        ref={playerRef}
        url={urlToPlay}
        playing
        controls={false}
        width="100%"
        height="100%"
        className="z-[15]"
        onReady={handleReady}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 right-4 z-20 text-white hover:bg-gray-700/50"
        onClick={handleFullscreen}
        disabled={!internalVideoElement}
      >
        <Maximize className="h-5 w-5" />
      </Button>
    </div>
  )
}