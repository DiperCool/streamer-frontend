"use client"

import React from "react"
import { useGetStreamersQuery, SortEnumType } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMinioUrl } from "@/utils/utils"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface SearchStreamersTabProps {
  searchQuery: string;
}

export const SearchStreamersTab: React.FC<SearchStreamersTabProps> = ({ searchQuery }) => {
  const { data, loading, error } = useGetStreamersQuery({
    variables: {
      search: searchQuery,
      first: 15, // Changed from 20 to 15
      order: [{ userName: SortEnumType.Asc }],
    },
    skip: !searchQuery,
  });

  const streamers = data?.streamers?.nodes || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading streamers: {error.message}</div>;
  }

  if (streamers.length === 0) {
    return <p className="text-gray-400 text-center py-10">No streamers found matching "{searchQuery}".</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {streamers.map((streamer) => (
        <Link key={streamer.id} href={`/${streamer.userName}`} passHref>
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
            <CardContent className="flex items-center p-4">
              <Avatar className="w-12 h-12 mr-4">
                <AvatarImage src={getMinioUrl(streamer.avatar!)} alt={streamer.userName || "Streamer"} />
                <AvatarFallback className="bg-green-600 text-white text-lg">
                  {streamer.userName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-white">{streamer.userName}</h3>
                <p className="text-sm text-gray-400">{streamer.followers} followers</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};