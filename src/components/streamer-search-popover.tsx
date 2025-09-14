"use client";

import React, { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useSearchQuery, SearchResultType } from "@/graphql/__generated__/graphql";
import { useDebounce } from "@/hooks/use-debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMinioUrl } from "@/utils/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const StreamerSearchPopover: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, loading, error } = useSearchQuery({
    variables: {
      search: debouncedSearchTerm,
    },
    skip: !debouncedSearchTerm,
  });

  const results = data?.search || [];

  // Этот эффект контролирует, когда поповер *должен* быть открыт на основе наличия поискового запроса.
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setOpen(true);
    } else {
      // Закрываем, только если нет поискового запроса И поповер открыт
      if (open) {
        setOpen(false);
      }
    }
  }, [searchTerm, open]);

  // Эффект для явной установки фокуса на Input, когда поповер открыт.
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleResultClick = (result: { slug: string; resultType: SearchResultType }) => {
    setOpen(false); // Закрываем поповер
    setSearchTerm(""); // Очищаем поисковый запрос
    if (result.resultType === SearchResultType.Streamer) {
      router.push(`/${result.slug}`);
    } else if (result.resultType === SearchResultType.Category) {
      router.push(`/category/${result.slug}`);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      e.preventDefault();
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setOpen(false);
      setSearchTerm("");
      inputRef.current?.blur();
    }
  };

  const handleSearchIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Предотвращаем закрытие поповера, если он уже открыт
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setOpen(false);
      setSearchTerm("");
      inputRef.current?.blur();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Поле ввода теперь является триггером для Popover */}
        <div className="relative w-96">
          <Input
            ref={inputRef}
            placeholder="Search streamers and categories..."
            className="w-full bg-gray-800 border-gray-700 pl-3 pr-10 text-white placeholder:text-gray-400 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          {/* Иконка поиска внутри поля ввода, справа */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={handleSearchIconClick}
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 bg-gray-800 border-gray-700 text-white"
        onOpenAutoFocus={(e) => e.preventDefault()} // Предотвращаем автоматический фокус PopoverContent
      >
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
              {results.slice(0, 15).map((result) => (
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