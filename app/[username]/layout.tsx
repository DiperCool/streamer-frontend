"use client"

import React, { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  useGetProfileQuery,
  useGetStreamerQuery,
  useGetCurrentStreamQuery,
  useStreamerUpdatedSubscription,
  useWatchStreamSubscription,
  useStreamUpdatedSubscription,
  GetStreamerDocument,
  GetCurrentStreamDocument,
  useGetStreamInfoQuery // Import useGetStreamInfoQuery
} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { StreamPlayer } from "@/src/components/stream-player"
import { StreamerInfoBar } from "@/src/components/streamer-info-bar"
import { ChatSection } from "@/src/components/chat-section"
import { useApolloClient } from "@apollo/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export default function StreamerProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const { username } = params
  const pathname = usePathname()
  const client = useApolloClient();

  // Состояние видимости чата
  const [isChatVisible, setIsChatVisible] = useState(true); 
  // Состояние максимизации плеера, теперь управляется локально
  const [isPlayerMaximized, setIsPlayerMaximized] = useState(false);

  const { data: streamerData, loading: streamerLoading, refetch: refetchStreamer } = useGetStreamerQuery({
    variables: { userName: username },
  })
  const { data: profileData, loading: profileLoading } = useGetProfileQuery({
    variables: { streamerId: streamerData?.streamer.id ?? "" },
    skip: !streamerData?.streamer.id,
  })
  const { data: currentStreamData, loading: currentStreamLoading, refetch: refetchStream } = useGetCurrentStreamQuery({
    variables: { streamerId: streamerData?.streamer.id ?? "" },
    skip: !streamerData?.streamer.id,
  });

  // Fetch stream info for offline display
  const { data: streamInfoData, loading: streamInfoLoading } = useGetStreamInfoQuery({
    variables: { streamerId: streamerData?.streamer.id ?? "" },
    skip: !streamerData?.streamer.id,
  });

  useStreamerUpdatedSubscription({
    variables: { streamerId: streamerData?.streamer.id ?? "" },
    skip: !streamerData?.streamer.id,
    onData: ({ data }) => { if (data.data?.streamerUpdated) { refetchStreamer(); refetchStream(); } },
  });
  useWatchStreamSubscription({
    variables: { streamId: currentStreamData?.currentStream?.id ?? "" },
    skip: !currentStreamData?.currentStream?.id,
    onData: ({ data }) => { /* Nothing to do */ },
  });
  useStreamUpdatedSubscription({
    variables: { streamId: currentStreamData?.currentStream?.id ?? "" },
    skip: !currentStreamData?.currentStream?.id,
    onData: ({ client, data }) => {
      const updatedStream = data.data?.streamUpdated;
      if (updatedStream) {
        const existingStreamData = client.readQuery({
          query: GetCurrentStreamDocument,
          variables: { streamerId: streamerData?.streamer.id ?? "" },
        });
        if (existingStreamData && existingStreamData.currentStream) {
          const newCurrentStream = {
            ...existingStreamData.currentStream,
            ...updatedStream,
            streamer: {
              ...existingStreamData.currentStream.streamer,
              ...updatedStream.streamer,
              __typename: 'StreamerDto',
            },
            __typename: 'StreamerDto',
          };
          client.writeQuery({
            query: GetCurrentStreamDocument,
            variables: { streamerId: streamerData?.streamer.id ?? "" },
            data: { currentStream: newCurrentStream },
          });
        }
      }
    },
  });

  // Ref для контейнера чата, чтобы прокручивать его
  const chatPanelRef = useRef<HTMLDivElement>(null);

  // Функция для прокрутки панели чата до конца
  const scrollChatPanelToBottom = useCallback(() => {
    if (chatPanelRef.current) {
      chatPanelRef.current.scrollTop = chatPanelRef.current.scrollHeight;
    }
  }, []);

  if (streamerLoading || profileLoading || currentStreamLoading || streamInfoLoading) { // Add streamInfoLoading
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamerProfile = profileData?.profile
  const streamer = streamerData?.streamer
  const currentStream = currentStreamData?.currentStream;
  const streamInfo = streamInfoData?.streamInfo; // Get stream info
  const isLive = streamer?.isLive;

  if (!streamer || !streamerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer not found.</p>
      </div>
    )
  }

  const bannerImage = streamerProfile.offlineStreamBanner || streamerProfile.channelBanner || "/placeholder.jpg"

  // Локальное переключение состояния максимизации плеера
  const handleTogglePlayerMaximize = () => {
    setIsPlayerMaximized(prev => !prev);
  };

  const getActiveTab = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    // Если плеер максимизирован, вкладки скрыты, поэтому активная вкладка не имеет значения для UI
    // Но для логики можно оставить 'home' или текущую вкладку, если это важно для других частей
    if (lastSegment === username) return 'home';
    if (lastSegment === 'about') return 'about';
    if (lastSegment === 'videos') return 'videos';
    if (lastSegment === 'clips') return 'clips';
    return 'home';
  };
  const activeTab = getActiveTab();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row-reverse"> {/* Основной контейнер: вертикальный на мобильных, горизонтальный (обратный порядок) на больших */}

      {/* Чат (закреплен справа на больших экранах) */}
      <div
        ref={chatPanelRef} // Добавлен ref
        className={cn(
          "fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-gray-800 border-l border-gray-700 flex-col z-40 overflow-y-auto transition-transform duration-300 ease-in-out",
          isChatVisible ? "translate-x-0" : "translate-x-full", // Используем translateX для плавной анимации
          "hidden lg:flex" // Скрываем на маленьких экранах, отображаем как flex на больших
        )}
      >
        <ChatSection onCloseChat={() => setIsChatVisible(false)} streamerId={streamer.id} onScrollToBottom={scrollChatPanelToBottom} />
      </div>

      {/* Основная область контента (плеер, инфо-панель, вкладки) */}
      <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isChatVisible ? "lg:mr-80" : "", // Применяем lg:mr-80 только если чат виден
      )}>
        {/* Секция плеера */}
        <div className={cn(
          "relative w-full bg-black rounded-lg overflow-hidden transition-all duration-300 ease-in-out",
          isPlayerMaximized ? "flex-grow h-screen-minus-navbar" : "h-[35vh]"
        )}>
          {isLive && currentStream?.sources && currentStream.sources.length > 0 ? (
            <StreamPlayer
              sources={currentStream.sources}
              playing={true}
              controls={true} // ReactPlayer controls are still needed for basic playback
              isPlayerMaximized={isPlayerMaximized}
              onTogglePlayerMaximize={handleTogglePlayerMaximize}
              showPlayerControls={true} // Явно включаем элементы управления плеера
            />
          ) : (
            <Image
              src={getMinioUrl(bannerImage)}
              alt="Channel Banner"
              fill
              style={{ objectFit: "cover" }}
              sizes="100vw"
              priority
              className="absolute top-0 left-0 w-full h-full"
            />
          )}

          {/* Кнопка "Показать чат" (только если чат скрыт) */}
          {!isChatVisible && (
            <Button
              variant="outline"
              className="absolute top-16 right-4 z-50 bg-gray-800/70 text-gray-300 hover:bg-gray-700"
              onClick={() => setIsChatVisible(true)}
            >
              <MessageSquare className="h-5 w-5 mr-2" /> Show Chat
            </Button>
          )}
        </div>

        {/* Инфо-панель стримера */}
        <div className={cn(
          "transition-all duration-300 ease-in-out relative z-30",
          isPlayerMaximized ? "px-4 py-2" : "container mx-auto px-4 py-2"
        )}>
          <StreamerInfoBar
            streamer={streamer}
            profile={streamerProfile}
            currentStream={currentStream}
            streamInfo={streamInfo} {/* Pass streamInfo here */}
            isCurrentUserProfile={false}
            isLive={isLive ?? false}
            onTogglePlayerMaximize={handleTogglePlayerMaximize}
          />
        </div>

        {/* Контейнер вкладок и дочернего контента (скрывается, когда плеер максимизирован) */}
        <div className={cn(
          "flex-grow transition-all duration-300 ease-in-out",
          isPlayerMaximized ? "hidden" : "container mx-auto px-4 py-2"
        )}>
          <div className="border-b border-gray-800 mb-2">
            <Tabs value={activeTab} className="w-full">
              <TabsList className="bg-gray-900" currentValue={activeTab}>
                <Link href={`/${username}`} passHref>
                  <TabsTrigger value="home">Home</TabsTrigger>
                </Link>
                <Link href={`/${username}/about`} passHref>
                  <TabsTrigger value="about">About</TabsTrigger>
                </Link>
                <Link href={`/${username}/videos`} passHref>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                </Link>
                <Link href={`/${username}/clips`} passHref>
                  <TabsTrigger value="clips">Clips</TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </div>
          {children}
        </div>

        {/* Чат (отображается на маленьких экранах, если чат виден) */}
        {isChatVisible && (
          <div
            ref={chatPanelRef} // Добавлен ref
            className="lg:hidden w-full bg-gray-800 rounded-lg mt-6 flex flex-col h-[50vh] overflow-y-auto" // Добавлен overflow-y-auto
          >
            <ChatSection onCloseChat={() => setIsChatVisible(false)} streamerId={streamer.id} onScrollToBottom={scrollChatPanelToBottom} />
          </div>
        )}
      </div>
    </div>
  )
}