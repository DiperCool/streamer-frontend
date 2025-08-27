"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { format, isToday } from "date-fns"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, MessageSquareReply, Pin } from "lucide-react"
import { cn } from "@/lib/utils"
import { VariableSizeList } from 'react-window';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMinioUrl } from "@/utils/utils"

interface VodChatSectionProps {
  onCloseChat?: () => void; // Optional close handler
}

// Static message data for demonstration
const staticMessages = [
  { id: "1", sender: "User1", message: "Hello everyone!", time: "10:00", avatar: "/placeholder-user.jpg" },
  { id: "2", sender: "User2", message: "Welcome to the VOD!", time: "10:01", avatar: "/placeholder-user.jpg" },
  { id: "3", sender: "User1", message: "This is a static chat for demonstration purposes.", time: "10:02", avatar: "/placeholder-user.jpg" },
  { id: "4", sender: "User3", message: "No live interaction here.", time: "10:03", avatar: "/placeholder-user.jpg" },
  { id: "5", sender: "User2", message: "Just a placeholder.", time: "10:04", avatar: "/placeholder-user.jpg" },
  { id: "6", sender: "User4", message: "Enjoy the video! This message is a bit longer to test how it wraps within the chat window. It should demonstrate multi-line handling effectively.", time: "10:05", avatar: "/placeholder-user.jpg" },
  { id: "7", sender: "User1", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", time: "10:06", avatar: "/placeholder-user.jpg" },
  { id: "8", sender: "User5", message: "Very long message to test scrolling and height calculation. This message should definitely take up more than one line to ensure the VariableSizeList handles it correctly. We need enough text to wrap and show the dynamic height adjustment. This is a crucial test for the layout.", time: "10:07", avatar: "/placeholder-user.jpg" },
  { id: "9", sender: "User6", message: "Another message.", time: "10:08", avatar: "/placeholder-user.jpg" },
  { id: "10", sender: "User1", message: "Short one.", time: "10:09", avatar: "/placeholder-user.jpg" },
];

const MESSAGE_ITEM_BASE_HEIGHT = 50; // Base height for a short message
const LONG_MESSAGE_TEXT_THRESHOLD = 50; // Characters before considering it a long message
const LONG_MESSAGE_HEIGHT_PER_LINE = 18; // Additional height per extra line

const getItemSize = (index: number) => {
  const message = staticMessages[index];
  if (!message) return MESSAGE_ITEM_BASE_HEIGHT;

  let height = MESSAGE_ITEM_BASE_HEIGHT;
  if (message.message.length > LONG_MESSAGE_TEXT_THRESHOLD) {
    const extraLines = Math.ceil((message.message.length - LONG_MESSAGE_TEXT_THRESHOLD) / 30); // Approx 30 chars per line
    height += extraLines * LONG_MESSAGE_HEIGHT_PER_LINE;
  }
  return height;
};

const Row = React.memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
  const message = staticMessages[index];
  if (!message) return null;

  return (
    <div style={style} className="flex items-start space-x-2 p-1 text-sm text-gray-300">
      <Avatar className="w-6 h-6">
        <AvatarImage src={getMinioUrl(message.avatar)} alt={message.sender} />
        <AvatarFallback className="bg-gray-600 text-white text-xs">
          {message.sender.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <span className="font-semibold text-green-400">{message.sender}:</span>{" "}
        <span>{message.message}</span>
        <span className="text-gray-500 text-xs ml-2">{message.time}</span>
      </div>
    </div>
  );
});

export function VodChatSection({ onCloseChat }: VodChatSectionProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);
  const [listHeight, setListHeight] = useState(0);
  const [listWidth, setListWidth] = useState(0);

  // ResizeObserver to get dynamic height/width for VariableSizeList
  useEffect(() => {
    const currentRef = chatContainerRef.current;
    if (!currentRef) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === currentRef) {
          setListHeight(entry.contentRect.height);
          setListWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(currentRef);

    return () => {
      resizeObserver.unobserve(currentRef);
    };
  }, []);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (staticMessages.length > 0 && listRef.current) {
      const timer = setTimeout(() => {
        listRef.current?.scrollToItem(staticMessages.length - 1, "end");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [listHeight, listWidth]); // Re-scroll if container size changes

  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col relative">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-white text-lg">Chat Replay</CardTitle> {/* Изменено на "Chat Replay" */}
        {onCloseChat && (
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onCloseChat}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>

      <div className="flex-1 overflow-hidden" ref={chatContainerRef}>
        {listHeight > 0 && listWidth > 0 && staticMessages.length > 0 ? (
          <VariableSizeList
            ref={listRef}
            height={listHeight}
            width={listWidth}
            itemCount={staticMessages.length}
            itemSize={getItemSize}
            estimatedItemSize={MESSAGE_ITEM_BASE_HEIGHT}
            className="custom-scrollbar"
          >
            {Row}
          </VariableSizeList>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No messages available for this VOD.
          </div>
        )}
      </div>

      {/* Input Area - Removed for static VOD chat */}
      {/* <div className="p-4 border-t border-gray-700 flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
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
          <Button
            variant="default"
            size="icon"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div> */}
    </Card>
  );
}