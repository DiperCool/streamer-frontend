"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table" // Import table components
import { useMySubscriptionsQuery } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import Image from "next/image" // Import Image component
import { getMinioUrl } from "@/utils/utils" // Import getMinioUrl
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const PAGE_SIZE = 15

export default function SubscriptionsPage() {
  const { data, loading, error, fetchMore } = useMySubscriptionsQuery({
    variables: {
      first: PAGE_SIZE,
    },
  })

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        first: PAGE_SIZE,
        after: data?.mySubscriptions?.pageInfo?.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.mySubscriptions) return prev;

        const newEdges = fetchMoreResult.mySubscriptions.edges || [];
        const newPageInfo = fetchMoreResult.mySubscriptions.pageInfo;

        if (!prev.mySubscriptions) {
          return {
            mySubscriptions: {
              ...fetchMoreResult.mySubscriptions,
              edges: newEdges,
              pageInfo: newPageInfo,
            },
          };
        }

        const oldEdges = prev.mySubscriptions.edges || [];

        return {
          mySubscriptions: {
            ...prev.mySubscriptions,
            edges: [...oldEdges, ...newEdges],
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
          <CardTitle>My Active Subscriptions</CardTitle>
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
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error loading subscriptions: {error.message}</p>
      </div>
    )
  }

  const subscriptions = data?.mySubscriptions?.edges
    ?.map((edge) => edge?.node)
    .filter(Boolean)
  const hasNextPage = data?.mySubscriptions?.pageInfo?.hasNextPage

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>My Active Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        {subscriptions && subscriptions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Streamer</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Ends</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="flex items-center">
                    {sub.streamer?.avatar && (
                      <Image
                        src={getMinioUrl(sub.streamer.avatar)} // Use getMinioUrl here
                        alt={sub.streamer.userName || "Streamer Avatar"}
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                      />
                    )}
                    {sub.streamer?.userName || "N/A"}
                  </TableCell>
                  <TableCell>{sub.title}</TableCell>
                  <TableCell>{sub.status}</TableCell>
                  <TableCell>
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>You don't have any active subscriptions yet.</p>
        )}
        {hasNextPage && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleLoadMore}
              disabled={loading}
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
