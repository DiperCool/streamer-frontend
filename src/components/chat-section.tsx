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
  useChatMessageCreatedSubscription, // Импортируем хук подписки
} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, isToday } from "date-fns"

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
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false) // Новый стейт для отслеживания первой загрузки

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
  } = useGetChatMessagesQuery({
    variables: {
      chatId: chatId!,
      first: 50, // Изменено на 'first: 50' как запрошено
      order: [{ createdAt: SortEnumType.Desc }], // Сервер возвращает новые сообщения сверху
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

  // Эффект для обработки начальной загрузки сообщений
  useEffect(() => {
    if (messagesData?.chatMessages?.nodes && !initialMessagesLoaded) {
      // Сервер возвращает сообщения от новых к старым.
      // Для отображения в хронологическом порядке (старые сверху, новые снизу), мы переворачиваем массив.
      const newNodes = [...messagesData.chatMessages.nodes].reverse()
      setMessages(newNodes)
      setHasMoreMessages(messagesData.chatMessages.pageInfo.hasPreviousPage)

      // Прокрутка к низу только при самой первой загрузке
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        setInitialMessagesLoaded(true) // Отмечаем, что начальная загрузка завершена
      }, 0);
    }
  }, [messagesData, initialMessagesLoaded]) // Запускать только при изменении messagesData или initialMessagesLoaded

  // Подписка на новые сообщения
  useChatMessageCreatedSubscription({
    variables: { chatId: chatId! },
    skip: !chatId,
    onData: ({ data }) => {
      const newMessage = data.data?.chatMessageCreated;
      if (newMessage) {
        setMessages(prevMessages => {
          // Проверяем, чтобы избежать дубликатов, если сообщение уже было добавлено
          if (prevMessages.some(msg => msg.id === newMessage.id)) {
            return prevMessages;
          }
          return [...prevMessages, newMessage]; // Добавляем новое сообщение в конец
        });

        // Прокрутка к низу, если пользователь уже был внизу или отправил сообщение
        const container = chatContainerRef.current;
        // Проверяем, находится ли пользователь в пределах 50px от нижней границы
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
      // Новое сообщение будет добавлено через подписку, нет необходимости перезагружать здесь.
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
          last: 50, // Используем 'last' с 'before' для получения предыдущих 50 сообщений
          order: [{ createdAt: SortEnumType.Desc }], // Сервер возвращает новые сообщения сверху
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.chatMessages) return prev

          // Переворачиваем новую порцию сообщений, чтобы они были от старых к новым
          const newNodes = [...fetchMoreResult.chatMessages.nodes].reverse()
          // Добавляем новые (более старые) сообщения в начало существующего списка
          const updatedNodes = [...newNodes, ...prev.chatMessages.nodes!]

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
            {messages.map((msg) => {
              const messageDate = new Date(msg.createdAt);
              const formattedTime = isToday(messageDate)
                ? format(messageDate, "HH:mm") // Только часы и минуты, если сегодня
                : format(messageDate, "MMM dd, yyyy"); // Месяц, день, год, если не сегодня

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
                    <span className="text-gray-500 text-xs ml-2">{formattedTime}</span> {/* Отображение времени/даты */}
                  </div>
                </div>
              );
            })}
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