"use client"

import React, { useRef } from "react" // Добавлен useRef
import ReactPlayer from "react-player"
import { Maximize } from "lucide-react" // Импортирована иконка Maximize
import { Button } from "@/components/ui/button" // Импортирован компонент Button

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: string
  }>
}

export function StreamPlayer({ sources }: StreamPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null) // Создан ref для ReactPlayer
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

  const handleFullscreen = () => {
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer()
      // Проверяем, является ли внутренний плеер видеоэлементом и поддерживает ли он полноэкранный режим
      if (internalPlayer instanceof HTMLVideoElement) {
        if (internalPlayer.requestFullscreen) {
          internalPlayer.requestFullscreen();
        } else if (internalPlayer.webkitEnterFullscreen) { // Для Safari
          internalPlayer.webkitEnterFullscreen();
        }
        // Можно добавить другие префиксы для кроссбраузерности, если необходимо
      }
    }
  }

  return (
    <div className="absolute inset-0"> {/* Этот div заставляет StreamPlayer заполнять родительский контейнер */}
      <ReactPlayer
        ref={playerRef} // Присваиваем ref
        src={urlToPlay}
        playing
        controls={false} // Отключаем стандартные элементы управления
        width="100%"
        height="100%"
        className="z-[15]" // Убедимся, что плеер находится поверх других элементов
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 right-4 z-20 text-white hover:bg-gray-700/50"
        onClick={handleFullscreen}
      >
        <Maximize className="h-5 w-5" />
      </Button>
    </div>
  )
}