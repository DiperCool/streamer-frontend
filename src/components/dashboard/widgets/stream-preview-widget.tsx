"use client";

import React, { useCallback } from "react"; // Import useCallback
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

  // Helper to check if the error indicates a "stream not found" scenario
  const isStreamNotFoundError = useCallback((error: ApolloError | undefined) => {
    if (!error) return false;
    // Check for GraphQL errors with specific messages
    const graphQLError = error.graphQLErrors?.find(
      (err) => err.message.includes("Stream not found") || err.message.includes("No current stream found")
    );
    if (graphQLError) return true;

    // Check for network errors with status 404
    if (error.networkError) {
      const anyNetworkError = error.networkError as any;
      if (anyNetworkError.statusCode === 404 || anyNetworkError.response?.status === 404) {
        return true;
      }
    }
    return false;
  }, []);

  // Only fetch current stream if streamer is marked as live
  const shouldFetchCurrentStream = !!activeStreamer?.id && !!streamerData?.streamer?.isLive;

  const { data: currentStreamData, loading: currentStreamLoading, error: currentStreamError, refetch: refetchCurrentStreamData } = useGetCurrentStreamQuery({
    variables: { streamerId: activeStreamer?.id ?? "" },
    skip: !shouldFetchCurrentStream, // Only fetch if streamer is potentially live
    onError: (error) => {
      if (isStreamNotFoundError(error)) {
        // Suppress console error for "stream not found" as it's an expected offline state
        console.info("Stream not found (expected for an offline streamer or stream not yet started).");
      } else {
        // Log other unexpected errors
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
        refetchStreamerData(); // Refetch streamer's general data
        refetchCurrentStreamData(); // Refetch current stream data
      }
    },
  });

  // --- Loading State ---
  if (streamerLoading || profileLoading || (shouldFetchCurrentStream && currentStreamLoading)) {
    return (
      <div className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  // --- Critical Error State (for streamer/profile data) ---
  // If there's an error fetching streamer or profile data, it's a critical issue.
  // We explicitly ignore currentStreamError here, as it will be handled by the isLive logic.
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
  
  // A streamer is considered truly live and playable if:
  // 1. The streamer's `isLive` status is true.
  // 2. We successfully fetched `currentStream` data with sources.
  // 3. There was no "stream not found" error when trying to fetch `currentStream`.
  const isLive = streamer?.isLive && currentStream?.sources && currentStream.sources.length > 0 && !isStreamNotFoundError(currentStreamError);
  const streamerName = streamer?.userName || "Streamer";
  
  const offlineBannerImage = profile?.offlineStreamBanner || profile?.channelBanner || "/placeholder.jpg";

  return (
    <div className="relative flex items-center justify-center w-full h-full bg-black">
      {isLive ? (
        <StreamPlayer
          sources={currentStream!.sources}
          playing={true}
          controls={true}
          isPlayerMaximized={false}
          onTogglePlayerMaximize={() => {}}
          showPlayerControls={false}
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
              <Badge className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs font-semibold">
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