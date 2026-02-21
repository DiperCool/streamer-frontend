"use client";

import React, { useState } from "react";
import {
  useAdminTransactionsQuery,
  SortEnumType,
  TransactionStatus,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMinioUrl } from "@/utils/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 10;

interface AdminTransactionsTabProps {
  fromDate: string | undefined;
  toDate: string | undefined;
}

export const AdminTransactionsTab: React.FC<AdminTransactionsTabProps> = ({ fromDate, toDate }) => {
  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
    fetchMore,
    networkStatus,
  } = useAdminTransactionsQuery({
    variables: {
      first: ITEMS_PER_PAGE,
      order: [{ createdAt: SortEnumType.Desc }],
      fromDate,
      toDate,
    },
    notifyOnNetworkStatusChange: true,
  });

  const transactions = transactionsData?.adminTransactions?.nodes || [];
  const hasNextPage = transactionsData?.adminTransactions?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  const handleLoadMore = async () => {
    if (!hasNextPage || isLoadingMore) return;

    try {
      await fetchMore({
        variables: {
          after: transactionsData?.adminTransactions?.pageInfo.endCursor,
          first: ITEMS_PER_PAGE,
          fromDate,
          toDate,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.adminTransactions?.nodes) {
            return prev;
          }
          return {
            ...prev,
            adminTransactions: {
              ...fetchMoreResult.adminTransactions,
              nodes: [...(prev.adminTransactions?.nodes ?? []), ...(fetchMoreResult.adminTransactions.nodes)],
            },
          };
        },
      });
    } catch (error) {
      console.error("Error loading more transactions:", error);
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.Succeeded:
        return <Badge className="bg-green-500/10 text-green-500 border-none hover:bg-green-500/20">Succeeded</Badge>;
      case TransactionStatus.Failed:
        return <Badge className="bg-red-500/10 text-red-500 border-none hover:bg-red-500/20">Failed</Badge>;
      case TransactionStatus.Pending:
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-none hover:bg-yellow-500/20">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (transactionsLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (transactionsError) {
    return <div className="text-red-500 p-4">Error loading transactions: {transactionsError.message}</div>;
  }

  return (
    <div>
        {transactions.length === 0 && !transactionsLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-2">
            <User className="h-12 w-12 opacity-20" />
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="rounded-md border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-900/50">
                <TableRow className="border-gray-700 hover:bg-transparent">
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Streamer</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-gray-700 hover:bg-gray-700/30">
                    <TableCell>
                        <span className="font-medium text-white">
                          {tx.userId || "Unknown User"}
                        </span>
                    </TableCell>
                    <TableCell>
                        <span className="font-medium text-white">
                          {tx.streamerId || "Unknown User"}
                        </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                        {tx.grossAmount}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(tx.status)}
                    </TableCell>
                    <TableCell className="text-gray-300 whitespace-nowrap">
                      {tx.createdAt ? format(new Date(tx.createdAt), "MMM dd, yyyy") : "N/A"}
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
