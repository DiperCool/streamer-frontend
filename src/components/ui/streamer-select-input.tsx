"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useGetStreamersQuery, SortEnumType } from "@/graphql/__generated__/graphql";
import { useDebounce } from "@/hooks/use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMinioUrl } from "@/utils/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StreamerSelectInputProps {
  value: string; // Displayed username (selected by parent)
  onValueChange: (username: string, streamerId: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const StreamerSelectInput: React.FC<StreamerSelectInputProps> = ({
  value,
  onValueChange,
  placeholder = "Search for a streamer...",
  disabled,
  className,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState(value); // What's currently in the search input
  const [open, setOpen] = useState(false);
  const [selectedStreamerAvatar, setSelectedStreamerAvatar] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search term for the GraphQL query
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch streamers based on the debounced search term
  const { data, loading, error: queryError } = useGetStreamersQuery({
    variables: {
      search: debouncedSearchTerm,
      order: [{ id: SortEnumType.Asc }],
    },
    skip: !debouncedSearchTerm,
  });
  const streamers = data?.streamers?.nodes || [];

  // Effect to synchronize the *displayed value in the trigger button* and its avatar
  // This runs when the `value` prop from the parent changes, or when `streamers` data changes.
  useEffect(() => {
    // Only update internal state from `value` prop if popover is closed
    // or if `value` is explicitly cleared by the parent.
    if (!open && value !== searchTerm) {
      setSearchTerm(value);
      const foundStreamer = streamers.find(s => s.userName === value);
      setSelectedStreamerAvatar(foundStreamer?.avatar || null);
    } else if (!value) { // If parent explicitly clears value, ensure internal states are cleared
        setSearchTerm("");
        setSelectedStreamerAvatar(null);
    }
  }, [value, open, searchTerm, streamers]);

  // Focus the input when the popover opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // When user types, if the input is different from the currently selected value,
    // immediately clear the parent's selected value. This prevents the `useEffect`
    // from resetting `searchTerm` back to the old `value` prop.
    if (value !== "" && newSearchTerm !== value) {
        onValueChange("", null); // Clear parent's selected value
        setSelectedStreamerAvatar(null); // Clear avatar in trigger
    }
    // If input is completely cleared, ensure parent's value is also cleared
    if (!newSearchTerm) {
        onValueChange("", null);
        setSelectedStreamerAvatar(null);
    }
  };

  const handleSelectStreamer = (streamerId: string, userName: string, avatar: string | null) => {
    setSearchTerm(userName); // Update internal search term to match selected name
    onValueChange(userName, streamerId); // Notify parent of new selection
    setSelectedStreamerAvatar(avatar); // Update internal avatar state
    setOpen(false); // Close popover
  };

  // The text to display in the trigger button
  const displayValue = value || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center space-x-2">
            {selectedStreamerAvatar && value ? ( // Only show avatar if a value is actually selected
              <Avatar className="w-6 h-6">
                <AvatarImage src={getMinioUrl(selectedStreamerAvatar)} alt={value || "Streamer"} />
                <AvatarFallback className="bg-green-600 text-white text-xs">
                  {value?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Search className="h-4 w-4 text-gray-400" />
            )}
            <span className="truncate">
              {displayValue}
            </span>
          </div>
          {open ? <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" /> : <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-800 border-gray-700 text-white">
        <div className="p-2 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              className="w-full bg-gray-700 border-gray-600 pl-10 text-white placeholder:text-gray-400 focus:border-green-500"
              value={searchTerm} // This is the user's current input
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        <ScrollArea className="h-72">
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            </div>
          )}
          {queryError && (
            <div className="p-4 text-red-500">Error loading streamers: {queryError.message}</div>
          )}
          {!loading && !queryError && streamers.length === 0 && debouncedSearchTerm && (
            <div className="p-4 text-gray-400 text-center">No streamers found.</div>
          )}
          {!loading && !queryError && streamers.length === 0 && !debouncedSearchTerm && (
            <div className="p-4 text-gray-400 text-center">Start typing to search for streamers.</div>
          )}
          {!loading && !queryError && streamers.length > 0 && (
            <div className="py-2">
              {streamers.map((streamer) => (
                <div
                  key={streamer.id}
                  onClick={() => handleSelectStreamer(streamer.id, streamer.userName!, streamer.avatar || null)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={getMinioUrl(streamer.avatar!)} alt={streamer.userName || "Streamer"} />
                    <AvatarFallback className="bg-green-600 text-white text-sm">
                      {streamer.userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">{streamer.userName}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};