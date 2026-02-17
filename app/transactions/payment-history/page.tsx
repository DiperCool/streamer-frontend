"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@apollo/client"
import { GET_MY_TRANSACTIONS } from "@/graphql/transactions/transactionsQueries"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown, Loader2 } from "lucide-react"

// Define enums locally as codegen was skipped
enum SortEnumType {
  Asc = "ASC",
  Desc = "DESC",
}

enum TransactionStatus {
  Failed = "FAILED",
  Pending = "PENDING",
  Refunded = "REFUNDED",
  Succeeded = "SUCCEEDED",
}

enum TransactionType {
  Subscription = "SUBSCRIPTION",
}

const PAGE_SIZE = 15

export default function PaymentHistoryPage() {
  const [sortOrder, setSortOrder] = useState<SortEnumType>(SortEnumType.Desc)
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | "all">(
    "all"
  )
  const [filterType, setFilterType] = useState<TransactionType | "all">("all")

  const { data, loading, error, fetchMore } = useQuery(GET_MY_TRANSACTIONS, {
    variables: {
      first: PAGE_SIZE, // Fetch the initial number of transactions
      order: [{ createdAt: sortOrder }],
      where: {
        ...(filterStatus !== "all" && {
          status: { eq: filterStatus },
        }),
        ...(filterType !== "all" && {
          transactionType: { eq: filterType },
        }),
      },
    },
    // This function will be called to merge new data with existing data
    // when fetchMore is called.
    // It's important to merge the 'nodes' and update 'pageInfo' correctly.
    onCompleted: (data) => {
      // Assuming `myTransactions` returns a connection, merge the `nodes`
      // and update the `pageInfo`
      if (data?.myTransactions?.nodes) {
        // You might need a more sophisticated merge strategy depending on your pagination
        // and how Apollo Client manages its cache.
        // For simplicity, this example just replaces the nodes.
      }
    },
  })

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) =>
      prevOrder === SortEnumType.Desc ? SortEnumType.Asc : SortEnumType.Desc
    )
  }

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        first: PAGE_SIZE,
        after: data?.myTransactions?.pageInfo?.endCursor,
        order: [{ createdAt: sortOrder }],
        where: {
          ...(filterStatus !== "all" && {
            status: { eq: filterStatus },
          }),
          ...(filterType !== "all" && {
            transactionType: { eq: filterType },
          }),
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.myTransactions) return prev;

        const newNodes = fetchMoreResult.myTransactions.nodes || [];
        const newPageInfo = fetchMoreResult.myTransactions.pageInfo;

        if (!prev.myTransactions) {
          return {
            myTransactions: {
              ...fetchMoreResult.myTransactions,
              nodes: newNodes,
              pageInfo: newPageInfo,
            },
          };
        }

        const oldNodes = prev.myTransactions.nodes || [];

        return {
          myTransactions: {
            ...prev.myTransactions,
            nodes: [...oldNodes, ...newNodes],
            pageInfo: newPageInfo,
          },
        };
      },
    })
  }

  if (loading && !data) { // Show full skeleton only on initial load
    return (
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  const transactions = data?.myTransactions?.nodes || []
  const hasNextPage = data?.myTransactions?.pageInfo?.hasNextPage

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <Button
            variant="outline"
            onClick={toggleSortOrder}
            className="text-gray-400 border-gray-600 hover:bg-gray-700"
          >
            Date {sortOrder === SortEnumType.Desc ? "↓" : "↑"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>

          <Select
            onValueChange={(value: TransactionStatus | "all") =>
              setFilterStatus(value)
            }
            value={filterStatus}
          >
            <SelectTrigger className="w-[180px] text-gray-400 border-gray-600 bg-gray-800 hover:bg-gray-700">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(TransactionStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value: TransactionType | "all") =>
              setFilterType(value)
            }
            value={filterType}
          >
            <SelectTrigger className="w-[180px] text-gray-400 border-gray-600 bg-gray-800 hover:bg-gray-700">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(TransactionType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {transactions.length === 0 ? (
          <p>No payment history found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Streamer</TableHead>
                <TableHead className="text-gray-400">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction: any) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.createdAt), "PPP")}
                  </TableCell>
                  <TableCell>${transaction.grossAmount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                  <TableCell>{transaction.transactionType}</TableCell>
                  <TableCell>{transaction.streamer?.userName}</TableCell>
                  <TableCell>
                    {transaction.stripeInvoiceUrl ? (
                      <a
                        href={transaction.stripeInvoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleLoadMore}
              disabled={loading} // Disable button while loading more
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
