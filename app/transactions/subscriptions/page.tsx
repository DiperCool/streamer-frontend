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

export default function SubscriptionsPage() {
  const { data, loading, error } = useMySubscriptionsQuery()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
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
      </CardContent>
    </Card>
  )
}
