"use client";

import React, { useState } from "react";
import {
  useSubscriptionsQuery,
  SortEnumType,
  SubscriptionStatus,
} from "@/graphql/__generated__/graphql";
import { useDashboard } from "@/src/contexts/DashboardContext";
import { Loader2, User, CreditCard, Calendar } from "lucide-react";
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

export const SubscriptionsTab: React.FC = () => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: subscriptionsData,
    loading: subscriptionsLoading,
    error: subscriptionsError,
    fetchMore,
    networkStatus,
  } = useSubscriptionsQuery({
    variables: {
      streamerId,
      first: ITEMS_PER_PAGE,
      order: [{ createdAt: SortEnumType.Desc }],
    },
    skip: !streamerId,
    notifyOnNetworkStatusChange: true,
  });

  const subscriptions = subscriptionsData?.subscriptions?.nodes || [];
  const hasNextPage = subscriptionsData?.subscriptions?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  const handleLoadMore = async () => {
    if (!hasNextPage || isLoadingMore) return;

    try {
      await fetchMore({
        variables: {
          after: subscriptionsData?.subscriptions?.pageInfo.endCursor,
          first: ITEMS_PER_PAGE,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.subscriptions?.nodes) {
            return prev;
          }
          return {
            ...prev,
            subscriptions: {
              ...fetchMoreResult.subscriptions,
              nodes: [...(prev.subscriptions?.nodes ?? []), ...(fetchMoreResult.subscriptions.nodes)],
            },
          };
        },
      });
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("Error loading more subscriptions:", error);
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.Active:
        return <Badge className="bg-green-500/10 text-green-500 border-none hover:bg-green-500/20">Active</Badge>;
      case SubscriptionStatus.Canceled:
        return <Badge className="bg-red-500/10 text-red-500 border-none hover:bg-red-500/20">Canceled</Badge>;
      case SubscriptionStatus.PastDue:
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-none hover:bg-yellow-500/20">Past Due</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!streamerId) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-400">
        Select a channel to view subscriptions.
      </div>
    );
  }

  if (subscriptionsLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (subscriptionsError) {
    return <div className="text-red-500 p-4">Error loading subscriptions: {subscriptionsError.message}</div>;
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-500" />
          Channel Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 && !subscriptionsLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-2">
            <User className="h-12 w-12 opacity-20" />
            <p>No subscriptions found for this channel.</p>
          </div>
        ) : (
          <div className="rounded-md border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-900/50">
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-gray-300">Subscriber</TableHead>
                  <TableHead className="text-gray-300">Plan</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Started At</TableHead>
                  <TableHead className="text-gray-300">Next Payout/Renewal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id} className="border-gray-700 hover:bg-gray-700/30">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={getMinioUrl(sub.user?.avatar!)} alt={sub.user?.userName || "User"} />
                          <AvatarFallback className="bg-gray-600 text-white text-xs">
                            {sub.user?.userName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-white">
                          {sub.user?.userName || "Unknown User"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{sub.title}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Subscription</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(sub.status)}
                    </TableCell>
                    <TableCell className="text-gray-300 whitespace-nowrap">
                      {sub.createdAt ? format(new Date(sub.createdAt), "MMM dd, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        {sub.currentPeriodEnd ? format(new Date(sub.currentPeriodEnd), "MMM dd, yyyy") : "N/A"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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