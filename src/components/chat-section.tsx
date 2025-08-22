"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Gift, X, Loader2, ChevronUp } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    useGetChatQuery,
    useGetChatMessagesQuery,
    useCreateMessageMutation,
    SortEnumType,
    ChatMessageDto,
    useChatMessageCreatedSubscription,
    GetChatMessagesQuery,
    GetChatMessagesDocument,
} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, isToday } from "date-fns"
import { useApolloClient } from "@apollo/client"

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

  // Эффект для обработки начальной загрузки сообщений
  useEffect(() => {
    if (messagesData?.chatMessages?.nodes && !initialMessagesLoaded) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        setInitialMessagesLoaded(true)
      }, 0);
    }
  }, [messagesData, initialMessagesLoaded])

  // Подписка на новые сообщения
  useChatMessageCreatedSubscription({
    variables: { chatId: chatId! },
    skip: !chatId,
    onData: ({ client, data }) => {
      const newMessage = data.data?.chatMessageCreated;
      if (newMessage) {
        // Обновляем кеш Apollo
        client.cache.updateQuery(
          {
            query: GetChatMessagesDocument,
            variables: {
              chatId: chatId!,
              first: messagesCount, // ИСПРАВЛЕНО: Теперь соответствует основному запросу
              order: [{ createdAt: SortEnumType.Desc }],
            },
          },
          (prev) => {
            if (!prev || !prev.chatMessages) {
              return prev;
            }

            // Проверяем, существует ли уже это сообщение в кеше, чтобы избежать дублирования
            const existingMessage = prev.chatMessages.nodes?.find(
              (node) => node.id === newMessage.id
            );

            if (existingMessage) {
              return prev; // Если сообщение уже есть, возвращаем предыдущее состояние без изменений
            }

            // Создаем новый узел сообщения с необходимыми __typename
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

            // Добавляем новое сообщение в НАЧАЛО списка существующих сообщений в кеше.
            // Это сохраняет порядок "новые сверху" в кеше, так как сервер отдает сообщения DESC.
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
                  startCursor: newEdge.cursor, // Обновляем startCursor на курсор нового сообщения
                  hasPreviousPage: true, // Теперь всегда есть предыдущие, если добавили
                },
              },
            };
          }
        );

        // Прокручиваем вниз, если пользователь находится внизу чата
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

  const onSubmit = async (values: MessageForm) => {
    if (!chatId) return
    try {
      await createMessage({
        variables: {
          request: {
            chatId,
            message: values.message,
          },
        },
      })
      reset({ message: "" })
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

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

                    const newNodes = fetchMoreResult.chatMessages.nodes; // Эти сообщения старше
                    const updatedNodes = [...(prev.chatMessages?.nodes ?? []), ...newNodes]; // Добавляем старые в конец

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
                                // endCursor должен быть курсором самого старого сообщения в updatedNodes
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
            {messagesData.chatMessages.pageInfo.hasNextPage && (
              <div className="flex justify-center py-2">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ChevronUp className="h-4 w-4 mr-2" />
                  )}
                  {isLoadingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
            {/* Отображаем сообщения в обратном порядке, чтобы новые были внизу */}
            {messagesData?.chatMessages?.nodes?.slice().reverse().map((msg) => {
              const messageDate = new Date(msg.createdAt);
              const formattedTime = isToday(messageDate)
                ? format(messageDate, "HH:mm")
                : format(messageDate, "MMM dd, yyyy");

              return (
                <div key={msg.id} className="text-gray-300 text-sm flex items-start space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={getMinioUrl(msg.sender?.avatar!)} alt={msg.sender?.userName || "User"} />
                    <AvatarFallback className="bg-gray-600 text-white text-xs">
                      {msg.sender?.userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold text-green-400">{msg.sender?.userName}:</span>{" "}
                    <span>{msg.message}</span>
                    <span className="text-gray-500 text-xs ml-2">{formattedTime}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>
      <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
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
      {errors.message && (
        <p className="text-red-500 text-sm px-4 pb-2">{errors.message.message}</p>
      )}
    </Card>
  )
}