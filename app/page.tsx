"use client"

import React, { useCallback, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  useGetTopStreamsQuery,
  useGetTopCategoriesQuery,
  StreamDto,
  SortEnumType,
} from "@/graphql/__generated__/graphql"
import { Loader2, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import NextImage from "next/image"
import { getMinioUrl } from "@/utils/utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StreamPlayer } from "@/src/components/stream-player"
import { CategoryCard } from "@/src/components/category-card"
import { StreamsByCategorySection } from "@/src/components/streams-by-category-section"
import { useIsMobile } from "@/hooks/use-mobile"
import {TopStreamCard} from "@/src/components/top-stream-card";
import { SmallStreamPreviewCard } from "@/src/components/small-stream-preview-card"; // Corrected import

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0()
  const isMobile = useIsMobile();

  const { data: topStreamsData, loading: topStreamsLoading, error: topStreamsError } = useGetTopStreamsQuery();
  const topStreams = topStreamsData?.topStreams || [];

  const { data: topCategoriesData, loading: topCategoriesLoading, error: topCategoriesError } = useGetTopCategoriesQuery();
  const topCategories = topCategoriesData?.topCategories || [];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelectStream = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  if (authLoading || topStreamsLoading || topCategoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    )
  }

  if (topStreamsError || topCategoriesError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-red-500">Error loading data: {topStreamsError?.message || topCategoriesError?.message}</p>
      </div>
    );
  }

  const featuredStream = topStreams[selectedIndex];

  if (!featuredStream) {
    return (
      <div className="pr-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Streamer</h1>
        <p className="text-gray-500">No live streams currently available. Check back later!</p>
      </div>
    );
  }

  const streamerName = featuredStream.streamer?.userName || "Unknown Streamer";
  const streamerAvatar = featuredStream.streamer?.avatar || "/placeholder-user.jpg";
  const currentViewers = featuredStream.currentViewers || 0;

  const hasStreamSources = featuredStream.sources && featuredStream.sources.length > 0;

  return (
    <div className="bg-gray-900 text-white w-full">
      {topStreams.length > 0 ? (
        <>
          {isMobile ? (
            <div className="px-4 py-8">
              <h1 className="text-3xl font-bold text-white mb-6">Top Live Streams</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {topStreams.map((stream) => (
                  <TopStreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[50vh] flex">
              <div className="flex-1 flex flex-col bg-gray-900 z-20 relative">
                <div className="pt-8 px-8 flex-1 flex flex-col">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="w-10 h-10 border-2 border-green-500">
                        <AvatarImage src={getMinioUrl(streamerAvatar)} alt={streamerName} />
                        <AvatarFallback className="bg-green-600 text-white text-base">
                          {streamerName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <Link href={`/${streamerName}`} passHref>
                            <span className="text-lg font-bold text-white hover:text-green-400 cursor-pointer">
                              {streamerName}
                            </span>
                          </Link>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{currentViewers} watching</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white truncate mb-2">
                      {featuredStream.title || "Untitled Stream"}
                    </h2>

                    {featuredStream.category?.title && (
                      <p className="text-base text-gray-400 mb-2">{featuredStream.category.title}</p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2">
                      {featuredStream.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full text-xs">
                          {tag.title}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {topStreams.length > 1 && (
                    <div className="pr-8 pb-4 mt-auto">
                      <div className="flex overflow-x-auto whitespace-nowrap space-x-4 p-1 custom-scrollbar">
                        {topStreams.map((stream, index) => (
                          <SmallStreamPreviewCard
                            key={stream.id}
                            stream={stream}
                            onClick={handleSelectStream}
                            index={index}
                            selected={index === selectedIndex}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-gray-900/50 to-transparent z-10" />
              </div>

              <div className="flex-1 h-full relative">
                <div className="relative bg-gray-800 h-full w-full overflow-hidden">
                  {hasStreamSources ? (
                    <StreamPlayer
                      key={featuredStream.id}
                      sources={featuredStream.sources}
                      isPlayerMaximized={false}
                      onTogglePlayerMaximize={() => {}}
                      showPlayerControls={false}
                      isLive={featuredStream.active}
                      startedAt={featuredStream.started}
                      showOverlays={true}
                    />
                  ) : (
                    <img
                      src={getMinioUrl(featuredStream.preview || "/placeholder.jpg")}
                      alt={featuredStream.title || "Stream preview"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="pr-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Streamer</h1>
          <p className="text-gray-500">No live streams currently available. Check back later!</p>
        </div>
      )}

      <div className="px-4 py-8">
        {topCategories.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">Top Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {topCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </>
        )}

        {topCategories.map(category => (
          <StreamsByCategorySection key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}