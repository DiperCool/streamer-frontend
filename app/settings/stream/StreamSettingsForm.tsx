"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function StreamSettingsForm() {
  const [showStreamUrl, setShowStreamUrl] = useState(false)
  const [showStreamKey, setShowStreamKey] = useState(false)
  const [streamUrl, setStreamUrl] = useState("rtmp://live.example.com/app") // Placeholder
  const [streamKey, setStreamKey] = useState("sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") // Placeholder

  const handleResetStreamKey = () => {
    // In a real application, this would trigger an API call to reset the key
    // For now, we'll just generate a new placeholder key
    const newKey = "sk_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setStreamKey(newKey);
    alert("Stream Key has been reset (placeholder action).");
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Stream URL and Key</h2>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Stream URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              id="stream-url"
              type={showStreamUrl ? "text" : "password"}
              value={streamUrl}
              readOnly
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500 pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-white"
              onClick={() => setShowStreamUrl(!showStreamUrl)}
            >
              {showStreamUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Stream Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex items-center">
            <Input
              id="stream-key"
              type={showStreamKey ? "text" : "password"}
              value={streamKey}
              readOnly
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500 pr-10 flex-grow"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-white"
              onClick={() => setShowStreamKey(!showStreamKey)}
            >
              {showStreamKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              className="ml-2 border-gray-600 text-gray-300 hover:bg-green-600 hover:text-white"
              onClick={handleResetStreamKey}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}