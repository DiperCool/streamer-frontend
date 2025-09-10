"use client"

import React, {useState, useEffect, useRef, useCallback} from "react"
import { useGetVodQuery, useGetStreamerQuery, useGetProfileQuery } from "@/graphql/__generated__/graphql"
import { Loader2, MessageSquare } from "lucide-react"
import { getMinioUrl } from "@/utils/utils"
import { VodDetailsSection } from "@/src/components/vod-details-section"
import ReactHlsPlayer from "react-hls-player"; // Используем react-hls-player
import { VodChatSection } from "@/src/components/vod-chat-section"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Определяем тип для объекта состояния прогресса ReactPlayer
// interface ProgressState {
//   played: number;
//   playedSeconds: number;
//   loaded: number;
//   loadedSeconds: number;
// }
const MemoizedPlayer = React.memo(({ videoSource, onSeeked, playerRef }: any) => {
    if (!videoSource) return null;

    return (
        <ReactHlsPlayer // Заменено на ReactHlsPlayer
            playerRef={playerRef} // Передаем ref для доступа к видеоэлементу
            src={videoSource}
            autoPlay={true} // react-hls-player использует autoPlay
            controls={true}
            width="100%"
            height="100%"
            className="z-10"
            // onSeeked больше не пропс для ReactHlsPlayer, слушатель будет прикреплен через ref
        />
    );
});
export default function VodDetailPage({ params }: { params: { vodId: string } }) {
  const { vodId } = params
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [playerPosition, setPlayerPosition] = useState(0); // Состояние для отслеживания позиции плеера в секундах
  const [historyStartFrom, setHistoryStartFrom] = useState<string | null | undefined>(null); // Новое состояние для времени начала истории чата
    const playerRef = useRef<HTMLVideoElement | null>(null); // Ref теперь для HTMLVideoElement
  const { data: vodData, loading: vodLoading, error: vodError } = useGetVodQuery({
    variables: { vodId },
  })
    const vod = vodData?.vod

    const videoSource = vod?.source ? getMinioUrl(vod.source) : null;

    const [listeners, setListeners] = useState<(() => void)[]>([]);

    const registerSeekedListener: (listener: () => void) => () => void = useCallback((listener: () => void) => {
        // добавляем listener
        setListeners(prev => [...prev, listener]);

        // возвращаем функцию для удаления
        return () => {
            setListeners(prev => prev.filter(l => l !== listener));
        };
    }, []);

    const handleSeeked = () => {
        listeners.forEach(listener => listener());
    };

    // Прикрепляем слушатель 'seeked' к базовому видеоэлементу
    useEffect(() => {
        const videoElement = playerRef.current;
        if (videoElement) {
            videoElement.addEventListener('seeked', handleSeeked);
            return () => {
                videoElement.removeEventListener('seeked', handleSeeked);
            };
        }
    }, [handleSeeked, playerRef.current]); // Перезапускаем эффект, если изменился playerRef.current


  const streamerUserName = vodData?.vod?.streamer?.userName ?? ""

  const { data: streamerData, loading: streamerLoading, error: streamerError } = useGetStreamerQuery({
    variables: { userName: streamerUserName },
    skip: !streamerUserName,
  })

  const streamerId = streamerData?.streamer?.id ?? "";

  const { data: profileData, loading: profileLoading, error: profileError } = useGetProfileQuery({
    variables: { streamerId },
    skip: !streamerId,
  })

  // Инициализируем historyStartFrom, когда vodData доступен
  useEffect(() => {
    if (vodData?.vod?.createdAt && !historyStartFrom) {
      setHistoryStartFrom(vodData.vod.createdAt);
    }
  }, [vodData, historyStartFrom]);

  if (vodLoading || streamerLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    )
  }

  if (vodError || streamerError || profileError || !vodData?.vod) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Error loading VOD or streamer data: {vodError?.message || streamerError?.message || profileError?.message || "VOD not found."}</p>
      </div>
    )
  }

  const streamer = streamerData?.streamer
  const profile = profileData?.profile

  if (!streamer || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer profile not found for this VOD.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        isChatVisible ? "lg:pr-80" : ""
      )}>
        {/* Video Player Section */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {videoSource ? (
              <MemoizedPlayer
                  videoSource={videoSource}
                  playerRef={playerRef}
                  // onSeeked пропс удален, слушатель прикрепляется в useEffect
              />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400">
              <p>No video source available for this VOD.</p>
            </div>
          )}

          {/* Кнопка "Показать чат" (только если чат скрыт) */}
          {!isChatVisible && (
            <Button
              variant="outline"
              className="absolute top-4 right-4 z-50 bg-gray-800/70 text-gray-300 hover:bg-gray-700"
              onClick={() => setIsChatVisible(true)}
            >
              <MessageSquare className="h-5 w-5 mr-2" /> Show Chat
            </Button>
          )}
        </div>

        {/* VOD Details and Streamer Info */}
        <div className="container mx-auto px-4 py-4">
          <VodDetailsSection vod={vod} streamer={streamer} profile={profile} />
        </div>
      </div>

      {/* VOD Chat Sidebar */}
      <div
        className={cn(
          "fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-gray-800 border-l border-gray-700 flex-col z-40 overflow-y-auto transition-transform duration-300 ease-in-out",
          isChatVisible ? "translate-x-0" : "translate-x-full",
          "hidden lg:flex"
        )}
      >
          <VodChatSection
              onCloseChat={() => setIsChatVisible(false)}
              streamerId={streamerId}
              vodCreatedAt={vod.createdAt}
              getPlayerPosition={()=> playerRef.current?.currentTime ?? 0}
              registerSeekedListener={registerSeekedListener}
          />
      </div>
    </div>
  )
}