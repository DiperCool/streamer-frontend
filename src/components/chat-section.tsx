"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Gift, Settings } from "lucide-react"

export function ChatSection() {
  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Placeholder for chat messages */}
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-green-400">User1:</span> Hello everyone!
        </div>
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-blue-400">User2:</span> Nice stream!
        </div>
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-yellow-400">User3:</span> What's up?
        </div>
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-green-400">User1:</span> This is a test message to fill space.
        </div>
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-blue-400">User2:</span> Hope it works!
        </div>
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-yellow-400">User3:</span> Looking good!
        </div>
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-green-400">User1:</span> Another message here.
        </div>
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-blue-400">User2:</span> Awesome!
        </div>
        <div className="text-gray-300 text-sm">
          <span className="font-semibold text-yellow-400">User3:</span> Keep up the great work!
        </div>
      </CardContent>
      <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
        <Input
          placeholder="Send a message"
          className="flex-1 bg-gray-700 border-gray-600 text-white focus:border-green-500"
        />
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Smile className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Gift className="h-5 w-5" />
        </Button>
        <Button variant="default" size="icon" className="bg-green-600 hover:bg-green-700 text-white">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  )
}