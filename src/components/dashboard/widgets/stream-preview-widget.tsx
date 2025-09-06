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
  useGetProfileQuery,
} from "@/graphql/__generated__/graphql";
import { getMinioUrl } from "@/utils/utils";
import { StreamPlayer } from "@/src/components/stream-player";
import { ApolloError } from "@apollo/client";

// Helper to check if the error indicates a "stream not found" scenario
// This function is now less critical for the main error display, but good for debugging/clarity
const isStreamNotFoundError = (error: ApolloError | undefined) => {
  if (!error) return false;
  const graphQLErrorMessages = error.graphQLErrors?.map(err => err.message);
  if (graphQLErrorMessages?.some(msg => msg.includes("Stream not found") || msg.includes("No current stream found"))) {
    return true;
  }
  // Also check for network errors like 404 directly
  if (error.networkError && 'statusCode' in error.networkError && (error.networkError as any).statusCode === 404) {
    return true;
  }
  return false;
};

export const StreamPreviewWidget: React.FC = () => {
  const { activeStreamer } = useDashboard();

  const { data: streamerData, loading: streamerLoading, error: streamerError, refetch: refetchStreamerData } = useGetStreamerQuery({
    variables: { userName: activeStreamer?.userName ?? "" },
    skip: !activeStreamer?.userName,
  });

  // Only fetch current stream if streamer is marked as live
  const shouldFetchCurrentStream = !!activeStreamer?.id && !!streamerData?.streamer?.isLive;

  const { data: currentStreamData, loading: currentStreamLoading, error: currentStreamError, refetch: refetchCurrentStreamData } = useGetCurrentStreamQuery({
    variables: { streamerId: activeStreamer?.id ?? "" },
    skip: !shouldFetchCurrentStream,
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
  
  // Determine if the streamer is truly live and has a playable stream.
  // If streamer.isLive is true, but currentStreamData is null/undefined (e.g., due to 404),
  // then isLive will be false, and the offline banner will be shown.
  const isLive = streamer?.isLive && currentStream?.sources && currentStream.sources.length > 0;
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