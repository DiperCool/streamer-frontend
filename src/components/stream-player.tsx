"use client"

import React from "react"
import dynamic from "next/dynamic" // Импортируем dynamic из next/dynamic
import {StreamSourceType} from "@/graphql/__generated__/graphql";

// Динамически импортируем ReactPlayer, чтобы он загружался только на клиенте
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

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

  // ReactPlayer будет null до тех пор, пока не будет загружен на клиенте
  if (!ReactPlayer) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        Loading player...
      </div>
    );
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