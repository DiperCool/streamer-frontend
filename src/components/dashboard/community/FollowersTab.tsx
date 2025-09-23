"use client";

import React, { useState } from "react";
import {
  useGetMyFollowersQuery,
  SortEnumType,
} from "@/graphql/__generated__/graphql";
import { useDashboard } from "@/src/contexts/DashboardContext";
import { Loader2, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMinioUrl } from "@/utils/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 10;

export const FollowersTab: React.FC = () => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: followersData,
    loading: followersLoading,
    error: followersError,
    fetchMore,
    networkStatus,
  } = useGetMyFollowersQuery({
    variables: {
      first: ITEMS_PER_PAGE,
      order: [{ followedAt: SortEnumType.Desc }], // Sort by most recent followers
    },
    skip: !streamerId,
    notifyOnNetworkStatusChange: true,
  });

  const followers = followersData?.myFollowers?.nodes || [];
  const hasNextPage = followersData?.myFollowers?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  const handleLoadMore = async () => {
    if (!followersData?.myFollowers?.pageInfo.hasNextPage || isLoadingMore) return;

    try {
      await fetchMore({
        variables: {
          after: followersData.myFollowers.pageInfo.endCursor,
          first: ITEMS_PER_PAGE,
          order: [{ followedAt: SortEnumType.Desc }],
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.myFollowers?.nodes) {
            return prev;
          }
          return {
            ...prev,
            myFollowers: {
              ...fetchMoreResult.myFollowers,
              nodes: [...(prev.myFollowers?.nodes ?? []), ...(fetchMoreResult.myFollowers.nodes)],
            },
          };
        },
      });
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("Error loading more followers:", error);
    }
  };

  if (!streamerId) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-400">
        Select a channel to view followers.
      </div>
    );
  }

  if (followersLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (followersError) {
    return <div className="text-red-500">Error loading followers: {followersError.message}</div>;
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Your Followers</CardTitle>
      </CardHeader>
      <CardContent>
        {followers.length === 0 && !followersLoading ? (
          <p className="text-gray-400">No followers found yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Follower</TableHead>
                <TableHead className="text-gray-300">Followed At</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-right text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followers.map((follower) => (
                <TableRow key={follower.followerStreamerId} className="border-gray-700 hover:bg-gray-700">
                  <TableCell>
                    <Link href={`/${follower.followerStreamer?.userName}`} passHref className="flex items-center space-x-3 group">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={getMinioUrl(follower.followerStreamer?.avatar!)} alt={follower.followerStreamer?.userName || "Follower"} />
                        <AvatarFallback className="bg-gray-600 text-white text-sm">
                          {follower.followerStreamer?.userName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-white group-hover:text-green-400">
                        {follower.followerStreamer?.userName || "Unknown User"}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {follower.followedAt ? format(new Date(follower.followedAt), "MMM dd, yyyy HH:mm") : "N/A"}
                  </TableCell>
                  <TableCell>
                    {follower.followerStreamer?.isLive ? (
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
                    {/* Оборачиваем кнопку в Link для навигации */}
                    <Link href={`/${follower.followerStreamer?.userName}`} passHref>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        View Profile
                      </Button>
                    </Link>
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
  );
};