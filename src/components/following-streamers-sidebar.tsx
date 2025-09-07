"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useGetMyFollowingsQuery,
  SortEnumType,
  StreamerFollowerDto,
} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"

const INITIAL_DISPLAY_COUNT = 5;
const ITEMS_PER_LOAD = 5;

export const FollowingStreamersSidebar: React.FC = () => {
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [hoveredStreamerId, setHoveredStreamerId] = useState<string | null>(null); // State to track hovered streamer

  const {
    data,
    loading,
    error,
    fetchMore,
    networkStatus,
  } = useGetMyFollowingsQuery({
    variables: {
      first: displayCount,
      order: [{ isLive: SortEnumType.Desc }, { userName: SortEnumType.Asc }], // Live streamers first, then alphabetical
    },
    notifyOnNetworkStatusChange: true,
  });

  const streamers = data?.myFollowings?.nodes || [];
  const pageInfo = data?.myFollowings?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage;
  const isLoadingMore = networkStatus === 3; // Fetching more

  const handleShowMore = async () => {
    if (!hasNextPage || isLoadingMore) return;

    await fetchMore({
      variables: {
        first: ITEMS_PER_LOAD,
        after: pageInfo?.endCursor,
        order: [{ isLive: SortEnumType.Desc }, { userName: SortEnumType.Asc }],
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.myFollowings?.nodes) {
          return prev;
        }
        return {
          ...prev,
          myFollowings: {
            ...fetchMoreResult.myFollowings,
            nodes: [...(prev.myFollowings?.nodes ?? []), ...(fetchMoreResult.myFollowings.nodes)],
          },
        };
      },
    });
    setDisplayCount(prev => prev + ITEMS_PER_LOAD);
  };

  const handleShowLess = () => {
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  };

  if (loading && networkStatus === 1) { // Initial load
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading followings: {error.message}</div>;
  }

  if (streamers.length === 0) {
    return <div className="text-gray-400 text-sm p-4">You are not following any streamers yet.</div>;
  }

  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">Following</h3>
      {streamers.map((streamer) => (
        <Link key={streamer.id} href={`/${streamer.userName}`} passHref>
          <div
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
            onMouseEnter={() => setHoveredStreamerId(streamer.id)}
            onMouseLeave={() => setHoveredStreamerId(null)}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={getMinioUrl(streamer.avatar!)} alt={streamer.userName || "Streamer"} />
                <AvatarFallback className="bg-green-600 text-white text-sm">
                  {streamer.userName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className={cn("font-medium text-sm", streamer.isLive ? "text-white" : "text-gray-500")}>
                  {streamer.userName}
                </span>
                {streamer.isLive ? (
                  hoveredStreamerId === streamer.id && streamer.currentStream?.title ? (
                    <span className="text-gray-400 text-xs">{streamer.currentStream.title}</span>
                  ) : (
                    streamer.currentStream?.category?.title ? (
                      <span className="text-gray-400 text-xs">{streamer.currentStream.category.title}</span>
                    ) : (
                      <span className="text-gray-400 text-xs"></span> // Show nothing if live but no category
                    )
                  )
                ) : (
                  <span className="text-gray-500 text-xs">Offline</span> // Display "Offline" when not live
                )}
              </div>
            </div>
            {streamer.isLive && streamer.currentStream?.currentViewers !== undefined ? (
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-gray-400 text-xs">
                  {streamer.currentStream.currentViewers >= 1000 ? 
                    `${(streamer.currentStream.currentViewers / 1000).toFixed(1)}K` : 
                    streamer.currentStream.currentViewers}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 rounded-full bg-gray-500" /> {/* Grey circle for offline */}
              </div>
            )}
          </div>
        </Link>
      ))}

      <div className="flex justify-between px-3 pt-2">
        {hasNextPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowMore}
            disabled={isLoadingMore}
            className="text-green-500 hover:bg-gray-800 hover:text-green-400"
          >
            {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Show More"}
          </Button>
        )}
        {displayCount > INITIAL_DISPLAY_COUNT && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowLess}
            className="text-green-500 hover:bg-gray-800 hover:text-green-400"
          >
            Show Less
          </Button>
        )}
      </div>
    </div>
  );
};