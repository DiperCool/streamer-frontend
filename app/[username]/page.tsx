"use client"

import React from "react"
import StreamerHomePage from "./home/page" // Import the existing Home page component

export default function StreamerRootProfilePage({ params }: { params: { username: string } }) {
  // This page will render the content of the "home" tab by default
  return <StreamerHomePage params={params} />
}