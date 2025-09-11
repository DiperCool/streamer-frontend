"use client"

import React from "react"
import { useGetCategoriesQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { CategoryCard } from "@/src/components/category-card"

interface SearchCategoriesTabProps {
  searchQuery: string;
}

export const SearchCategoriesTab: React.FC<SearchCategoriesTabProps> = ({ searchQuery }) => {
  const { data, loading, error } = useGetCategoriesQuery({
    variables: {
      search: searchQuery,
      first: 20, // Limit to 20 results for search page
      order: [{ title: SortEnumType.Asc }],
    },
    skip: !searchQuery,
  });

  const categories = data?.categories?.nodes || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading categories: {error.message}</div>;
  }

  if (categories.length === 0) {
    return <p className="text-gray-400 text-center py-10">No categories found matching "{searchQuery}".</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};