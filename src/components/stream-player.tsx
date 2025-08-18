"use client"

import React from "react"
import ReactPlayer from "react-player"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
import { Button } from "@/components/ui/button";
import { MessageSquare, Maximize, Minimize } from "lucide-react";

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: StreamSourceType
  }>
  showChatToggleButton: boolean; // Изменено название пропса
  onToggleChat: () => void; // Изменено название пропса
  isPlayerMaximized: boolean;
  onTogglePlayerMaximize: () => void;
}

export function StreamPlayer({ sources, showChatToggleButton, onToggleChat, isPlayerMaximized, onTogglePlayerMaximize }: StreamPlayerProps) {
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
        src={urlToPlay}
        playing
        controls={true}
        width="100%"
        height="100%"
        className="z-[15]"
      />
      {showChatToggleButton && ( // Используем новый пропс
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-2"
          onClick={onToggleChat} // Используем новый пропс
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}
      {/* Кнопка максимизации/минимизации плеера */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-16 z-20 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-2"
        onClick={onTogglePlayerMaximize}
      >
        {isPlayerMaximized ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
      </Button>
    </div>
  )
}