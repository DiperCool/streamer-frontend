"use client"

import React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  useGetProfileQuery,
  useGetStreamerQuery,
  useGetCurrentStreamQuery,
  useStreamerUpdatedSubscription,
  useWatchStreamSubscription,
  useStreamUpdatedSubscription, // Импортируем новую подписку
  GetStreamerDocument,
  GetCurrentStreamDocument // Импортируем документ запроса для обновления кэша
} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { StreamPlayer } from "@/src/components/stream-player"
import { StreamerInfoBar } from "@/src/components/streamer-info-bar"
import { ChatSection } from "@/src/components/chat-section"
import { useApolloClient } from "@apollo/client"

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

  const { data: streamerData, loading: streamerLoading, refetch: refetchStreamer } = useGetStreamerQuery({
    variables: {
      userName: username,
    },
  })
  const { data: profileData, loading: profileLoading } = useGetProfileQuery({
    variables: {
      streamerId: streamerData?.streamer.id ?? "",
    },
    skip: !streamerData?.streamer.id,
  })

  const { data: currentStreamData, loading: currentStreamLoading, refetch: refetchStream } = useGetCurrentStreamQuery({
    variables: {
      streamerId: streamerData?.streamer.id ?? "",
    },
    skip: !streamerData?.streamer.id,
  });

  // Подписка на обновления стримера (оставляем без изменений, как запрошено)
  useStreamerUpdatedSubscription({
    variables: {
      streamerId: streamerData?.streamer.id ?? "",
    },
    skip: !streamerData?.streamer.id,
    onData: ({ data }) => {
      if (data.data?.streamerUpdated) {
          refetchStreamer()
          refetchStream()
      }
    },
  });

  // Подписка на просмотр потока (оставляем без изменений, как запрошено)
  useWatchStreamSubscription({
    variables: {
      streamId: currentStreamData?.currentStream?.id ?? "",
    },
    skip: !currentStreamData?.currentStream?.id,
    onData: ({ data }) => {
      // Ничего не делаем, как запрошено
    },
  });

  // Новая подписка для обновления информации о текущем потоке
  useStreamUpdatedSubscription({
    variables: {
      streamId: currentStreamData?.currentStream?.id ?? "",
    },
    skip: !currentStreamData?.currentStream?.id, // Подписываемся только если есть ID текущего потока
    onData: ({ client, data }) => {
      const updatedStream = data.data?.streamUpdated;
      if (updatedStream) {
        // Читаем текущие данные потока из кэша
        const existingStreamData = client.readQuery({
          query: GetCurrentStreamDocument,
          variables: { streamerId: streamerData?.streamer.id ?? "" },
        });

        if (existingStreamData && existingStreamData.currentStream) {
          // Объединяем обновленные поля с существующими данными потока
          const newCurrentStream = {
            ...existingStreamData.currentStream,
            ...updatedStream,
            // Убеждаемся, что вложенные объекты, такие как 'streamer', также объединены
            streamer: {
              ...existingStreamData.currentStream.streamer,
              ...updatedStream.streamer,
              __typename: 'StreamerDto', // Сохраняем typename
            },
            __typename: 'StreamDto', // Сохраняем typename
          };

          // Записываем обновленные данные обратно в кэш
          client.writeQuery({
            query: GetCurrentStreamDocument,
            variables: { streamerId: streamerData?.streamer.id ?? "" },
            data: {
              currentStream: newCurrentStream,
            },
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-6 mb-6 lg:h-[600px]">
          <div className="relative w-full lg:w-2/3 pt-[56.25%] lg:pt-0 bg-black rounded-lg overflow-hidden lg:h-full">
            {isLive && currentStream?.sources && currentStream.sources.length > 0 ? (
              <StreamPlayer sources={currentStream.sources} />
            ) : (
              <Image
                src={getMinioUrl(bannerImage)}
                alt="Channel Banner"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
                className="absolute top-0 left-0 w-full h-full"
              />
            )}
          </div>

          <div className="w-full lg:w-1/3 bg-gray-800 rounded-lg mt-6 lg:mt-0 flex flex-col h-full">
            <ChatSection />
          </div>
        </div>

        <StreamerInfoBar
          streamer={streamer}
          profile={streamerProfile}
          currentStream={currentStream}
          isCurrentUserProfile={isCurrentUserProfile}
          isLive={isLive ?? false}
        />

        <div className="border-b border-gray-800 mt-8">
          <Tabs value={activeTab} className="w-full">
            <TabsList className="bg-gray-900" currentValue={activeTab}>
              <Link href={`/${username}`} passHref>
                <TabsTrigger value="home">
                  Home
                </TabsTrigger>
              </Link>
              <Link href={`/${username}/about`} passHref>
                <TabsTrigger value="about">
                  About
                </TabsTrigger>
              </Link>
              <Link href={`/${username}/videos`} passHref>
                <TabsTrigger value="videos">
                  Videos
                </TabsTrigger>
              </Link>
              <Link href={`/${username}/clips`} passHref>
                <TabsTrigger value="clips">
                  Clips
                </TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>
        {children}
      </div>
    </div>
  )
}