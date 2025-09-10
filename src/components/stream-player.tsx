"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
import ReactHlsPlayer from "react-hls-player";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatLiveDuration } from "@/utils/utils"; // Импортируем новую функцию

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: StreamSourceType
  }>
  isPlayerMaximized: boolean;
  onTogglePlayerMaximize: () => void;
  showPlayerControls?: boolean;
  isLive?: boolean; // Новый пропс для статуса LIVE
  startedAt?: string | null; // Новый пропс для времени начала стрима
}

// Мемоизированный компонент для HLS-плеера, чтобы предотвратить его ненужные перерисовки
const HlsPlayerComponent = React.memo(function HlsPlayerComponent({ src, playerRef, hlsConfig }: { src: string; playerRef: React.RefObject<HTMLVideoElement>; hlsConfig: any }) {
  return (
    <ReactHlsPlayer
      playerRef={playerRef}
      src={src}
      autoPlay={true}
      controls={false}
      width="100%"
      height="100%"
      muted={false}
      hlsConfig={hlsConfig}
    />
  );
});

export function StreamPlayer({ 
  sources, 
  isPlayerMaximized, 
  onTogglePlayerMaximize, 
  showPlayerControls = true,
  isLive = false, // Значение по умолчанию
  startedAt, // Время начала стрима
}: StreamPlayerProps) {
  const hlsSource = sources.find(s => s.sourceType === StreamSourceType.Hls);
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [liveDuration, setLiveDuration] = useState("00:00:00");

  const activeSource = hlsSource;

  // Обновление продолжительности стрима
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLive && startedAt) {
      interval = setInterval(() => {
        setLiveDuration(formatLiveDuration(startedAt));
      }, 1000);
    } else {
      setLiveDuration("00:00:00"); // Сброс, если не в эфире
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, startedAt]);

  // Обработчик для нативного полноэкранного режима
  const handleFullscreenChange = useCallback(() => {
    setIsNativeFullscreen(document.fullscreenElement === playerRef.current);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const handleToggleFullscreen = () => {
    if (playerRef.current) {
      if (document.fullscreenElement === playerRef.current) {
        document.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    }
    // Также вызываем пропс для управления размером плеера в рамках макета
    onTogglePlayerMaximize();
  };

  if (!activeSource) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-lg">
        No stream source available.
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black">
      <HlsPlayerComponent
        src={activeSource.url}
        playerRef={playerRef}
        hlsConfig={{ lowLatencyMode: true }}
      />
      {isLive && (
        <Badge className="absolute bottom-4 left-4 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
          LIVE
        </Badge>
      )}
      {isLive && (
        <Badge className="absolute bottom-4 left-20 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
          {liveDuration}
        </Badge>
      )}
      {showPlayerControls && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFullscreen}
          className="absolute bottom-4 right-4 z-10 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-2"
          title={isNativeFullscreen ? "Minimize Player" : "Maximize Player"}
        >
          {isNativeFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
      )}
    </div>
  );
}