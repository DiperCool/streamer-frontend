"use client"

import React, { useState } from "react"
import { useGetStreamerQuery, useGetVodsQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { VodCard } from "@/src/components/vod-card"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function StreamerVideosPage({ params }: { params: { username: string } }) {
  const { username } = params
  const [sortBy, setSortBy] = useState<SortEnumType>(SortEnumType.Desc) // Default to Most Recent
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 8; // Number of videos to load per page

  const { data: streamerData, loading: streamerLoading } = useGetStreamerQuery({
    variables: { userName: username },
  })

  const streamerId = streamerData?.streamer.id;

  const {
    data: vodsData,
    loading: vodsLoading,
    error: vodsError,
    fetchMore,
    networkStatus,
  } = useGetVodsQuery({
    variables: {
      streamerId: streamerId ?? "",
      first: videosPerPage,
      order: [{ createdAt: sortBy }],
    },
    skip: !streamerId,
    notifyOnNetworkStatusChange: true,
  })

  const handleSortChange = (value: string) => {
    setSortBy(value as SortEnumType);
    setCurrentPage(1); // Reset page when sort changes
  };

  const handleLoadMore = async () => {
    if (!vodsData?.vods?.pageInfo.hasNextPage || networkStatus === 3) return; // networkStatus 3 means fetching more

    try {
      await fetchMore({
        variables: {
          after: vodsData.vods.pageInfo.endCursor,
          first: videosPerPage,
          order: [{ createdAt: sortBy }],
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.vods?.nodes) {
            return prev;
          }
          return {
            ...prev,
            vods: {
              ...fetchMoreResult.vods,
              nodes: [...(prev.vods?.nodes ?? []), ...(fetchMoreResult.vods.nodes)],
            },
          };
        },
      });
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("Error loading more VODs:", error);
    }
  };

  if (streamerLoading || vodsLoading && networkStatus === 1) { // networkStatus 1 for initial loading
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    )
  }

  if (vodsError) {
    return <div className="text-red-500">Error loading videos: {vodsError.message}</div>;
  }

  const vods = vodsData?.vods?.nodes || [];
  const hasNextPage = vodsData?.vods?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Videos</h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select a sort option" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value={SortEnumType.Desc}>Most Recent</SelectItem>
              <SelectItem value={SortEnumType.Asc}>Oldest</SelectItem>
              {/* Add more sort options as needed, e.g., Most Viewed */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {vods.length === 0 && !vodsLoading ? (
        <p className="text-gray-400 text-center py-10">No videos found for {username}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vods.map((vod, index) => (
            <VodCard key={vod.id} vod={vod} isCurrentStream={index === 0 && false /* Placeholder for actual current stream check */} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoadingMore ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}