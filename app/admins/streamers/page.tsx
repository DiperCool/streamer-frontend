"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, User } from "lucide-react"
import {
  useGetStreamersQuery,
  SortEnumType,
} from "@/graphql/__generated__/graphql"
import { useDebounce } from "@/hooks/use-debounce"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMinioUrl } from "@/utils/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const ITEMS_PER_PAGE = 10;

export default function AdminStreamersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: streamersData,
    loading: streamersLoading,
    error: streamersError,
    fetchMore,
    networkStatus,
  } = useGetStreamersQuery({
    variables: {
      first: ITEMS_PER_PAGE,
      search: debouncedSearchTerm,
      order: [{ userName: SortEnumType.Asc }], // Default sort by username ascending
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleLoadMore = async () => {
    if (!streamersData?.streamers?.pageInfo.hasNextPage || networkStatus === 3) return;

    try {
      await fetchMore({
        variables: {
          after: streamersData.streamers.pageInfo.endCursor,
          first: ITEMS_PER_PAGE,
          search: debouncedSearchTerm,
          order: [{ userName: SortEnumType.Asc }],
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.streamers?.nodes) {
            return prev;
          }
          return {
            ...prev,
            streamers: {
              ...fetchMoreResult.streamers,
              nodes: [...(prev.streamers?.nodes ?? []), ...(fetchMoreResult.streamers.nodes)],
            },
          };
        },
      });
    } catch (error) {
      console.error("Error loading more streamers:", error);
      // Optionally show a toast notification for error
    }
  };

  const streamers = streamersData?.streamers?.nodes || [];
  const hasNextPage = streamersData?.streamers?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  if (streamersLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (streamersError) {
    return <div className="text-red-500">Error loading streamers: {streamersError.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Streamers Management</h2>
        {/* Кнопка для создания нового стримера может быть добавлена здесь, если потребуется */}
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Streamers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search streamers..."
              className="w-full bg-gray-700 border-gray-600 pl-10 text-white placeholder:text-gray-400 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {streamers.length === 0 && !streamersLoading ? (
            <p className="text-gray-400">No streamers found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Avatar</TableHead>
                  <TableHead className="text-gray-300">Username</TableHead>
                  <TableHead className="text-gray-300">Followers</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {streamers.map((streamer) => (
                  <TableRow key={streamer.id} className="border-gray-700 hover:bg-gray-700">
                    <TableCell>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={getMinioUrl(streamer.avatar!)} alt={streamer.userName || "Streamer"} />
                        <AvatarFallback className="bg-gray-600 text-white text-sm">
                          {streamer.userName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      <Link href={`/${streamer.userName}`} passHref className="hover:text-green-400">
                        {streamer.userName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-300">{streamer.followers}</TableCell>
                    <TableCell>
                      {streamer.isLive ? (
                        <Badge className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                          LIVE
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                          OFFLINE
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/${streamer.userName}`} passHref>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            View Profile
                          </Button>
                        </Link>
                        {/* Кнопки редактирования/удаления могут быть добавлены здесь */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        </CardContent>
      </Card>
    </div>
  );
}