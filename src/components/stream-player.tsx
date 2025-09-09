"use client"

import React from "react"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import ReactPlayer from "react-player";

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: StreamSourceType
  }>
  isPlayerMaximized: boolean;
  onTogglePlayerMaximize: () => void;
  showPlayerControls?: boolean; // Новый пропс для управления видимостью элементов управления плеера
}

export function StreamPlayer({ sources, isPlayerMaximized, onTogglePlayerMaximize, showPlayerControls = true }: StreamPlayerProps) {
  // Добавляем проверку на существование sources
  if (!sources || sources.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        No stream source available.
      </div>
    );
  }

  const streamSource = sources.find(s => s.sourceType === "HLS") // Или любой другой тип, который ReactPlayer может обработать
  const urlToPlay = streamSource ? streamSource.url : "";

  if (!urlToPlay) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        No stream source available.
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <ReactPlayer
        src={urlToPlay}
        playing
        controls={showPlayerControls} // Используем новый пропс
        width="100%"
        height="100%"
        className="z-[15]"
      />
      {showPlayerControls && ( // Условно отображаем кнопку максимизации
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 z-20 text-white hover:bg-gray-700/50"
          onClick={onTogglePlayerMaximize}
        >
          {isPlayerMaximized ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
        </Button>
      )}
    </div>
  )
}