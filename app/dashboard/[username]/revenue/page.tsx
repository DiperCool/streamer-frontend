"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PartnerOnboardingCard } from "@/src/components/revenue/partner-onboarding-card"
import { useDashboard } from "@/src/contexts/DashboardContext"
import {
  useGetStreamerSubscriptionsStatsQuery,
  usePayoutsQuery,
  SortEnumType,
  PayoutStatus,
} from "@/graphql/__generated__/graphql"
import { Loader2, TrendingUp, Users, DollarSign, Calendar } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function RevenuePage() {
  const { activeStreamer } = useDashboard()
  const streamerId = activeStreamer?.id

  const {
    data: statsData,
    loading: statsLoading,
  } = useGetStreamerSubscriptionsStatsQuery({
    variables: { streamerId: streamerId || "" },
    skip: !streamerId,
  })

  const {
    data: payoutsData,
    loading: payoutsLoading,
  } = usePayoutsQuery({
    variables: {
      streamerId: streamerId || "",
      first: 10,
      order: [{ createdAt: SortEnumType.Desc }],
    },
    skip: !streamerId,
  })

  const formatCurrency = (amount: number | string, currency: string = "USD") => {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(numericAmount)
  }

  const formatStatus = (status: string | PayoutStatus) => {
    if (!status) return "Pending"
    const s = status.toLowerCase()
    if (s.includes("paid")) return "Paid"
    if (s.includes("failed")) return "Failed"
    return "Pending"
  }

  if (!streamerId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    )
  }

  const stats = statsData?.streamerSubscriptionsStats
  const payouts = payoutsData?.payouts?.nodes || []

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-white">Revenue Overview</h1>
        <p className="text-gray-400">View your revenue statistics and earnings here.</p>
      </div>

      <PartnerOnboardingCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active Subscriptions
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : (
              <div className="text-2xl font-bold text-white">
                {stats?.activeSubscriptionsCount || 0}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Total active subscribers</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Estimated Future Payout
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            ) : (
              <div className="text-2xl font-bold text-white">
                {formatCurrency(stats?.futurePayoutAmount || 0)}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Pending next scheduled payout</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            Payout History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payoutsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
          ) : payouts.length > 0 ? (
            <div className="rounded-md border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-900/50">
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Arrival Date</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Payout ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => {
                    const statusText = formatStatus(payout.status)
                    const isPaid = statusText === "Paid"
                    const isFailed = statusText === "Failed"
                    
                    return (
                      <TableRow key={payout.id} className="border-gray-700 hover:bg-gray-700/30">
                        <TableCell className="text-gray-300 whitespace-nowrap">{formatDate(payout.createdAt)}</TableCell>
                        <TableCell className="text-gray-300 whitespace-nowrap">{formatDate(payout.arrivalDate)}</TableCell>
                        <TableCell className="text-white font-medium whitespace-nowrap">
                          {formatCurrency(payout.amount, payout.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {isFailed && payout.failureMessage ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span
                                    className="inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[11px] font-medium bg-red-500/10 text-red-500 cursor-help"
                                  >
                                    {statusText}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-800 border-gray-700 text-white max-w-[300px]">
                                  <p className="text-xs">{payout.failureMessage}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span
                                className={`
                                  inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[11px] font-medium
                                  ${isPaid ? "bg-green-500/10 text-green-500" : isFailed ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"}
                                `}
                              >
                                {statusText}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400 font-mono text-[10px]">
                          {payout.stripePayoutId}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-gray-500 space-y-2">
              <DollarSign className="h-10 w-10 opacity-20" />
              <p>No payout history found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
