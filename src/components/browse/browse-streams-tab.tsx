"use client"

import React, { useState } from "react"
import { useGetStreamsQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { TopStreamCard } from "@/src/components/top-stream-card"
import { Button } from "@/components/ui/button"

export const BrowseStreamsTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const streamsPerPage = 12; // Number of streams to load per page

  const {
    data: streamsData,
    loading: streamsLoading,
    error: streamsError,
    fetchMore,
    networkStatus,
  } = useGetStreamsQuery({
    variables: {
      first: streamsPerPage,
      order: [{ currentViewers: SortEnumType.Desc }], // Default sort by most viewers
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleLoadMore = async () => {
    if (!streamsData?.streams?.pageInfo.hasNextPage || networkStatus === 3) return;

    try {
      await fetchMore({
        variables: {
          after: streamsData.streams.pageInfo.endCursor,
          first: streamsPerPage,
          order: [{ currentViewers: SortEnumType.Desc }],
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.streams?.nodes) {
            return prev;
          }
          return {
            ...prev,
            streams: {
              ...fetchMoreResult.streams,
              nodes: [...(prev.streams?.nodes ?? []), ...(fetchMoreResult.streams.nodes)],
            },
          };
        },
      });
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("Error loading more streams:", error);
    }
  };

  const streams = streamsData?.streams?.nodes || [];
  const hasNextPage = streamsData?.streams?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  if (streamsLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (streamsError) {
    return <div className="text-red-500">Error loading streams: {streamsError.message}</div>;
  }

  return (
    <div className="space-y-8">
      {streams.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No live streams currently available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streams.map((stream) => (
            <TopStreamCard key={stream.id} stream={stream} />
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
  );
};