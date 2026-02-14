"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const getActiveTab = () => {
    if (pathname.includes("/transactions/subscriptions")) {
      return "subscriptions"
    }
    if (pathname.includes("/transactions/payment-history")) {
      return "payment-history"
    }
    return "subscriptions" // Default tab
  }

  const activeTab = getActiveTab()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} className="w-full">
          <TabsList className="bg-gray-900 mb-8" currentValue={activeTab}>
            <Link href="/transactions/subscriptions" passHref>
              <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
            </Link>
            <Link href="/transactions/payment-history" passHref>
              <TabsTrigger value="payment-history">Payment History</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
        {children}
      </div>
    </div>
  )
}
