"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  useGetTopStreamsQuery,
  useGetStreamsQuery,
  StreamDto,
  SortEnumType,
} from "@/graphql/__generated__/graphql"
import { Loader2, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getMinioUrl } from "@/utils/utils"
import { StreamPlayer } from "@/src/components/stream-player"
import { TopStreamCard } from "@/src/components/top-stream-card"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0()

  const { data: topStreamsData, loading: topStreamsLoading, error: topStreamsError } = useGetTopStreamsQuery();
  const featuredStream = topStreamsData?.topStreams?.[0];

  const { data: otherStreamsData, loading: otherStreamsLoading, error: otherStreamsError } = useGetStreamsQuery({
    variables: {
      first: 10, // Fetch a few more streams for the carousel
      order: [{ currentViewers: SortEnumType.Desc }],
      where: featuredStream ? { id: { neq: featuredStream.id } } : undefined, // Exclude the featured stream
    },
    skip: !topStreamsData, // Only fetch other streams if top streams are loaded
  });
  const otherStreams = otherStreamsData?.streams?.nodes || [];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (authLoading || topStreamsLoading || otherStreamsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    )
  }

  if (topStreamsError || otherStreamsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-red-500">Error loading streams: {topStreamsError?.message || otherStreamsError?.message}</p>
      </div>
    )
  }

  if (!featuredStream) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Welcome to Streamer</h1>
        <p className="text-gray-400">No live streams currently available. Check back later!</p>
      </div>
    )
  }

  const streamerName = featuredStream.streamer?.userName || "Unknown Streamer";
  const streamerAvatar = featuredStream.streamer?.avatar || "/placeholder-user.jpg";
  const currentViewers = featuredStream.currentViewers || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative w-full h-[calc(100vh-4rem)] flex">
        {/* Left Section: Streamer Info and Details */}
        <div className="absolute top-0 left-0 z-20 p-8 w-full md:w-1/2 lg:w-2/5 xl:w-1/3 flex flex-col justify-start space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-green-500">
              <AvatarImage src={getMinioUrl(streamerAvatar)} alt={streamerName} />
              <AvatarFallback className="bg-green-600 text-white text-lg">
                {streamerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link href={`/${streamerName}`} passHref>
                <span className="text-xl font-bold text-white hover:text-green-400 cursor-pointer">
                  {streamerName}
                </span>
              </Link>
              <div className="flex items-center text-gray-400 text-sm">
                <Users className="w-4 h-4 mr-1" />
                <span>{currentViewers} watching</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white line-clamp-2">
            {featuredStream.title || "Untitled Stream"}
          </h2>
          {featuredStream.category?.title && (
            <p className="text-lg text-gray-300">{featuredStream.category.title}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {featuredStream.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                {tag.title}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right Section: Stream Player */}
        <div className="absolute inset-0 w-full h-full">
          <StreamPlayer
            sources={featuredStream.sources}
            playing={true}
            controls={false} // Hide controls for a cleaner look as per screenshot
            isPlayerMaximized={false}
            onTogglePlayerMaximize={() => {}}
            showPlayerControls={false} // Ensure no player controls are shown
          />
        </div>
      </div>

      {/* Other Streams Carousel */}
      {otherStreams.length > 0 && (
        <div className="relative px-8 py-6 bg-gray-900 border-t border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">More Streams</h3>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex -ml-4">
              {otherStreams.map((stream) => (
                <div key={stream.id} className="embla__slide flex-none min-w-0 pl-4" style={{ flex: '0 0 25%' }}>
                  <TopStreamCard stream={stream} />
                </div>
              ))}
            </div>
            <button
              className="embla__button embla__button--prev absolute top-1/2 left-0 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700/90 text-white p-2 rounded-full z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="embla__button embla__button--next absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700/90 text-white p-2 rounded-full z-10"
              onClick={scrollNext}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}