"use client"

import React, { useState } from "react"
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
  GetCurrentStreamDocument
} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { StreamPlayer } from "@/src/components/stream-player"
import { StreamerInfoBar } from "@/src/components/streamer-info-bar"
import { ChatSection } from "@/src/components/chat-section"
import { useApolloClient } from "@apollo/client"
import { cn } from "@/lib/utils"

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
  const [isChatOpen, setIsChatOpen] = useState(true);
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
            __typename: 'StreamDto',
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

  if (streamerLoading || profileLoading || currentStreamLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamerProfile = profileData?.profile
  const streamer = streamerData?.streamer
  const currentStream = currentStreamData?.currentStream;
  const isLive = streamer?.isLive;

  const isCurrentUserProfile = false;

  if (!streamer || !streamerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer not found.</p>
      </div>
    )
  }

  const bannerImage = streamerProfile.offlineStreamBanner || streamerProfile.channelBanner || "/placeholder.jpg"

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

  const handleTogglePlayerMaximize = () => {
    setIsPlayerMaximized(prev => {
      const newMaximizedState = !prev;
      // Если плеер максимизируется, чат скрывается. Если минимизируется, чат показывается.
      setIsChatOpen(!newMaximizedState); 
      return newMaximizedState;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Player and Chat Section - Стрим и чат */}
      <div className={cn(
        "relative w-full flex flex-col lg:flex-row transition-all duration-300 ease-in-out",
        isPlayerMaximized ? "flex-grow h-screen-minus-navbar" : "h-[35vh]" // Занимает оставшуюся высоту при максимизации, фиксированная высота при минимизации
      )}>
        {/* Player */}
        <div className={cn(
          "relative w-full bg-black rounded-lg overflow-hidden transition-all duration-300 ease-in-out",
          isPlayerMaximized ? "lg:w-full h-full" : "lg:w-2/3 h-full" // Ширина плеера: 100% при максимизации, 2/3 при минимизации (если чат открыт)
        )}>
          {isLive && currentStream?.sources && currentStream.sources.length > 0 ? (
            <StreamPlayer
              sources={currentStream.sources}
              showChatToggleButton={!isChatOpen && !isPlayerMaximized} // Кнопка чата видна, если чат закрыт И плеер не максимизирован
              onToggleChat={() => setIsChatOpen(prev => !prev)} // Переключаем видимость чата
              isPlayerMaximized={isPlayerMaximized}
              onTogglePlayerMaximize={handleTogglePlayerMaximize}
            />
          ) : (
            <Image
              src={getMinioUrl(bannerImage)}
              alt="Channel Banner"
              fill
              style={{ objectFit: "cover" }}
              sizes={isPlayerMaximized ? "100vw" : "(max-width: 1024px) 100vw, 66vw"}
              priority
              className="absolute top-0 left-0 w-full h-full"
            />
          )}
        </div>

        {/* Chat Section - Видим только если чат открыт И плеер НЕ максимизирован */}
        {isChatOpen && !isPlayerMaximized && (
          <div className={cn(
            "w-full bg-gray-800 rounded-lg mt-6 lg:mt-0 flex flex-col h-full transition-all duration-300 ease-in-out",
            "lg:w-1/3" // Всегда 1/3 ширины, когда видим
          )}>
            <ChatSection onCloseChat={() => setIsChatOpen(false)} />
          </div>
        )}
      </div>

      {/* Streamer Info Bar - Скрывается, когда плеер максимизирован */}
      <div className={cn(
        "transition-all duration-300 ease-in-out relative z-30",
        isPlayerMaximized ? "hidden" : "container mx-auto px-4 py-8" // Скрыт, когда максимизирован
      )}>
        <StreamerInfoBar
          streamer={streamer}
          profile={streamerProfile}
          currentStream={currentStream}
          isCurrentUserProfile={isCurrentUserProfile}
          isLive={isLive ?? false}
          onTogglePlayerMaximize={handleTogglePlayerMaximize}
        />
      </div>

      {/* Tabs and Children container - Скрывается, когда плеер максимизирован */}
      <div className={cn(
        "flex-grow transition-all duration-300 ease-in-out",
        isPlayerMaximized ? "hidden" : "container mx-auto px-4 py-8" // Скрыт, когда максимизирован
      )}>
        <div className="border-b border-gray-800 mb-8">
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
  )
}