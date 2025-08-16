"use client"

import React from "react"
import ReactPlayer from "react-player/lazy"

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: string
  }>
}

export function StreamPlayer({ sources }: StreamPlayerProps) {
  // Find the HLS or WebRTC source
  const hlsSource = sources.find(s => s.sourceType === "HLS")
  const webRTCSrc = sources.find(s => s.sourceType === "WebRTC")

  let urlToPlay = ""
  if (hlsSource) {
    urlToPlay = hlsSource.url
  } else if (webRTCSrc) {
    urlToPlay = webRTCSrc.url
  }

  if (!urlToPlay) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        No stream source available.
      </div>
    )
  }

  return (
    <div className="relative pt-[56.25%] w-full h-full"> {/* 16:9 Aspect Ratio */}
      <ReactPlayer
        url={urlToPlay}
        playing
        controls
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
        config={{
          file: {
            hlsOptions: {
              // HLS.js options if needed
            },
            forceHLS: hlsSource ? true : false,
            forceRTC: webRTCSrc ? true : false,
          },
        }}
      />
    </div>
  )
}