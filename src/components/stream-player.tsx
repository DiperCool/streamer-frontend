"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
import ReactHlsPlayer from "react-hls-player";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import { LiveStreamIndicators } from "./live-stream-indicators"; // Импортируем новый компонент

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

export const StreamPlayer = React.memo(function StreamPlayer({ 
  sources, 
  isPlayerMaximized, 
  onTogglePlayerMaximize, 
  showPlayerControls = true,
  isLive = false, // Значение по умолчанию
  startedAt, // Время начала стрима
}: StreamPlayerProps) {
  const videoElementRef = useRef<HTMLVideoElement>(null); // Реф для самого видеоэлемента
  const playerWrapperRef = useRef<HTMLDivElement>(null); // Реф для контейнера, который будет полноэкранным
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  const hlsSource = sources.find(s => s.sourceType === StreamSourceType.Hls);
  const activeSource = hlsSource;

  // Мемоизируем hlsConfig, чтобы он был стабильной ссылкой
  const hlsConfig = React.useMemo(() => ({ lowLatencyMode: true }), []);

  // Обработчик для нативного полноэкранного режима
  const handleFullscreenChange = useCallback(() => {
    setIsNativeFullscreen(document.fullscreenElement === playerWrapperRef.current);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const handleToggleFullscreen = () => {
    if (playerWrapperRef.current) { // Теперь делаем полноэкранным контейнер
      if (document.fullscreenElement === playerWrapperRef.current) {
        document.exitFullscreen();
      } else {
        playerWrapperRef.current.requestFullscreen().catch((err) => {
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
    <div ref={playerWrapperRef} className="absolute inset-0 bg-black"> {/* Этот div теперь становится полноэкранным */}
      <HlsPlayerComponent
        src={activeSource.url}
        playerRef={videoElementRef} // Передаем реф видеоэлементу
        hlsConfig={hlsConfig} // Используем мемоизированный hlsConfig
      />
      
      {/* Индикаторы LIVE и времени стрима */}
      <LiveStreamIndicators isLive={isLive} startedAt={startedAt} />

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
});