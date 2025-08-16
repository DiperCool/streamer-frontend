"use client"

import React, { useRef, useState, useCallback } from "react"
import ReactPlayer from "react-player"
import { Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: string
  }>
}

// Определяем интерфейс для экземпляра ReactPlayer, чтобы TypeScript знал о методе getInternalPlayer
interface IReactPlayerInstance {
  getInternalPlayer: (key?: string) => HTMLVideoElement | undefined;
}

export function StreamPlayer({ sources }: StreamPlayerProps) {
  const playerRef = useRef<IReactPlayerInstance | null>(null)
  const [internalVideoElement, setInternalVideoElement] = useState<HTMLVideoElement | null>(null);

  const hlsSource = sources.find(s => s.sourceType === "HLS")
  const urlToPlay = hlsSource ? hlsSource.url : "";

  // Обработчик готовности плеера
  const handleReady = useCallback(() => {
    console.log("ReactPlayer is ready!");
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      console.log("Internal player from getInternalPlayer():", internalPlayer);

      let videoElement: HTMLVideoElement | null = null;

      // Проверяем, является ли это напрямую видеоэлементом
      if (internalPlayer instanceof HTMLVideoElement) {
        videoElement = internalPlayer;
      }
      // Проверяем, является ли это экземпляром hls.js (распространено для HLS-потоков)
      else if (internalPlayer && typeof internalPlayer === 'object' && 'media' in internalPlayer && (internalPlayer as any).media instanceof HTMLVideoElement) {
        videoElement = (internalPlayer as any).media;
      }

      if (videoElement) {
        setInternalVideoElement(videoElement);
        console.log("internalVideoElement set to:", videoElement);
      } else {
        console.log("Could not find HTMLVideoElement from internal player.");
      }
    }
  }, []);

  // Переключение полноэкранного режима
  const handleFullscreen = useCallback(() => {
    if (internalVideoElement) {
      if (internalVideoElement.requestFullscreen) {
        internalVideoElement.requestFullscreen();
      } else if ((internalVideoElement as any).webkitEnterFullscreen) {
        (internalVideoElement as any).webkitEnterFullscreen();
      }
    } else {
      console.warn("Internal video element not ready for fullscreen.");
    }
  }, [internalVideoElement]);

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
        ref={(player: any) => {
          if (player && typeof player.getInternalPlayer === 'function') {
            playerRef.current = player as IReactPlayerInstance;
          } else {
            playerRef.current = null;
          }
        }}
        url={urlToPlay}
        playing // Воспроизведение по умолчанию
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
        disabled={!internalVideoElement} // Снова включаем disabled
      >
        <Maximize className="h-5 w-5" />
      </Button>
    </div>
  )
}