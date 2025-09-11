"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { SearchStreamersTab } from "@/src/components/search/search-streamers-tab"
import { SearchCategoriesTab } from "@/src/components/search/search-categories-tab"
import { Loader2 } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("streamers");
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  if (!searchQuery) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-400">
        <h1 className="text-3xl font-bold text-white mb-4">Search</h1>
        <p>Please enter a search query in the navigation bar to find streamers or categories.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Search Results for "{searchQuery}"</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-900 mb-8" currentValue={activeTab}>
          <TabsTrigger value="streamers">Streamers</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="streamers">
          <SearchStreamersTab searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="categories">
          <SearchCategoriesTab searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  )
}