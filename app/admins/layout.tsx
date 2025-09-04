"use client"

import React from "react"
import { useGetMySystemRoleQuery, SystemRoleType } from "@/graphql/__generated__/graphql"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data, loading, error } = useGetMySystemRoleQuery();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    )
  }

  if (error || data?.mySystemRole?.roleType !== SystemRoleType.Administrator) {
    console.error("Access denied or error fetching system role:", error?.message || "Not an administrator");
    redirect("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  )
}