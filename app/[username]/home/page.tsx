"use client"

import React from "react"

export default function StreamerHomePage({ params }: { params: { username: string } }) {
  const { username } = params
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Home Content</h2>
      <p className="text-gray-400">This is the home section for {username}.</p>
    </div>
  )
}