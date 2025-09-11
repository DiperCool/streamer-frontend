"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { StreamSourceType } from "@/graphql/__generated__/graphql";
import ReactHlsPlayer from "react-hls-player";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, VolumeX, Volume2 } from "lucide-react"; // Import Volume icons
import { LiveStreamIndicators } from "./live-stream-indicators";

interface StreamPlayerProps {
  sources: Array<{
    url: string
    sourceType: StreamSourceType
  }>
  isPlayerMaximized: boolean;
  onTogglePlayerMaximize: () => void;
  showPlayerControls?: boolean;
  isLive?: boolean;
  startedAt?: string | null;
  showOverlays?: boolean;
}

interface HlsPlayerComponentProps {
  src: string;
  playerRef: React.RefObject<HTMLVideoElement>; // Изменено: теперь ожидает RefObject<HTMLVideoElement>
  hlsConfig: any;
  isMuted: boolean;
}

const HlsPlayerComponent = React.memo(function HlsPlayerComponent({ src, playerRef, hlsConfig, isMuted }: HlsPlayerComponentProps) {
  console.log("HlsPlayerComponent rendered. Source:", src, "Muted:", isMuted);
  return (
    <ReactHlsPlayer
      playerRef={playerRef}
      src={src}
      autoPlay={true}
      controls={false}
      width="100%"
      height="100%"
      muted={isMuted}
      hlsConfig={hlsConfig}
    />
  );
});

export const StreamPlayer = React.memo(function StreamPlayer({ 
  sources, 
  isPlayerMaximized, 
  onTogglePlayerMaximize, 
  showPlayerControls = true,
  isLive = false,
  startedAt,
  showOverlays = false,
}: StreamPlayerProps) {
  console.log("StreamPlayer rendered. Is Live:", isLive, "Sources:", sources);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const hlsSource = sources.find(s => s.sourceType === StreamSourceType.Hls);
  const activeSource = hlsSource;

  const hlsConfig = React.useMemo(() => ({ lowLatencyMode: false }), []);

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
    if (playerWrapperRef.current) {
      if (document.fullscreenElement === playerWrapperRef.current) {
        document.exitFullscreen();
      } else {
        playerWrapperRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    }
    onTogglePlayerMaximize();
  };

  const toggleMute = () => {
    if (videoElementRef.current) {
      videoElementRef.current.muted = !videoElementRef.current.muted;
      setIsMuted(videoElementRef.current.muted);
    }
  };

  if (!activeSource) {
    console.log("StreamPlayer: No active source available.");
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-lg">
        No stream source available.
      </div>
    );
  }

  return (
    <div ref={playerWrapperRef} className="absolute inset-0 bg-black">
      <HlsPlayerComponent
        src={activeSource.url}
        playerRef={videoElementRef as React.RefObject<HTMLVideoElement>} {/* Применено утверждение типа */}
        hlsConfig={hlsConfig}
        isMuted={isMuted}
      />
      
      {showOverlays && (
        <>
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-gray-900/50 to-transparent z-10" />
          <div className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-gray-900/50 to-transparent z-10" />
        </>
      )}

      <LiveStreamIndicators isLive={isLive} startedAt={startedAt} />

      {showPlayerControls && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="absolute bottom-4 right-20 z-20 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-2"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFullscreen}
            className="absolute bottom-4 right-4 z-20 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-2"
            title={isNativeFullscreen ? "Minimize Player" : "Maximize Player"}
          >
            {isNativeFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </>
      )}
    </div>
  );
});