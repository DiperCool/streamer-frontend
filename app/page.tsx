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
import NextImage from "next/image" // Aliased import to avoid conflict
import { getMinioUrl } from "@/utils/utils"
// import { StreamPlayer } from "@/src/components/stream-player" // Removed StreamPlayer import
import { cn } from "@/lib/utils"
import useEmblaCarousel from "embla-carousel-react"
import { Button } from "@/components/ui/button"

// --- Carousel Navigation Components (internal to this file) ---
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
      <div className="w-full h-[50vh] flex"> {/* Increased height to 50vh */}
        {/* Left Section: Streamer Info and Details */}
        <div className="w-1/2 p-8 flex flex-col bg-gray-900 z-20"> {/* Applied p-8 here */}
          
          {/* Top content block */}
          <div> {/* Removed pt-8 px-8 */}
            {/* Row 1: Avatar, Streamer Name, Viewers */}
            <div className="flex items-center space-x-3 mb-4">
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

            {/* Row 2: Stream Title */}
            <h2 className="text-3xl font-bold text-white line-clamp-2 mb-4">
              {featuredStream.title || "Untitled Stream"}
            </h2>

            {/* Row 3: Category */}
            {featuredStream.category?.title && (
              <p className="text-lg text-gray-300 mb-4">{featuredStream.category.title}</p>
            )}

            {/* Row 4: Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {featuredStream.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {tag.title}
                </Badge>
              ))}
            </div>
          </div>

          {/* This div will take up all available space, pushing the carousel controls to the bottom */}
          <div className="flex-grow" /> 

          {/* Bottom Section: Top Stream Previews and Carousel Controls */}
          <div> {/* Removed pb-8 px-8 */}
            <h3 className="text-lg font-semibold text-white mb-4">Top Streams</h3>
            <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
              {topStreams.map((stream, index) => (
                <div
                  key={stream.id}
                  className={cn(
                    "relative flex-shrink-0 w-32 h-18 rounded-md overflow-hidden cursor-pointer border-2",
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

            {/* Carousel Dots and Arrows */}
            <div className="flex items-center justify-center space-x-2 mt-4">
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

        {/* Right Section: Stream Player (now a black square) */}
        <div className="w-1/2 h-full">
          <div className="embla h-full w-full" ref={emblaRef}>
            <div className="embla__container h-full">
              {topStreams.map((stream) => (
                <div className="embla__slide h-full" key={stream.id}>
                  {/* Replaced StreamPlayer with a black div */}
                  <div className="flex items-center justify-center w-full h-full bg-black text-white">
                    {/* Optional: Add some text or an icon here if desired */}
                    <span className="text-lg text-gray-400">Video Player Placeholder</span>
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