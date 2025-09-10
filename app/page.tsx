"use client"

import React from "react" // Removed useCallback, useEffect, useState as they are no longer needed for carousel
import { useAuth0 } from "@auth0/auth0-react"
import {
  useGetTopStreamsQuery,
  useGetTopCategoriesQuery,
  StreamDto,
  SortEnumType,
} from "@/graphql/__generated__/graphql"
import { Loader2, Users } from "lucide-react" // Removed ChevronLeft, ChevronRight
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import NextImage from "next/image"
import { getMinioUrl } from "@/utils/utils"
// import useEmblaCarousel from "embla-carousel-react" // Removed
// import { Button } from "@/components/ui/button" // Button is still used for other sections
import { StreamPlayer } from "@/src/components/stream-player"
import { CategoryCard } from "@/src/components/category-card"
import { StreamsByCategorySection } from "@/src/components/streams-by-category-section"

// Removed DotButtonProps, DotButton, ArrowButtonProps, ArrowButton components

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0()

  const { data: topStreamsData, loading: topStreamsLoading, error: topStreamsError } = useGetTopStreamsQuery();
  const topStreams = topStreamsData?.topStreams || [];

  const { data: topCategoriesData, loading: topCategoriesLoading, error: topCategoriesError } = useGetTopCategoriesQuery();
  const topCategories = topCategoriesData?.topCategories || [];

  // Removed emblaRef, emblaApi, selectedIndex, onSelect, scrollTo, scrollPrev, scrollNext states and callbacks

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
    )
  }

  const featuredStream = topStreams[0]; // Always display the first stream

  // Only proceed if there's a featured stream to display
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

  return (
    <div className="flex-1 bg-gray-900 text-white overflow-x-hidden">
      <div className="flex-1 h-[50vh] flex">
        <div className="w-1/2 flex flex-col bg-gray-900 z-20">
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
            {/* Removed carousel selection mechanism */}
          </div>
        </div>

        <div className="w-1/2 h-full">
          {/* Directly render the StreamPlayer for the featuredStream */}
          <div className="w-full h-full relative bg-gray-800 flex-none">
            {featuredStream.sources && featuredStream.sources.length > 0 ? (
              <StreamPlayer
                sources={featuredStream.sources}
                playing={true}
                controls={false}
                isPlayerMaximized={false}
                onTogglePlayerMaximize={() => {}}
                showPlayerControls={false}
              />
            ) : (
              <NextImage
                src={getMinioUrl(featuredStream.preview || "/placeholder.jpg")}
                alt={featuredStream.title || "Stream preview"}
                fill
                sizes="50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-8">
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