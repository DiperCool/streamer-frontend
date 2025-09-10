"use client"

import React from "react"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
// Удалены импорты Button, Maximize, Minimize, ReactPlayer

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
  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-lg">
      Video Player Placeholder
    </div>
  )
}