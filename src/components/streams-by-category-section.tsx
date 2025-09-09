"use client"

import React from "react"
import { CategoryDto, useGetStreamsQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { TopStreamCard } from "@/src/components/top-stream-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StreamsByCategorySectionProps {
  category: CategoryDto
}

export const StreamsByCategorySection: React.FC<StreamsByCategorySectionProps> = ({ category }) => {
  const { data, loading, error } = useGetStreamsQuery({
    variables: {
      categoryId: category.id,
      first: 6, // Fetch a fixed number of streams
      order: [{ currentViewers: SortEnumType.Desc }], // Order by most viewers
    },
  });

  const streams = data?.streams?.nodes || [];

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
        <Link href={`/browse?category=${category.slug}`} passHref>
          <Button variant="ghost" className="text-green-500 hover:text-green-400">
            See All
          </Button>
        </Link>
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-4 custom-scrollbar">
        {streams.map((stream) => (
          <div key={stream.id} className="flex-shrink-0 w-72"> {/* Fixed width for horizontal scroll */}
            <TopStreamCard stream={stream} />
          </div>
        ))}
      </div>
    </div>
  );
};