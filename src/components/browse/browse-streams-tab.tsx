"use client"

import React, { useState } from "react"
import { useGetStreamsQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { TopStreamCard } from "@/src/components/top-stream-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" // Import Select components for sorting
import { TagSelectInput } from "@/src/components/ui/tag-select-input" // Import the new TagSelectInput

export const BrowseStreamsTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const streamsPerPage = 15;
  const [sortBy, setSortBy] = useState<SortEnumType>(SortEnumType.Desc); // Default to most viewers
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null); // New state for selected tag

  const {
    data: streamsData,
    loading: streamsLoading,
    error: streamsError,
    fetchMore,
    networkStatus,
    refetch, // Add refetch to manually trigger query
  } = useGetStreamsQuery({
    variables: {
      first: streamsPerPage,
      order: [{ currentViewers: sortBy }],
      tag: selectedTagId, // Pass selected tag ID to the query
    },
    notifyOnNetworkStatusChange: true,
  });

  // Refetch streams when sort order or selected tag changes
  React.useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
    refetch();
  }, [sortBy, selectedTagId, refetch]);

  const handleLoadMore = async () => {
    if (!streamsData?.streams?.pageInfo.hasNextPage || networkStatus === 3) return;

    try {
      await fetchMore({
        variables: {
          after: streamsData.streams.pageInfo.endCursor,
          first: streamsPerPage,
          order: [{ currentViewers: sortBy }],
          tag: selectedTagId, // Ensure tag filter is passed to fetchMore
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
      {/* Контейнер для фильтров и сортировки: flex-col на мобильных, flex-row и justify-end на sm+ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        {/* Tag Select Input */}
        <div className="flex items-center space-x-2"> {/* Убраны классы ширины отсюда */}
          <span className="text-gray-400 hidden sm:block">Filter by Tag:</span> {/* Скрыто на мобильных */}
          <TagSelectInput
            value={selectedTagId}
            onValueChange={setSelectedTagId}
            placeholder="All Tags"
            className="w-full sm:w-[180px]" // Применяем ширину напрямую к компоненту
          />
        </div>

        {/* Sort By Select */}
        <div className="flex items-center space-x-2"> {/* Убраны классы ширины отсюда */}
          <span className="text-gray-400 hidden sm:block">Sort by:</span> {/* Скрыто на мобильных */}
          <Select value={sortBy} onValueChange={(value: SortEnumType) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-white"> {/* Применяем ширину напрямую к триггеру */}
              <SelectValue placeholder="Select a sort option" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value={SortEnumType.Desc}>Most Viewers</SelectItem>
              <SelectItem value={SortEnumType.Asc}>Least Viewers</SelectItem>
              {/* Add more sort options as needed */}
            </SelectContent>
          </Select>
        </div>
      </div>

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