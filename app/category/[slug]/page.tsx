"use client"

import React, { useState, useEffect } from "react"
import {
  useGetCategoryBySlugQuery,
  useGetStreamsQuery,
  SortEnumType,
} from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { TopStreamCard } from "@/src/components/top-stream-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TagSelectInput } from "@/src/components/ui/tag-select-input"
import Image from "next/image"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge" // Import Badge

const STREAMS_PER_PAGE = 15; // Consistent with browse-streams-tab

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [sortBy, setSortBy] = useState<SortEnumType>(SortEnumType.Desc); // Default to Most Viewers
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useGetCategoryBySlugQuery({
    variables: { slug },
  });

  const categoryId = categoryData?.categoryBySlug?.id;

  const {
    data: streamsData,
    loading: streamsLoading,
    error: streamsError,
    fetchMore,
    networkStatus,
    refetch,
  } = useGetStreamsQuery({
    variables: {
      categoryId: categoryId,
      first: STREAMS_PER_PAGE,
      order: [{ currentViewers: sortBy }],
      tag: selectedTagId,
    },
    skip: !categoryId, // Skip stream query if categoryId is not yet available
    notifyOnNetworkStatusChange: true,
  });

  // Refetch streams when sort order or selected tag changes
  useEffect(() => {
    if (categoryId) { // Only refetch if categoryId is available
      setCurrentPage(1); // Reset page when filters change
      refetch();
    }
  }, [sortBy, selectedTagId, categoryId, refetch]);

  const handleLoadMore = async () => {
    if (!streamsData?.streams?.pageInfo.hasNextPage || networkStatus === 3) return;

    try {
      await fetchMore({
        variables: {
          after: streamsData.streams.pageInfo.endCursor,
          first: STREAMS_PER_PAGE,
          order: [{ currentViewers: sortBy }],
          tag: selectedTagId,
          categoryId: categoryId, // Ensure categoryId is passed to fetchMore
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

  if (categoryLoading || (categoryId && streamsLoading && networkStatus === 1)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (categoryError) {
    return <div className="text-red-500 p-4">Error loading category: {categoryError.message}</div>;
  }

  if (!categoryData?.categoryBySlug) {
    return <div className="text-gray-400 p-4 text-center">Category not found.</div>;
  }

  const category = categoryData.categoryBySlug;
  const imageUrl = category.image ? getMinioUrl(category.image) : "/placeholder.jpg";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="flex items-start space-x-6 mb-8">
        {/* Image on left */}
        <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-gray-700"> {/* Adjusted size and added fallback background */}
          <Image
            src={imageUrl}
            alt={category.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="80px" // Adjusted sizes prop for w-20
            priority
          />
        </div>
        {/* Text content on right */}
        <div className="flex flex-col flex-1 py-0"> {/* Adjusted padding */}
          <h1 className="text-4xl font-bold text-white mb-2">{category.title}</h1>
          <div className="flex items-center space-x-2 text-gray-400 text-lg">
            {/* Watching count as a badge */}
            <Badge className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm font-semibold flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-1" />
              {category.watchers} watching
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* Changed flex-row to flex-col on mobile, and added space-y for vertical spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        {/* Tag Select Input */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 hidden sm:block">Filter by Tag:</span> {/* Hide label on mobile */}
          <TagSelectInput
            value={selectedTagId}
            onValueChange={setSelectedTagId}
            placeholder="All Tags"
            className="w-full sm:w-[180px]" // Make full width on mobile, fixed on sm+
          />
        </div>

        {/* Sort By Select */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 hidden sm:block">Sort by:</span> {/* Hide label on mobile */}
          <Select value={sortBy} onValueChange={(value: SortEnumType) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700 text-white"> {/* Make full width on mobile, fixed on sm+ */}
              <SelectValue placeholder="Select a sort option" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value={SortEnumType.Desc}>Most Viewers</SelectItem>
                <SelectItem value={SortEnumType.Asc}>Least Viewers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Streams List */}
      {streams.length === 0 && !streamsLoading ? (
        <p className="text-gray-400 text-center py-10">No live streams currently available in this category.</p>
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
}