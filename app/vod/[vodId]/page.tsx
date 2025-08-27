"use client"

import React, { useState } from "react"
import { useGetVodQuery, useGetStreamerQuery, useGetProfileQuery } from "@/graphql/__generated__/graphql"
import { Loader2, MessageSquare } from "lucide-react"
import { getMinioUrl } from "@/utils/utils"
import { VodDetailsSection } from "@/src/components/vod-details-section"
import ReactPlayer from "react-player";
import { VodChatSection } from "@/src/components/vod-chat-section"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function VodDetailPage({ params }: { params: { vodId: string } }) {
  const { vodId } = params
  const [isChatVisible, setIsChatVisible] = useState(true);

  const { data: vodData, loading: vodLoading, error: vodError } = useGetVodQuery({
    variables: { vodId },
  })

  const streamerId = vodData?.vod?.streamer?.id ?? ""

  const { data: streamerData, loading: streamerLoading, error: streamerError } = useGetStreamerQuery({
    variables: { userName: vodData?.vod?.streamer?.userName ?? "" },
    skip: !streamerId,
  })

  const { data: profileData, loading: profileLoading, error: profileError } = useGetProfileQuery({
    variables: { streamerId },
    skip: !streamerId,
  })

  if (vodLoading || streamerLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    )
  }

  if (vodError || streamerError || profileError || !vodData?.vod) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Error loading VOD or streamer data: {vodError?.message || streamerError?.message || profileError?.message || "VOD not found."}</p>
      </div>
    )
  }

  const vod = vodData.vod
  const streamer = streamerData?.streamer
  const profile = profileData?.profile

  if (!streamer || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Streamer profile not found for this VOD.</p>
      </div>
    )
  }

  const videoSource = vod.source ? getMinioUrl(vod.source) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        isChatVisible ? "lg:pr-80" : ""
      )}>
        {/* Video Player Section */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"> {/* Убран mb-6 */}
          {videoSource ? (
            <ReactPlayer
              src={videoSource}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              className="z-10"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400">
              <p>No video source available for this VOD.</p>
            </div>
          )}

          {/* Кнопка "Показать чат" (только если чат скрыт) */}
          {!isChatVisible && (
            <Button
              variant="outline"
              className="absolute top-4 right-4 z-50 bg-gray-800/70 text-gray-300 hover:bg-gray-700"
              onClick={() => setIsChatVisible(true)}
            >
              <MessageSquare className="h-5 w-5 mr-2" /> Show Chat
            </Button>
          )}
        </div>

        {/* VOD Details and Streamer Info */}
        <div className="container mx-auto px-4 py-4"> {/* Изменен py-8 на py-4 */}
          <VodDetailsSection vod={vod} streamer={streamer} profile={profile} />
        </div>
      </div>

      {/* VOD Chat Sidebar */}
      <div
        className={cn(
          "fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-gray-800 border-l border-gray-700 flex-col z-40 overflow-y-auto transition-transform duration-300 ease-in-out",
          isChatVisible ? "translate-x-0" : "translate-x-full",
          "hidden lg:flex"
        )}
      >
        <VodChatSection onCloseChat={() => setIsChatVisible(false)} />
      </div>

      {/* VOD Chat (отображается на маленьких экранах, если чат виден) */}
      {isChatVisible && (
        <div
          className="lg:hidden w-full bg-gray-800 rounded-lg mt-6 flex flex-col h-[50vh] overflow-y-auto"
        >
          <VodChatSection onCloseChat={() => setIsChatVisible(false)} />
        </div>
      )}
    </div>
  )
}