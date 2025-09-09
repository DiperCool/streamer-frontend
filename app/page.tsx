"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  useGetTopStreamsQuery,
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
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"
import { StreamPlayer } from "@/src/components/stream-player"

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

  const { data: topStreamsData, loading: topStreamsLoading, error: topStreamsError } = useGetTopStreamsQuery();
  const topStreams = topStreamsData?.topStreams || [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  if (authLoading || topStreamsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    )
  }

  if (topStreamsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-red-500">Error loading top streams: {topStreamsError?.message}</p>
      </div>
    )
  }

  if (topStreams.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Welcome to Streamer</h1>
        <p className="text-gray-400">No live streams currently available. Check back later!</p>
      </div>
    )
  }

  const featuredStream = topStreams[selectedIndex];
  const streamerName = featuredStream.streamer?.userName || "Unknown Streamer";
  const streamerAvatar = featuredStream.streamer?.avatar || "/placeholder-user.jpg";
  const currentViewers = featuredStream.currentViewers || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="w-full h-[50vh] flex">
        <div className="w-1/2 pt-8 px-8 flex flex-col bg-gray-900 z-20">
          
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

          {/* This is the area for the carousel selection mechanism */}
          <div className="flex-grow flex flex-col justify-end pb-4">
            <div className="flex gap-2 overflow-x-auto custom-scrollbar">
              {topStreams.map((stream, index) => (
                <div
                  key={stream.id}
                  className={cn(
                    "relative rounded-md overflow-hidden cursor-pointer border-2",
                    "flex-shrink-0 basis-[calc((100%-1rem)/3)] aspect-video",
                    selectedIndex === index ? "border-green-500" : "border-transparent hover:border-gray-500"
                  )}
                  onClick={() => scrollTo(index)}
                >
                  <NextImage
                    src={getMinioUrl(stream.preview || "/placeholder.jpg")}
                    alt={stream.title || "Stream preview"}
                    fill
                    sizes="128px"
                    style={{ objectFit: "cover" }}
                  />
                  {selectedIndex === index && (
                    <div className="absolute inset-0 bg-green-500/30" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-2">
              <ArrowButton onClick={scrollPrev}>
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
              <ArrowButton onClick={scrollNext}>
                <ChevronRight className="h-5 w-5" />
              </ArrowButton>
            </div>
          </div>
        </div>

        <div className="w-1/2 h-full">
          <div className="embla w-full h-full" ref={emblaRef}>
            <div className="embla__container w-full h-full">
              {topStreams.map((stream) => (
                <div className="embla__slide w-full aspect-video relative bg-gray-800" key={stream.id}>
                  {stream.sources && stream.sources.length > 0 ? (
                    <StreamPlayer
                      sources={stream.sources}
                      playing={true}
                      controls={false}
                      isPlayerMaximized={false}
                      onTogglePlayerMaximize={() => {}}
                      showPlayerControls={false}
                    />
                  ) : (
                    <NextImage
                      src={getMinioUrl(stream.preview || "/placeholder.jpg")}
                      alt={stream.title || "Stream preview"}
                      fill
                      sizes="50vw"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  )}
                  <div className="absolute top-0 bottom-0 right-0 left-[-100px] bg-gradient-to-r from-black/80 to-transparent flex items-end p-4 z-20">
                    {/* Элементы, которые были здесь (LIVE Badge, viewers), теперь отображаются в левой панели */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}