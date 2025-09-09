"use client"

import React, { useState } from "react"
import { CategoryDto, useGetStreamsQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { Loader2, ChevronDown, ChevronUp } from "lucide-react" // Import ChevronDown, ChevronUp
import { TopStreamCard } from "@/src/components/top-stream-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StreamsByCategorySectionProps {
  category: CategoryDto
}

const INITIAL_DISPLAY_COUNT = 4; // Number of streams to show initially
const MAX_DISPLAY_COUNT_ON_SHOW_MORE = 8; // Maximum number of streams to show when "Show More" is active

export const StreamsByCategorySection: React.FC<StreamsByCategorySectionProps> = ({ category }) => {
  const [showAll, setShowAll] = useState(false);

  const { data, loading, error } = useGetStreamsQuery({
    variables: {
      categoryId: category.id,
      first: MAX_DISPLAY_COUNT_ON_SHOW_MORE, // Fetch enough streams to cover the "show more" limit
      order: [{ currentViewers: SortEnumType.Desc }], // Order by most viewers
    },
  });

  const streams = data?.streams?.nodes || [];
  const displayedStreams = showAll
    ? streams.slice(0, MAX_DISPLAY_COUNT_ON_SHOW_MORE) // Show up to 8 streams
    : streams.slice(0, INITIAL_DISPLAY_COUNT); // Show 4 streams initially

  const canToggleMore = streams.length > INITIAL_DISPLAY_COUNT; // Button appears if there are more than 4 streams

  if (loading) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-8">Error loading streams for {category.title}: {error.message}</div>;
  }

  if (streams.length === 0) {
    return null; // Don't render section if no streams
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          <Link href={`/browse?category=${category.slug}`} passHref className="hover:text-green-400 transition-colors">
            {category.title}
          </Link>
        </h2>
        {canToggleMore && (
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="text-green-500 hover:text-green-400"
          >
            {showAll ? (
              <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Responsive grid */}
        {displayedStreams.map((stream) => (
          <TopStreamCard key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  );
};