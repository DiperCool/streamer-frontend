"use client"

import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useGetStreamerQuery } from "@/graphql/__generated__/graphql" // Импортируем useGetStreamerQuery

export default function StreamerRootProfilePage({ params }: { params: { username: string } }) {
  const { username } = params
  const { isAuthenticated, isLoading } = useAuth0()

  // Пример использования данных стримера, если нужно отобразить что-то специфичное для 'Home'
  const { data: streamerData, loading: streamerLoading } = useGetStreamerQuery({
    variables: { userName: username },
  })

  if (isLoading || streamerLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const streamer = streamerData?.streamer;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Home Content for {streamer?.userName || username}</h2>
      <p className="text-gray-400">This is the main home section for the streamer.</p>
      {/* Здесь может быть дополнительный контент для домашней страницы, например, последние видео, расписание и т.д. */}
    </div>
  )
}