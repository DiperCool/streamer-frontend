"use client"

import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { useGetTagsQuery } from "@/graphql/__generated__/graphql" // Import useGetTagsQuery
import { BrowseStreamsTab } from "@/src/components/browse/browse-streams-tab" // New component
import { BrowseCategoriesTab } from "@/src/components/browse/browse-categories-tab" // New component

export default function BrowsePage() {
  const [activeTab, setActiveTab] = useState("streams");

  // Use getTags hook at the top level as requested
  const { data: tagsData, loading: tagsLoading, error: tagsError } = useGetTagsQuery();

  // You can decide how to display or use tagsData here.
  // For now, just fetching it to fulfill the request.
  if (tagsError) {
    console.error("Error loading tags:", tagsError.message);
  }

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Browse</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-900 mb-8" currentValue={activeTab}>
          <TabsTrigger value="streams">Streams</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="streams">
          <BrowseStreamsTab />
        </TabsContent>
        <TabsContent value="categories">
          <BrowseCategoriesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}