"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Gift, X, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  useGetChatQuery,
  useGetChatMessagesQuery,
  useCreateMessageMutation,
  SortEnumType,
  ChatMessageDto,
} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatSectionProps {
  onCloseChat: () => void
  streamerId: string
}

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(500, "Message is too long"),
})

type MessageForm = z.infer<typeof messageSchema>

export function ChatSection({ onCloseChat, streamerId }: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null) // Для прокрутки к новым сообщениям (вниз)
  const chatContainerRef = useRef<HTMLDivElement>(null) // Для обнаружения прокрутки вверх (пагинация)

  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const initialLoadScrollDone = useRef(false) // Чтобы прокрутка к низу происходила только при первой загрузке

  const { data: chatData, loading: chatLoading } = useGetChatQuery({
    variables: { streamerId },
    skip: !streamerId,
  })

  const chatId = chatData?.chat.id

  const {
    data: messagesData,
    loading: messagesLoading,
    fetchMore,
    networkStatus, // Используем networkStatus для отслеживания состояния загрузки fetchMore
    refetch: refetchMessages, // Оставляем refetch для отправки новых сообщений
  } = useGetChatMessagesQuery({
    variables: {
      chatId: chatId!,
      last: 50, // Загружаем последние 50 сообщений
      order: [{ createdAt: SortEnumType.Desc }], // Сортируем по убыванию даты создания (новые сверху)
    },
    skip: !chatId,
    notifyOnNetworkStatusChange: true, // Важно для обновления networkStatus во время fetchMore
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

  // Эффект для обработки начальной загрузки сообщений и последующих перезагрузок (например, после отправки сообщения)
  useEffect(() => {
    if (messagesData?.chatMessages?.nodes) {
      // Apollo с `last` и `Desc` порядком означает, что nodes[0] — самое новое, nodes[N-1] — самое старое.
      // Для отображения в хронологическом порядке (старые сверху, новые снизу), мы переворачиваем массив.
      const newNodes = [...messagesData.chatMessages.nodes].reverse()
      setMessages(newNodes)
      setHasMoreMessages(messagesData.chatMessages.pageInfo.hasPreviousPage)

      // Прокрутка к низу только при самой первой загрузке
      if (!initialLoadScrollDone.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        initialLoadScrollDone.current = true
      }
    }
  }, [messagesData]) // Запускать только при изменении messagesData

  // Эффект для прокрутки к низу при добавлении новых сообщений (например, после отправки)
  // Это отдельный эффект от начальной загрузки для обеспечения плавной прокрутки для новых сообщений.
  useEffect(() => {
    if (initialLoadScrollDone.current && networkStatus === 7) { // networkStatus 7 означает "готово", указывая на успешную загрузку/перезагрузку
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length, networkStatus]) // Запускать при изменении количества сообщений и готовности сети

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
      // После отправки, перезагружаем, чтобы получить последние сообщения, включая новое.
      // Это вызовет useEffect выше для прокрутки к низу.
      refetchMessages()
    } catch (error) {
      console.error("Error sending message:", error)
      // Здесь можно добавить уведомление для пользователя об ошибке
    }
  }

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current
    // Проверяем, что прокрутка находится в самом верху, есть еще сообщения для загрузки,
    // и fetchMore не находится в процессе (networkStatus 3)
    if (container && container.scrollTop === 0 && hasMoreMessages && networkStatus !== 3) {
      const currentScrollHeight = container.scrollHeight

      fetchMore({
        variables: {
          before: messagesData?.chatMessages?.pageInfo.startCursor, // Используем startCursor для получения более старых сообщений
          last: 50,
          order: [{ createdAt: SortEnumType.Desc }],
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.chatMessages) return prev

          const newNodes = [...fetchMoreResult.chatMessages.nodes].reverse() // Переворачиваем новую порцию для сохранения хронологического порядка
          const updatedNodes = [...newNodes, ...prev.chatMessages.nodes!] // Добавляем новые сообщения в начало

          // Вычисляем корректировку прокрутки
          // Используем setTimeout, чтобы дать браузеру время отрисовать новые элементы перед корректировкой прокрутки
          setTimeout(() => {
            if (chatContainerRef.current) {
              const newScrollHeight = chatContainerRef.current.scrollHeight
              const scrollDifference = newScrollHeight - currentScrollHeight
              chatContainerRef.current.scrollTop += scrollDifference
            }
          }, 0)

          return {
            chatMessages: {
              ...fetchMoreResult.chatMessages, // Берем новую pageInfo (startCursor, hasPreviousPage) из fetchMoreResult
              nodes: updatedNodes,
              pageInfo: {
                ...fetchMoreResult.chatMessages.pageInfo,
                // Сохраняем оригинальный endCursor и hasNextPage из предыдущего состояния,
                // так как мы только загружаем более старые сообщения.
                endCursor: prev.chatMessages.pageInfo.endCursor,
                hasNextPage: prev.chatMessages.pageInfo.hasNextPage,
              },
            },
          }
        },
      }).then(result => {
        setHasMoreMessages(result.data.chatMessages.pageInfo.hasPreviousPage)
      }).catch(error => {
        console.error("Error fetching more messages:", error)
      })
    }
  }, [chatId, hasMoreMessages, messagesData, fetchMore, networkStatus]) // Зависимости для useCallback

  // Прикрепляем слушатель события прокрутки
  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll]) // Переприкрепляем, если handleScroll изменится

  const isLoadingMore = networkStatus === 3 // networkStatus 3 указывает, что fetchMore находится в процессе

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
            {isLoadingMore && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              </div>
            )}
            {messages.map((msg) => (
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
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Элемент для прокрутки */}
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