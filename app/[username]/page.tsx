"use client"

import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useGetStreamerQuery, useGetVodsQuery, SortEnumType } from "@/graphql/__generated__/graphql" // Импортируем useGetStreamerQuery и useGetVodsQuery
import { Loader2 } from "lucide-react"
import { VodCard } from "@/src/components/vod-card" // Импортируем VodCard
import Link from "next/link" // Импортируем Link
import { Button } from "@/components/ui/button" // Импортируем Button

export default function StreamerRootProfilePage({ params }: { params: { username: string } }) {
  const { username } = params
  const { isAuthenticated, isLoading } = useAuth0()

  const { data: streamerData, loading: streamerLoading } = useGetStreamerQuery({
    variables: { userName: username },
  })

  const streamerId = streamerData?.streamer.id;

  const {
    data: vodsData,
    loading: vodsLoading,
    error: vodsError,
  } = useGetVodsQuery({
    variables: {
      streamerId: streamerId ?? "",
      first: 4, // Ограничиваем до 4 видео
      order: [{ createdAt: SortEnumType.Desc }], // Сортируем по дате создания (самые новые)
    },
    skip: !streamerId, // Пропускаем запрос, если streamerId недоступен
  });

  if (isLoading || streamerLoading || vodsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamer = streamerData?.streamer;
  const vods = vodsData?.vods?.nodes || [];

  if (vodsError) {
    return <div className="text-red-500 p-4">Error loading videos: {vodsError.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Latest Videos Section */}
      {vods.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Latest Videos</h3>
            <Link href={`/${username}/videos`} passHref>
              <Button variant="ghost" className="text-green-500 hover:text-green-400">
                Show More
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vods.map((vod) => (
              <VodCard key={vod.id} vod={vod} />
            ))}
          </div>
        </div>
      )}

      {/* Здесь может быть дополнительный контент для домашней страницы, например, расписание и т.д. */}
    </div>
  )
}