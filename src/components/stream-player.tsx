"use client"

import React from "react"
import ReactPlayer from "react-player"

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: string
  }>
}

export function StreamPlayer({ sources }: StreamPlayerProps) {
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

  return (
    <ReactPlayer
      src={urlToPlay}
      playing
      controls={false} {/* Изменено на false для удаления элементов управления */}
      width="100%"
      height="100%"
      className="absolute top-0 left-0 z-[15]"
    />
  )
}