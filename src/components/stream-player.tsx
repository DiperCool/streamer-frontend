"use client"

import React from "react"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
import ReactHlsPlayer from "react-hls-player"; // Используем react-hls-player
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: StreamSourceType
  }>
  isPlayerMaximized: boolean;
  onTogglePlayerMaximize: () => void;
  showPlayerControls?: boolean;
}

export function StreamPlayer({ sources, isPlayerMaximized, onTogglePlayerMaximize, showPlayerControls = true }: StreamPlayerProps) {
  // Теперь мы ищем только HLS-источник, так как WebRTC удален
  const hlsSource = sources.find(s => s.sourceType === StreamSourceType.Hls);

  const activeSource = hlsSource;

  if (!activeSource) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-lg">
        No stream source available.
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black">
      <ReactHlsPlayer
        src={activeSource.url}
        autoPlay={true} // react-hls-player использует autoPlay
        controls={false}
        width="100%"
        height="100%"
        muted={false}
      />
      {showPlayerControls && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePlayerMaximize}
          className="absolute bottom-4 right-4 z-10 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-2"
          title={isPlayerMaximized ? "Minimize Player" : "Maximize Player"}
        >
          {isPlayerMaximized ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
      )}
    </div>
  );
}