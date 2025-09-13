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
  useGetStreamInfoQuery,
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

  const [isChatVisible, setIsChatVisible] = useState(true); 
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
    onData: ({ data }) => { },
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

  if (streamerLoading || profileLoading || currentStreamLoading || streamInfoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamerProfile = profileData?.profile
  const streamer = streamerData?.streamer
  const currentStream = currentStreamData?.currentStream;
  const streamInfo = streamInfoData?.streamInfo;
  const isLive = streamer?.isLive;

  if (!streamer || !streamerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer not found.</p>
      </div>
    )
  }

  const bannerImage = streamerProfile.offlineStreamBanner || streamerProfile.channelBanner || "/placeholder.jpg"

  const handleTogglePlayerMaximize = () => {
    setIsPlayerMaximized(prev => !prev);
  };

  const getActiveTab = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment === username) return 'home';
    if (lastSegment === 'about') return 'about';
    if (lastSegment === 'videos') return 'videos';
    if (lastSegment === 'clips') return 'clips';
    return 'home';
  };
  const activeTab = getActiveTab();

  const hasStreamSources = currentStream?.sources && currentStream.sources.length > 0;
  const isDashboardRoute = pathname.startsWith(`/dashboard/${username}`);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row-reverse">

      {/* Единый контейнер для ChatSection, рендерится только если это не маршрут дашборда */}
      {!isDashboardRoute && (
        <div
          className={cn(
            "flex-col z-40 overflow-y-auto transition-transform duration-300 ease-in-out",
            // Мобильные стили (по умолчанию)
            "w-full bg-gray-800 rounded-lg mt-6 h-[50vh]",
            // Десктопные стили (переопределяют мобильные на lg экранах)
            "lg:fixed lg:top-16 lg:right-0 lg:h-[calc(100vh-4rem)] lg:w-80 lg:bg-gray-800 lg:border-l lg:border-gray-700 lg:mt-0 lg:rounded-none",
            // Управление видимостью и анимацией
            // На мобильных (по умолчанию), если чат виден, показываем его как flex. Если нет, скрываем.
            isChatVisible ? "flex" : "hidden",
            // На больших экранах (lg), переопределяем мобильную видимость.
            // Если чат виден, показываем его как flex и сдвигаем.
            // Если чат не виден, скрываем его и сдвигаем за пределы экрана.
            isChatVisible ? "lg:flex lg:translate-x-0" : "lg:hidden lg:translate-x-full"
          )}
        >
          <ChatSection onCloseChat={() => setIsChatVisible(false)} streamerId={streamer.id} />
        </div>
      )}

      <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isChatVisible && !isDashboardRoute ? "lg:mr-80" : "", // Применяем отступ только если чат виден и это не дашборд
      )}>
        <div className={cn(
          "relative w-full bg-black rounded-lg overflow-hidden transition-all duration-300 ease-in-out",
          isPlayerMaximized ? "flex-grow h-screen-minus-navbar" : "h-[35vh]"
        )}>
          {isLive && hasStreamSources ? (
            <StreamPlayer
              sources={currentStream!.sources}
              isPlayerMaximized={isPlayerMaximized}
              onTogglePlayerMaximize={handleTogglePlayerMaximize}
              showPlayerControls={true}
              isLive={isLive ?? false}
              startedAt={currentStream?.started}
              showOverlays={false}
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

          {!isChatVisible && !isDashboardRoute && ( // Кнопка "Show Chat" только если чат скрыт и это не дашборд
            <Button
              variant="outline"
              className="absolute top-16 right-4 z-50 bg-gray-800/70 text-gray-300 hover:bg-gray-700"
              onClick={() => setIsChatVisible(true)}
            >
              <MessageSquare className="h-5 w-5 mr-2" /> Show Chat
            </Button>
          )}
        </div>

        <div className={cn(
          "transition-all duration-300 ease-in-out",
          isPlayerMaximized ? "px-4 py-2" : "px-4 py-2"
        )}>
          <StreamerInfoBar
            streamer={streamer}
            profile={streamerProfile}
            currentStream={currentStream}
            streamInfo={streamInfo}
            isCurrentUserProfile={false}
            isLive={isLive ?? false}
            onTogglePlayerMaximize={handleTogglePlayerMaximize}
          />
        </div>

        <div className={cn(
          "flex-grow transition-all duration-300 ease-in-out",
          isPlayerMaximized ? "hidden" : "px-4 py-2"
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
      </div>
    </div>
  )
}