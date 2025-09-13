"use client"

import React, { useState } from "react"
import { format, isToday } from "date-fns"
import { MessageSquareReply, MoreHorizontal, X, Pin, UserX } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
}
from "@/components/ui/dropdown-menu"
import { ChatMessageDto } from "@/graphql/__generated__/graphql"
import { useDashboard } from "@/src/contexts/DashboardContext"
import { BanUserDialog } from "@/src/components/dashboard/chat/BanUserDialog"

interface MessageItemProps {
  message: ChatMessageDto
  onReply: (message: ChatMessageDto) => void
  onDelete: (messageId: string) => void
  onPin: (messageId: string) => void
  onUnpin: (chatId: string) => void
  isPinned: boolean
  currentHoveredMessageId: string | null
  onMouseEnter: (messageId: string) => void
  onMouseLeave: () => void
  chatId: string
  canManageChat: boolean;
  broadcasterId: string;
  refetchCurrentStreamerInteraction: () => Promise<any>;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onReply,
  onDelete,
  onPin,
  onUnpin,
  isPinned,
  currentHoveredMessageId,
  onMouseEnter,
  onMouseLeave,
  chatId,
  canManageChat,
  broadcasterId,
  refetchCurrentStreamerInteraction,
}) => {
  const { currentAuthUserStreamer } = useDashboard();
  const messageDate = new Date(message.createdAt)
  const formattedTime = isToday(messageDate)
    ? format(messageDate, "HH:mm")
    : format(messageDate, "MMM dd, yyyy")

  const isMessageDeleted = message.isDeleted
  const isHovered = currentHoveredMessageId === message.id
  const isOwnMessage = message.senderId === currentAuthUserStreamer?.id;

  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [userToBanId, setUserToBanId] = useState<string | null>(null);
  const [userToBanName, setUserToBanName] = useState<string | null>(null);

  const handleBanClick = (userId: string, userName: string) => {
    setUserToBanId(userId);
    setUserToBanName(userName);
    setIsBanDialogOpen(true);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "text-sm flex items-start space-x-2 p-1 rounded-md transition-colors duration-150 group relative",
              isMessageDeleted ? "text-gray-500 italic" : "text-gray-300",
              isHovered && "bg-gray-700"
            )}
            onMouseEnter={() => onMouseEnter(message.id)}
            onMouseLeave={onMouseLeave}
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={getMinioUrl(message.sender?.avatar!)} alt={message.sender?.userName || "User"} />
              <AvatarFallback className="bg-gray-600 text-white text-xs">
                {message.sender?.userName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {message.reply && (
                <div className="flex items-center text-xs text-gray-400 mb-1">
                  <MessageSquareReply className="h-3 w-3 mr-1" />
                  Replying to <span className="font-semibold ml-1">{message.reply.sender?.userName}:</span>
                  <span className={cn("ml-1 truncate max-w-[150px]", message.reply.isDeleted && "italic text-gray-500")}>
                    {message.reply.isDeleted ? "[deleted]" : message.reply.message}
                  </span>
                </div>
              )}
              <span className="font-semibold text-green-400">{message.sender?.userName}:</span>{" "}
              <span>{isMessageDeleted ? "[deleted]" : message.message}</span>
              <span className="text-gray-500 text-xs ml-2">{formattedTime}</span>
              {isPinned && (
                <Pin className="h-3 w-3 ml-1 inline-block text-blue-400" title="Pinned message" />
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute top-1 right-1 h-6 w-6 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-1",
                    isHovered ? "opacity-100 visible" : "opacity-0 invisible"
                  )}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isMessageDeleted}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-gray-700 border-gray-600 text-white">
                <DropdownMenuItem
                  onClick={() => onReply(message)}
                  className="hover:bg-green-600 hover:text-white cursor-pointer"
                  disabled={isMessageDeleted}
                >
                  <MessageSquareReply className="h-4 w-4 mr-2" /> Reply
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!isPinned ? (
                  <DropdownMenuItem
                    onClick={() => onPin(message.id)}
                    className="hover:bg-blue-600 hover:text-white cursor-pointer text-blue-400"
                    disabled={isMessageDeleted || !canManageChat}
                  >
                    <Pin className="h-4 w-4 mr-2" /> Pin Message
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onUnpin(chatId)}
                    className="hover:bg-blue-600 hover:text-white cursor-pointer text-blue-400"
                    disabled={!canManageChat}
                  >
                    <Pin className="h-4 w-4 mr-2" /> Unpin Message
                  </DropdownMenuItem>
                )}
                {canManageChat && message.sender && !isOwnMessage && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleBanClick(message.sender!.id, message.sender!.userName!)}
                      className="hover:bg-red-600 hover:text-white cursor-pointer text-red-400"
                      disabled={isMessageDeleted || !canManageChat}
                    >
                      <UserX className="h-4 w-4 mr-2" /> Ban User
                    </DropdownMenuItem>
                  </>
                )}
                {canManageChat && !isOwnMessage && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(message.id)}
                      className="hover:bg-red-600 hover:text-white cursor-pointer text-red-400"
                      disabled={isMessageDeleted || !canManageChat}
                    >
                      <X className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </>
                )}
                {isOwnMessage && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(message.id)}
                      className="hover:bg-red-600 hover:text-white cursor-pointer text-red-400"
                      disabled={isMessageDeleted}
                    >
                      <X className="h-4 w-4 mr-2" /> Delete My Message
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48 bg-gray-700 border-gray-600 text-white">
          <ContextMenuItem
            onClick={() => onReply(message)}
            className="hover:bg-green-600 hover:text-white cursor-pointer"
            disabled={isMessageDeleted}
          >
            <MessageSquareReply className="h-4 w-4 mr-2" /> Reply
          </ContextMenuItem>
          <ContextMenuSeparator />
          {!isPinned ? (
            <ContextMenuItem
              onClick={() => onPin(message.id)}
              className="hover:bg-blue-600 hover:text-white cursor-pointer text-blue-400"
              disabled={isMessageDeleted || !canManageChat}
            >
              <Pin className="h-4 w-4 mr-2" /> Pin Message
            </ContextMenuItem>
          ) : (
            <ContextMenuItem
              onClick={() => onUnpin(chatId)}
              className="hover:bg-blue-600 hover:text-white cursor-pointer text-blue-400"
              disabled={!canManageChat}
            >
              <Pin className="h-4 w-4 mr-2" /> Unpin Message
            </ContextMenuItem>
          )}
          {canManageChat && message.sender && !isOwnMessage && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => handleBanClick(message.sender!.id, message.sender!.userName!)}
                className="hover:bg-red-600 hover:text-white cursor-pointer text-red-400"
                disabled={isMessageDeleted || !canManageChat}
              >
                <UserX className="h-4 w-4 mr-2" /> Ban User
              </ContextMenuItem>
            </>
          )}
          {canManageChat && !isOwnMessage && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => onDelete(message.id)}
                className="hover:bg-red-600 hover:text-white cursor-pointer text-red-400"
                disabled={isMessageDeleted || !canManageChat}
              >
                <X className="h-4 w-4 mr-2" /> Delete
              </ContextMenuItem>
            </>
          )}
          {isOwnMessage && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => onDelete(message.id)}
                className="hover:bg-red-600 hover:text-white cursor-pointer text-red-400"
                disabled={isMessageDeleted}
              >
                <X className="h-4 w-4 mr-2" /> Delete My Message
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      {userToBanId && userToBanName && (
        <BanUserDialog
          isOpen={isBanDialogOpen}
          onOpenChange={setIsBanDialogOpen}
          userIdToBan={userToBanId}
          userNameToBan={userToBanName}
          broadcasterId={broadcasterId}
          refetchStreamerInteraction={refetchCurrentStreamerInteraction}
        />
      )}
    </>
  )
}