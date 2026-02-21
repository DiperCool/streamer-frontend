"use client";

import React from "react";
import {
  useAdminPayoutsQuery,
  SortEnumType,
  PayoutStatus,
} from "@/graphql/__generated__/graphql";
import { Loader2, User, CreditCard, Calendar } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 10;

interface AdminPayoutsTabProps {
  fromDate: string | undefined;
  toDate: string | undefined;
}

export const AdminPayoutsTab: React.FC<AdminPayoutsTabProps> = ({ fromDate, toDate }) => {
  const {
    data: payoutsData,
    loading: payoutsLoading,
    error: payoutsError,
    fetchMore,
    networkStatus,
  } = useAdminPayoutsQuery({
    variables: {
      first: ITEMS_PER_PAGE,
      order: [{ createdAt: SortEnumType.Desc }],
      fromDate,
      toDate,
    },
    notifyOnNetworkStatusChange: true,
  });

  const payouts = payoutsData?.adminPayouts?.nodes || [];
  const hasNextPage = payoutsData?.adminPayouts?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  const handleLoadMore = async () => {
    if (!hasNextPage || isLoadingMore) return;

    try {
      await fetchMore({
        variables: {
          after: payoutsData?.adminPayouts?.pageInfo.endCursor,
          first: ITEMS_PER_PAGE,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.adminPayouts?.nodes) {
            return prev;
          }
          return {
            ...prev,
            adminPayouts: {
              ...fetchMoreResult.adminPayouts,
              nodes: [...(prev.adminPayouts?.nodes ?? []), ...(fetchMoreResult.adminPayouts.nodes)],
            },
          };
        },
      });
    } catch (error) {
      console.error("Error loading more payouts:", error);
    }
  };

  const getStatusBadge = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.Paid:
        return <Badge className="bg-green-500/10 text-green-500 border-none hover:bg-green-500/20">Paid</Badge>;
      case PayoutStatus.Failed:
        return <Badge className="bg-red-500/10 text-red-500 border-none hover:bg-red-500/20">Failed</Badge>;
      case PayoutStatus.Pending:
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-none hover:bg-yellow-500/20">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (payoutsLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (payoutsError) {
    return <div className="text-red-500 p-4">Error loading payouts: {payoutsError.message}</div>;
  }

  return (
    <div>
        {payouts.length === 0 && !payoutsLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-2">
            <User className="h-12 w-12 opacity-20" />
            <p>No payouts found.</p>
          </div>
        ) : (
          <div className="rounded-md border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-900/50">
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-gray-300">Streamer</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id} className="border-gray-700 hover:bg-gray-700/30">
                    <TableCell>
                        <span className="font-medium text-white">
                          {payout.streamerId || "Unknown User"}
                        </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                        {payout.amount}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payout.status)}
                    </TableCell>
                    <TableCell className="text-gray-300 whitespace-nowrap">
                      {payout.createdAt ? format(new Date(payout.createdAt), "MMM dd, yyyy") : "N/A"}
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
    </div>
  );
};
