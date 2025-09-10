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
import { StreamPlayer } from "@/src/components/stream-player"
import { CategoryCard } from "@/src/components/category-card"
import { StreamsByCategorySection } from "@/src/components/streams-by-category-section"
import { useIsMobile } from "@/hooks/use-mobile"
import {TopStreamCard} from "@/src/components/top-stream-card";
import { VerticalStreamCard } from "@/src/components/vertical-stream-card";

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
      <div className="px-4 py-8 text-center">
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
              {/* Mobile horizontal scroll for top streams */}
              <div className="flex overflow-x-auto whitespace-nowrap space-x-4 pb-4 custom-scrollbar">
                {topStreams.map((stream) => (
                  <div key={stream.id} className="flex-shrink-0 w-72">
                    <TopStreamCard stream={stream} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Desktop layout
            <div className="px-4 py-8">
              <div className="flex w-full items-start"> {/* Added items-start here */}
                {/* Left section: Main Stream Player with Overlay */}
                <div className="flex-[4] relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
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
                    <NextImage
                      src={getMinioUrl(featuredStream.preview || "/placeholder.jpg")}
                      alt={featuredStream.title || "Stream preview"}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 80vw"
                      priority
                      className="absolute inset-0 w-full h-full"
                    />
                  )}
                  {/* Overlay for featured stream info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                    <Link href={`/${streamerName}`} passHref>
                      <div className="flex items-center space-x-2.5 cursor-pointer">
                        <Avatar className="w-9 h-9 border-2 border-green-500">
                          <AvatarImage src={getMinioUrl(streamerAvatar)} alt={streamerName} />
                          <AvatarFallback className="bg-green-600 text-white text-sm">
                            {streamerName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xl font-bold text-white hover:text-green-400">
                          {streamerName}
                        </span>
                      </div>
                    </Link>
                    <h2 className="text-2xl font-bold text-white truncate mt-1.5">
                      {featuredStream.title || "Untitled Stream"}
                    </h2>
                    <div className="flex items-center space-x-2.5 text-gray-400 text-base mt-1.5">
                      <Users className="w-4 h-4" />
                      <span>{currentViewers} watching</span>
                      {featuredStream.category?.title && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span>{featuredStream.category.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right section: Vertical list of other top streams */}
                <div className="flex-1 flex flex-col space-y-5 pl-5"> {/* Removed h-full here */}
                  {topStreams.slice(1, 4).map((stream, index) => (
                    <VerticalStreamCard
                      key={stream.id}
                      stream={stream}
                      onClick={() => handleSelectStream(index + 1)}
                      selected={selectedIndex === index + 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="px-4 py-8 text-center">
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