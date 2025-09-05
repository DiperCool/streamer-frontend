"use client";

import React from "react";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera } from "lucide-react";
import { useDashboard } from "@/src/contexts/DashboardContext";
import {
  useGetStreamerQuery,
  useStreamerUpdatedSubscription,
  useGetCurrentStreamQuery,
} from "@/graphql/__generated__/graphql";
import { getMinioUrl } from "@/utils/utils";
import { StreamPlayer } from "@/src/components/stream-player";

export const StreamPreviewWidget: React.FC = () => {
  const { activeStreamer } = useDashboard();

  const { data: streamerData, loading: streamerLoading, error: streamerError, refetch } = useGetStreamerQuery({
    variables: { userName: activeStreamer?.userName ?? "" },
    skip: !activeStreamer?.userName,
  });

  // Fetch current stream data only if streamerData is available and the streamer is live
  const { data: currentStreamData, loading: currentStreamLoading, error: currentStreamError } = useGetCurrentStreamQuery({
    variables: { streamerId: activeStreamer?.id ?? "" },
    skip: !activeStreamer?.id || !streamerData?.streamer?.isLive, // Skip if no activeStreamer ID or if streamer is not live
  });

  useStreamerUpdatedSubscription({
    variables: { streamerId: activeStreamer?.id ?? "" },
    skip: !activeStreamer?.id,
    onData: ({ data }) => {
      if (data.data?.streamerUpdated) {
        refetch(); // Refetch streamer data to update live status
      }
    },
  });

  if (streamerLoading) { // Only check streamerLoading here, currentStreamLoading will be skipped if not live
    return (
      <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </CardContent>
    );
  }

  if (streamerError) { // Only check streamerError here
    return (
      <CardContent className="flex-1 p-3 text-red-500 text-sm flex items-center justify-center">
        Error loading streamer data.
      </CardContent>
    );
  }

  const streamer = streamerData?.streamer;
  const currentStream = currentStreamData?.currentStream;
  // isLive is true only if streamer is marked as live AND we successfully fetched stream sources
  const isLive = streamer?.isLive && currentStream?.sources && currentStream.sources.length > 0;
  const streamerName = streamer?.userName || "Streamer";
  const offlineBanner = "/placeholder.jpg"; // Placeholder for offline banner

  return (
    <CardContent className="flex-1 p-0 relative flex items-center justify-center bg-black">
      {isLive ? (
        <StreamPlayer
          sources={currentStream!.sources} // currentStream is guaranteed to exist and have sources if isLive is true
          playing={true}
          controls={true}
          isPlayerMaximized={false}
          onTogglePlayerMaximize={() => {}}
        />
      ) : (
        <>
          <Image
            src={offlineBanner}
            alt="Offline Banner"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="absolute top-0 left-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-md shadow-lg">
              <Badge className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-xs font-semibold">
                OFFLINE
              </Badge>
              <span className="text-white text-base font-semibold">
                {streamerName} is offline
              </span>
            </div>
          </div>
        </>
      )}
    </CardContent>
  );
};