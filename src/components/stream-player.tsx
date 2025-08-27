"use client"

import React from "react"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import WhepPlayer from "@/components/players/WhepPlayer"; // Импортируем WhepPlayer

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: StreamSourceType
  }>
  isPlayerMaximized: boolean;
  onTogglePlayerMaximize: () => void;
}

export function StreamPlayer({ sources, isPlayerMaximized, onTogglePlayerMaximize }: StreamPlayerProps) {
  // Ищем WHEP источник, так как WhepPlayer предназначен для WHEP.
  // Если есть другие типы источников (например, HLS), они не будут воспроизводиться этим плеером.
  const whepSource = sources.find(s => s.sourceType === "WEB_RTC")
  const urlToPlay = whepSource ? whepSource.url : "";

  if (!urlToPlay) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        No WHEP stream source available.
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      {/* Используем WhepPlayer напрямую, передавая src */}
      <WhepPlayer
        src={urlToPlay}
        playing
        controls={true}
        width="100%"
        height="100%"
        // WhepPlayer не имеет пропов isPlayerMaximized и onTogglePlayerMaximize
        // Эти пропы были для ReactPlayer, который оборачивал WhepPlayer.
        // Если нужна логика максимизации, ее нужно будет реализовать внутри WhepPlayer или обернуть его.
        className="z-[15]"
      />
    </div>
  )
}