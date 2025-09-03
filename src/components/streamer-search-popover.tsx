"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useGetStreamersQuery, SortEnumType } from "@/graphql/__generated__/graphql"; // Import SortEnumType
import { useDebounce } from "@/hooks/use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMinioUrl } from "@/utils/utils";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StreamerSearchPopoverProps {
  children: React.ReactNode;
}

export const StreamerSearchPopover: React.FC<StreamerSearchPopoverProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce for 500ms
  const [open, setOpen] = useState(false);

  const { data, loading, error } = useGetStreamersQuery({
    variables: {
      search: debouncedSearchTerm,
      order: [{ id: SortEnumType.Asc }], // Added orderBy id
    },
    skip: !debouncedSearchTerm, // Only fetch if there's a debounced search term
  });

  const streamers = data?.streamers?.nodes || [];

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
              placeholder="Search streamers..."
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
            <div className="p-4 text-red-500">Error loading streamers: {error.message}</div>
          )}
          {!loading && !error && streamers.length === 0 && debouncedSearchTerm && (
            <div className="p-4 text-gray-400 text-center">No streamers found.</div>
          )}
          {!loading && !error && streamers.length === 0 && !debouncedSearchTerm && (
            <div className="p-4 text-gray-400 text-center">Start typing to search for streamers.</div>
          )}
          {!loading && !error && streamers.length > 0 && (
            <div className="py-2">
              {streamers.map((streamer) => (
                <Link
                  key={streamer.id}
                  href={`/${streamer.userName}`}
                  passHref
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-700 cursor-pointer transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={getMinioUrl(streamer.avatar!)} alt={streamer.userName || "Streamer"} />
                      <AvatarFallback className="bg-green-600 text-white text-sm">
                        {streamer.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium">{streamer.userName}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};