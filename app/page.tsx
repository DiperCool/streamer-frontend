"use client"

import React, { useCallback, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  useGetTopStreamsQuery,
  useGetTopCategoriesQuery,
  StreamDto,
  SortEnumType,
} from "@/graphql/__generated__/graphql"
import { Loader2, Users, ChevronLeft, ChevronRight } from "lucide-react"
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
import { useIsMobile } from "@/hooks/use-mobile" // Импортируем useIsMobile
import {TopStreamCard} from "@/src/components/top-stream-card"; // Импортируем TopStreamCard

interface DotButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
}

const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => (
  <button
    className={cn(
      "w-2 h-2 rounded-full bg-gray-500 transition-colors duration-200",
      selected ? "bg-green-500" : "hover:bg-gray-400"
    )}
    type="button"
    onClick={onClick}
  />
);

interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ children, onClick, disabled }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    disabled={disabled}
    className="text-gray-400 hover:text-white"
  >
    {children}
  </Button>
);

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0()
  const isMobile = useIsMobile(); // Используем хук для определения мобильного устройства

  const { data: topStreamsData, loading: topStreamsLoading, error: topStreamsError } = useGetTopStreamsQuery();
  const topStreams = topStreamsData?.topStreams || [];

  const { data: topCategoriesData, loading: topCategoriesLoading, error: topCategoriesError } = useGetTopCategoriesQuery();
  const topCategories = topCategoriesData?.topCategories || [];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    if (topStreams.length === 0) return;
    const newIndex = (index + topStreams.length) % topStreams.length;
    setSelectedIndex(newIndex);
  }, [topStreams.length]);

  const scrollPrev = useCallback(() => {
    scrollTo(selectedIndex - 1);
  }, [selectedIndex, scrollTo]);

  const scrollNext = useCallback(() => {
    scrollTo(selectedIndex + 1);
  }, [selectedIndex, scrollTo]);

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
        <p className="text-gray-400">No live streams currently available. Check back later!</p>
      </div>
    );
  }

  const streamerName = featuredStream.streamer?.userName || "Unknown Streamer";
  const streamerAvatar = featuredStream.streamer?.avatar || "/placeholder-user.jpg";
  const currentViewers = featuredStream.currentViewers || 0;

  // StreamPlayer теперь сам выбирает HLS-источник
  const hasStreamSources = featuredStream.sources && featuredStream.sources.length > 0;

  return (
    <div className="bg-gray-900 text-white w-full">
      {topStreams.length > 0 ? (
        <>
          {isMobile ? ( // Мобильный вид: список TopStreamCard
            <div className="px-4 py-8">
              <h1 className="text-3xl font-bold text-white mb-6">Top Live Streams</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {topStreams.map((stream) => (
                  <TopStreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            </div>
          ) : ( // Десктопный вид: карусель с двумя колонками
            <div className="h-[50vh] flex">
              <div className="flex-1 flex flex-col bg-gray-900 z-20 relative"> {/* Changed w-1/2 to flex-1 */}
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
                          <div className="flex items-center text-gray-400 text-sm">
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
                      <p className="text-base text-gray-300 mb-2">{featuredStream.category.title}</p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2">
                      {featuredStream.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
                          {tag.title}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Controls for selecting stream */}
                  {topStreams.length > 1 && (
                    <div className="flex-grow flex flex-col justify-end pb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <ArrowButton onClick={scrollPrev} disabled={topStreams.length <= 1}>
                          <ChevronLeft className="h-5 w-5" />
                        </ArrowButton>
                        <div className="flex space-x-2">
                          {topStreams.map((_, index) => (
                            <DotButton
                              key={index}
                              selected={index === selectedIndex}
                              onClick={() => scrollTo(index)}
                            />
                          ))}
                        </div>
                        <ArrowButton onClick={scrollNext} disabled={topStreams.length <= 1}>
                          <ChevronRight className="h-5 w-5" />
                        </ArrowButton>
                      </div>
                    </div>
                  )}
                </div>
                {/* Градиент для правой части левой панели */}
                <div className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-gray-900/50 to-transparent z-10" />
              </div>

              <div className="flex-1 h-full"> {/* Changed w-1/2 to flex-1 */}
                {/* Main Stream Player */}
                <div className="w-full h-full relative bg-gray-800">
                  {hasStreamSources ? (
                    <StreamPlayer
                      key={featuredStream.id}
                      sources={featuredStream.sources}
                      isPlayerMaximized={false}
                      onTogglePlayerMaximize={() => {}}
                      showPlayerControls={false}
                      isLive={featuredStream.active}
                      startedAt={featuredStream.started}
                    />
                  ) : (
                    <img // Changed from NextImage to img
                      src={getMinioUrl(featuredStream.preview || "/placeholder.jpg")}
                      alt={featuredStream.title || "Stream preview"}
                      className="absolute inset-0 w-full h-full object-cover" // Added absolute inset-0
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Streamer</h1>
          <p className="text-gray-400">No live streams currently available. Check back later!</p>
        </div>
      )}

      <div className="px-4 py-8"> {/* Categories Section */}
        {/* Top Categories Section */}
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

        {/* Streams by Category Sections */}
        {topCategories.map(category => (
          <StreamsByCategorySection key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}