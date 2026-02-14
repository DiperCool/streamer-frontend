"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TransactionsRootPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/transactions/subscriptions")
  }, [router])

  return null
}
