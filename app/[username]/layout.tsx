"use client"

import React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useGetProfileQuery, useGetStreamerQuery, useGetCurrentStreamQuery } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { StreamPlayer } from "@/src/components/stream-player"
import { StreamerInfoBar } from "@/src/components/streamer-info-bar"

export default function StreamerProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const { username } = params
  const pathname = usePathname()

  const { data: streamerData, loading: streamerLoading } = useGetStreamerQuery({
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

  const { data: currentStreamData, loading: currentStreamLoading } = useGetCurrentStreamQuery({
    variables: {
      streamerId: streamerData?.streamer.id ?? "",
    },
    skip: !streamerData?.streamer.id,
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
  const isLive = currentStream?.active;

  const isCurrentUserProfile = false; // Это значение должно быть определено на основе текущего пользователя

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
      <div className="container mx-auto px-4 py-8"> {/* Основной контейнер контента */}
        <div className="flex flex-col lg:flex-row lg:space-x-6 mb-6"> {/* Контейнер для видео и правой части */}
          {/* Секция видеоплеера / баннера */}
          <div className="relative w-full lg:w-2/3 pt-[56.25%] bg-black rounded-lg overflow-hidden"> {/* Контейнер с соотношением сторон 16:9, занимает 2/3 ширины на больших экранах */}
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

          {/* Правая секция (например, чат, пустое пространство) */}
          <div className="w-full lg:w-1/3 bg-gray-800 rounded-lg mt-6 lg:mt-0 p-4 flex items-center justify-center text-gray-400">
            {/* Заполнитель для чата или другого контента */}
            <p>Чат будет здесь</p>
          </div>
        </div>

        {/* Информационная панель стримера */}
        <StreamerInfoBar
          streamer={streamer}
          profile={streamerProfile}
          currentStream={currentStream}
          isCurrentUserProfile={isCurrentUserProfile}
        />

        {/* Вкладки */}
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