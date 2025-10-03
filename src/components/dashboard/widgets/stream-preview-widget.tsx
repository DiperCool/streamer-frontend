"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera } from "lucide-react";
import { useDashboard } from "@/src/contexts/DashboardContext";
import {
  useGetStreamerQuery,
  useStreamerUpdatedSubscription,
  useGetCurrentStreamQuery,
  useGetProfileQuery,
} from "@/graphql/__generated__/graphql";
import { getMinioUrl } from "@/utils/utils";
import { StreamPlayer } from "@/src/components/stream-player";
import { ApolloError } from "@apollo/client";

export const StreamPreviewWidget: React.FC = () => {
  const { activeStreamer } = useDashboard();

  const { data: streamerData, loading: streamerLoading, error: streamerError, refetch: refetchStreamerData } = useGetStreamerQuery({
    variables: { userName: activeStreamer?.userName ?? "" },
    skip: !activeStreamer?.userName,
  });

  const isStreamNotFoundError = useCallback((error: ApolloError | undefined) => {
    if (!error) return false;
    const graphQLError = error.graphQLErrors?.find(
      (err) => err.message.includes("Stream not found") || err.message.includes("No current stream found")
    );
    if (graphQLError) return true;

    if (error.networkError) {
      const anyNetworkError = error.networkError as any;
      if (anyNetworkError.statusCode === 404 || anyNetworkError.response?.status === 404) {
        return true;
      }
    }
    return false;
  }, []);

  const shouldFetchCurrentStream = !!activeStreamer?.id && !!streamerData?.streamer?.isLive;

  const { data: currentStreamData, loading: currentStreamLoading, error: currentStreamError, refetch: refetchCurrentStreamData } = useGetCurrentStreamQuery({
    variables: { streamerId: activeStreamer?.id ?? "" },
    skip: !shouldFetchCurrentStream,
    onError: (error) => {
      if (isStreamNotFoundError(error)) {
        console.info("Stream not found (expected for an offline streamer or stream not yet started).");
      } else {
        console.error("Error fetching current stream:", error);
      }
    },
  });

  const { data: profileData, loading: profileLoading, error: profileError } = useGetProfileQuery({
    variables: { streamerId: activeStreamer?.id ?? "" },
    skip: !activeStreamer?.id,
  });

  useStreamerUpdatedSubscription({
    variables: { streamerId: activeStreamer?.id ?? "" },
    skip: !activeStreamer?.id,
    onData: ({ data }) => {
      if (data.data?.streamerUpdated) {
        refetchStreamerData();
        refetchCurrentStreamData();
      }
    },
  });

  if (streamerLoading || profileLoading || (shouldFetchCurrentStream && currentStreamLoading)) {
    return (
      <div className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (streamerError || profileError) {
    return (
      <div className="flex-1 p-3 text-red-500 text-sm flex items-center justify-center">
        Error loading streamer or profile data.
      </div>
    );
  }

  const streamer = streamerData?.streamer;
  const profile = profileData?.profile;
  const currentStream = currentStreamData?.currentStream;
  
  const isLive = streamer?.isLive && currentStream?.sources && currentStream.sources.length > 0 && !isStreamNotFoundError(currentStreamError);
  const streamerName = streamer?.userName || "Streamer";
  
  const offlineBannerImage = profile?.offlineStreamBanner || profile?.channelBanner || "/placeholder.jpg";

  return (
    <div className="relative flex items-center justify-center w-full h-full bg-black">
      {isLive ? (
        <StreamPlayer
          sources={currentStream!.sources}
          isPlayerMaximized={false}
          onTogglePlayerMaximize={() => {}}
          showPlayerControls={false}
          isLive={isLive}
          startedAt={currentStream?.started}
          showOverlays={false}
        />
      ) : (
        <>
          <Image
            src={getMinioUrl(offlineBannerImage)}
            alt="Offline Banner"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="absolute top-0 left-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-md shadow-lg">
              <Badge variant="statusOffline" className="px-2 py-1 rounded-full text-xs font-semibold">
                OFFLINE
              </Badge>
              <span className="text-white text-base font-semibold">
                {streamerName} is offline
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};