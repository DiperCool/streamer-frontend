"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useSearchQuery, SearchResultType } from "@/graphql/__generated__/graphql"; // Import useSearchQuery and SearchResultType
import { useDebounce } from "@/hooks/use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMinioUrl } from "@/utils/utils";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation"; // Import useRouter

interface StreamerSearchPopoverProps {
  children: React.ReactNode;
}

export const StreamerSearchPopover: React.FC<StreamerSearchPopoverProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data, loading, error } = useSearchQuery({
    variables: {
      search: debouncedSearchTerm,
    },
    skip: !debouncedSearchTerm, // Only fetch if there's a debounced search term
  });

  const results = data?.search || [];

  const handleResultClick = (result: { slug: string; resultType: SearchResultType }) => {
    setOpen(false); // Close popover
    setSearchTerm(""); // Clear search term
    if (result.resultType === SearchResultType.Streamer) {
      router.push(`/${result.slug}`);
    } else if (result.resultType === SearchResultType.Category) {
      router.push(`/category/${result.slug}`);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-800 border-gray-700 text-white">
        <div className="p-2 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search streamers and categories..."
              className="w-full bg-gray-700 border-gray-600 pl-10 text-white placeholder:text-gray-400 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-72">
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            </div>
          )}
          {error && (
            <div className="p-4 text-red-500">Error loading results: {error.message}</div>
          )}
          {!loading && !error && results.length === 0 && debouncedSearchTerm && (
            <div className="p-4 text-gray-400 text-center">No results found for "{debouncedSearchTerm}".</div>
          )}
          {!loading && !error && results.length === 0 && !debouncedSearchTerm && (
            <div className="p-4 text-gray-400 text-center">Start typing to search for streamers or categories.</div>
          )}
          {!loading && !error && results.length > 0 && (
            <div className="py-2">
              {results.slice(0, 15).map((result) => ( // Limit to 15 results
                <div
                  key={`${result.resultType}-${result.slug}`}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={getMinioUrl(result.image!)} alt={result.title || "Result"} />
                    <AvatarFallback className="bg-green-600 text-white text-sm">
                      {result.title.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-white font-medium">{result.title}</span>
                    <span className="text-gray-400 text-xs">
                      {result.resultType === SearchResultType.Streamer ? "Streamer" : "Category"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};