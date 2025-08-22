"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Gift, X, Loader2, ChevronUp, MessageSquareReply, MoreHorizontal } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    useGetChatQuery,
    useGetChatMessagesQuery,
    useCreateMessageMutation,
    useDeleteMessageMutation,
    SortEnumType,
    ChatMessageDto,
    useChatMessageCreatedSubscription,
    useChatMessageDeletedSubscription,
    GetChatMessagesQuery,
    GetChatMessagesDocument,
} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, isToday } from "date-fns"
import { useApolloClient } from "@apollo/client"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {cn} from "@/lib/utils";

interface ChatSectionProps {
  onCloseChat: () => void
  streamerId: string
}

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(500, "Message is too long"),
})

type MessageForm = z.infer<typeof messageSchema>
const messagesCount = 15;

export function ChatSection({ onCloseChat, streamerId }: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const client = useApolloClient();

  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false)
  const [replyToMessage, setReplyToMessage] = useState<ChatMessageDto | null>(null)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)

  const { data: chatData, loading: chatLoading } = useGetChatQuery({
    variables: { streamerId },
    skip: !streamerId,
  })

  const chatId = chatData?.chat.id

  const {
    data: messagesData,
    loading: messagesLoading,
    fetchMore,
    networkStatus,
    refetch,
  } = useGetChatMessagesQuery({
    variables: {
      chatId: chatId!,
      first: messagesCount,
      order: [{ createdAt: SortEnumType.Desc }],
    },
    skip: !chatId,
    notifyOnNetworkStatusChange: true,
  })

  const [createMessage, { loading: sendingMessage }] = useCreateMessageMutation()
  const [deleteMessageMutation] = useDeleteMessageMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  })

  // Эффект для обработки начальной загрузки сообщений и прокрутки
  useEffect(() => {
    if (messagesData?.chatMessages?.nodes && !initialMessagesLoaded) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
        setInitialMessagesLoaded(true)
      }, 0);
    }
  }, [messagesData, initialMessagesLoaded])

  // Эффект для вызова refetch при открытии чата
  useEffect(() => {
    if (chatId) {
      refetch();
      setInitialMessagesLoaded(false);
    }
  }, [chatId, refetch]);

  // Подписка на новые сообщения
  useChatMessageCreatedSubscription({
    variables: { chatId: chatId! },
    skip: !chatId,
    onData: ({ client, data }) => {
      const newMessage = data.data?.chatMessageCreated;
      if (newMessage) {
        client.cache.updateQuery(
          {
            query: GetChatMessagesDocument,
            variables: {
              chatId: chatId!,
              first: messagesCount,
              order: [{ createdAt: SortEnumType.Desc }],
            },
          },
          (prev) => {
            if (!prev || !prev.chatMessages) {
              return prev;
            }

            const existingMessage = prev.chatMessages.nodes?.find(
              (node) => node.id === newMessage.id
            );

            if (existingMessage) {
              return prev;
            }

            const newNode: ChatMessageDto = {
              __typename: 'ChatMessageDto',
              ...newMessage,
              sender: {
                __typename: 'StreamerDto',
                id: newMessage.sender?.id || '',
                userName: newMessage.sender?.userName || '',
                avatar: newMessage.sender?.avatar,
              },
              reply: newMessage.reply ? {
                __typename: 'ChatMessageDto',
                id: newMessage.reply.id,
                message: newMessage.reply.message,
                sender: newMessage.reply.sender ? {
                  __typename: 'StreamerDto',
                  userName: newMessage.reply.sender.userName,
                } : null,
              } : null,
            };

            const updatedNodes = [newNode, ...(prev.chatMessages.nodes || [])];
            const newEdge = {
              __typename: 'ChatMessagesEdge',
              cursor: btoa(newNode.createdAt.toString()),
              node: newNode,
            };
            const updatedEdges = [newEdge, ...(prev.chatMessages.edges || [])];

            return {
              ...prev,
              chatMessages: {
                ...prev.chatMessages,
                nodes: updatedNodes,
                edges: updatedEdges,
                pageInfo: {
                  ...prev.chatMessages.pageInfo,
                  startCursor: newEdge.cursor,
                  hasPreviousPage: true,
                },
              },
            };
          }
        );

        const container = chatContainerRef.current;
        const isAtBottom = container && (container.scrollHeight - container.scrollTop - container.clientHeight < 50);

        if (isAtBottom) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 0);
        }
      }
    },
  });

  // Подписка на удаленные сообщения
  useChatMessageDeletedSubscription({
    variables: { chatId: chatId! },
    skip: !chatId,
    onData: ({ client, data }) => {
      const deletedMessage = data.data?.chatMessageDeleted;
      if (deletedMessage) {
        client.cache.updateQuery(
          {
            query: GetChatMessagesDocument,
            variables: {
              chatId: chatId!,
              first: messagesCount,
              order: [{ createdAt: SortEnumType.Desc }],
            },
          },
          (prev) => {
            if (!prev || !prev.chatMessages?.nodes) {
              return prev;
            }
            const updatedNodes = prev.chatMessages.nodes.map(
              (node) => {
                // Case 1: The message itself is being deleted
                if (node.id === deletedMessage.id) {
                  return { ...node, isDeleted: true, message: "[deleted]" };
                }
                // Case 2: The message replies to the deleted message
                if (node.reply?.id === deletedMessage.id) {
                  return {
                    ...node,
                    reply: {
                      ...node.reply,
                      message: "[deleted]",
                    },
                  };
                }
                return node;
              }
            );
            const updatedEdges = prev.chatMessages.edges?.map(
              (edge) => {
                // Apply the same logic to the node within the edge
                const updatedNode = (() => {
                  if (edge.node.id === deletedMessage.id) {
                    return { ...edge.node, isDeleted: true, message: "[deleted]" };
                  }
                  if (edge.node.reply?.id === deletedMessage.id) {
                    return {
                      ...edge.node,
                      reply: {
                        ...edge.node.reply,
                        message: "[deleted]",
                      },
                    };
                  }
                  return edge.node;
                })();
                return { ...edge, node: updatedNode };
              }
            );

            return {
              ...prev,
              chatMessages: {
                ...prev.chatMessages,
                nodes: updatedNodes,
                edges: updatedEdges,
                pageInfo: {
                  ...prev.chatMessages.pageInfo,
                },
              },
            };
          }
        );
      }
    },
  });

  const onSubmit = async (values: MessageForm) => {
    if (!chatId) return
    try {
      await createMessage({
        variables: {
          request: {
            chatId,
            message: values.message,
            replyMessageId: replyToMessage?.id,
          },
        },
      })
      reset({ message: "" })
      setReplyToMessage(null)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessageMutation({
        variables: {
          request: {
            messageId: messageId,
          },
        },
      });
      // UI будет обновлен через подписку useChatMessageDeletedSubscription, которая напрямую изменяет кэш Apollo
    } catch (error) {
      console.error("Error deleting message:", error);
      // Здесь можно добавить уведомление для пользователя об ошибке
    }
  };

  const handleLoadMore = async () => {
    if (!chatId || !messagesData?.chatMessages?.pageInfo.hasNextPage || networkStatus === 3) return;

    const currentScrollHeight = chatContainerRef.current?.scrollHeight || 0;

    try {
      const result = await fetchMore({
        variables: {
          after: messagesData?.chatMessages?.pageInfo.endCursor,
          first: messagesCount,
          order: [{ createdAt: SortEnumType.Desc }],
        },
        updateQuery: (prev, { fetchMoreResult }): GetChatMessagesQuery => {
          if (!fetchMoreResult || !fetchMoreResult.chatMessages?.nodes) {
            return prev;
          }

          const newNodes = fetchMoreResult.chatMessages.nodes;
          const updatedNodes = [...(prev.chatMessages?.nodes ?? []), ...newNodes];

          setTimeout(() => {
            if (chatContainerRef.current) {
              const newScrollHeight = chatContainerRef.current.scrollHeight;
              const scrollDifference = newScrollHeight - currentScrollHeight;
              chatContainerRef.current.scrollTop += scrollDifference;
            }
          }, 0);
          
          return {
            ...prev,
            chatMessages: {
              __typename: prev.chatMessages?.__typename ?? "ChatMessagesConnection",
              ...fetchMoreResult.chatMessages,
              nodes: updatedNodes,
              pageInfo: {
                __typename: prev.chatMessages?.pageInfo.__typename ?? "PageInfo",
                ...fetchMoreResult.chatMessages.pageInfo,
                endCursor: fetchMoreResult.chatMessages.pageInfo.endCursor,
              },
            },
          };

        },
      });

    } catch (error) {
      console.error("Error fetching more messages:", error);
    }
  };

  const isLoadingMore = networkStatus === 3;

  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-white text-lg">Chat</CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onCloseChat}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar" ref={chatContainerRef}>
        {chatLoading || messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {messagesData?.chatMessages?.pageInfo.hasNextPage && (
              <div className="flex justify-center py-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            {messagesData?.chatMessages?.nodes?.slice().reverse().map((msg) => {
              const messageDate = new Date(msg.createdAt);
              const formattedTime = isToday(messageDate)
                ? format(messageDate, "HH:mm")
                : format(messageDate, "MMM dd, yyyy");

              const isMessageDeleted = msg.isDeleted;

              return (
                <ContextMenu key={msg.id}>
                  <ContextMenuTrigger asChild>
                    <div
                      className={cn(
                        "text-sm flex items-start space-x-2 p-1 rounded-md transition-colors duration-150 group relative",
                        isMessageDeleted ? "text-gray-500 italic" : "text-gray-300",
                        hoveredMessageId === msg.id && "bg-gray-700"
                      )}
                      onMouseEnter={() => setHoveredMessageId(msg.id)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={getMinioUrl(msg.sender?.avatar!)} alt={msg.sender?.userName || "User"} />
                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                          {msg.sender?.userName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        {msg.reply && ( // Всегда показываем блок ответа, но его контент может быть [deleted]
                          <div className="flex items-center text-xs text-gray-400 mb-1">
                            <MessageSquareReply className="h-3 w-3 mr-1" />
                            Replying to <span className="font-semibold ml-1">{msg.reply.sender?.userName}:</span>
                            <span className="ml-1 truncate max-w-[150px]">{msg.reply.message}</span>
                          </div>
                        )}
                        <span className="font-semibold text-green-400">{msg.sender?.userName}:</span>{" "}
                        <span>{isMessageDeleted ? "[deleted]" : msg.message}</span>
                        <span className="text-gray-500 text-xs ml-2">{formattedTime}</span>
                      </div>

                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "absolute top-1 right-1 h-6 w-6 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-1",
                                hoveredMessageId === msg.id ? "opacity-100 visible" : "opacity-0 invisible"
                              )}
                              onClick={(e) => e.stopPropagation()}
                              disabled={isMessageDeleted} // Отключаем кнопку для удаленных сообщений
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48 bg-gray-700 border-gray-600 text-white">
                            <DropdownMenuItem
                              onClick={() => setReplyToMessage(msg)}
                              className="hover:bg-green-600 hover:text-white cursor-pointer"
                              disabled={isMessageDeleted} // Отключаем для удаленных сообщений
                            >
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="hover:bg-red-600 hover:text-white cursor-pointer text-red-400"
                              disabled={isMessageDeleted} // Отключаем для удаленных сообщений
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48 bg-gray-700 border-gray-600 text-white">
                    <ContextMenuItem
                      onClick={() => setReplyToMessage(msg)}
                      className="hover:bg-green-600 hover:text-white cursor-pointer"
                      disabled={isMessageDeleted} // Отключаем для удаленных сообщений
                    >
                      Reply
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="hover:bg-red-600 hover:text-white cursor-pointer text-red-400"
                      disabled={isMessageDeleted} // Отключаем для удаленных сообщений
                    >
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>
      <div className="p-4 border-t border-gray-700 flex flex-col space-y-2">
        {replyToMessage && (
          <div className="flex items-center justify-between bg-gray-700 p-2 rounded-md text-sm text-gray-300">
            <div className="flex items-center">
              <MessageSquareReply className="h-4 w-4 mr-2" />
              Replying to <span className="font-semibold ml-1">{replyToMessage.sender?.userName}:</span>
              <span className="ml-1 truncate max-w-[150px]">{replyToMessage.message}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white"
              onClick={() => setReplyToMessage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Input
            {...register("message")}
            placeholder="Send a message"
            className="flex-1 bg-gray-700 border-gray-600 text-white focus:border-green-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(onSubmit)()
              }
            }}
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
            onClick={handleSubmit(onSubmit)}
            disabled={sendingMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {errors.message && (
        <p className="text-red-500 text-sm px-4 pb-2">{errors.message.message}</p>
      )}
    </Card>
  )
}