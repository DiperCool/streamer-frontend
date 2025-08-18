"use client"

import React from "react"
import ReactPlayer from "react-player" // Прямой импорт ReactPlayer
import {StreamSourceType} from "@/graphql/__generated__/graphql";

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: StreamSourceType
  }>
}

export function StreamPlayer({ sources }: StreamPlayerProps) {
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
        playing // Воспроизведение по умолчанию
        controls={true} // Включаем стандартные элементы управления браузера
        width="100%"
        height="100%"
        className="z-[15]"
      />
    </div>
  )
}