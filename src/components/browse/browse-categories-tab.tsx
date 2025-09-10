"use client"

import React, { useState } from "react"
import { useGetCategoriesQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { CategoryCard } from "@/src/components/category-card"
import { Button } from "@/components/ui/button"

export const BrowseCategoriesTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 12; // Number of categories to load per page

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
    fetchMore,
    networkStatus,
  } = useGetCategoriesQuery({
    variables: {
      first: categoriesPerPage,
      order: [{ title: SortEnumType.Asc }], // Default sort by title ascending
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleLoadMore = async () => {
    if (!categoriesData?.categories?.pageInfo.hasNextPage || networkStatus === 3) return;

    try {
      await fetchMore({
        variables: {
          after: categoriesData.categories.pageInfo.endCursor,
          first: categoriesPerPage,
          order: [{ title: SortEnumType.Asc }],
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.categories?.nodes) {
            return prev;
          }
          return {
            ...prev,
            categories: {
              ...fetchMoreResult.categories,
              nodes: [...(prev.categories?.nodes ?? []), ...(fetchMoreResult.categories.nodes)],
            },
          };
        },
      });
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("Error loading more categories:", error);
    }
  };

  const categories = categoriesData?.categories?.nodes || [];
  const hasNextPage = categoriesData?.categories?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  if (categoriesLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (categoriesError) {
    return <div className="text-red-500">Error loading categories: {categoriesError.message}</div>;
  }

  return (
    <div className="space-y-8">
      {categories.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No categories found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
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