"use client"

import { useAuth0 } from "@auth0/auth0-react"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Streamer</h1>
      <p className="text-gray-400">This is the home page.</p>
    </div>
  )
}
