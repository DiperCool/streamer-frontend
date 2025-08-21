"use client"

import React, { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Gift, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  useGetChatQuery,
  useGetChatMessagesQuery,
  useCreateMessageMutation,
  SortEnumType,
} from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatSectionProps {
  onCloseChat: () => void
  streamerId: string // Добавляем streamerId в пропсы
}

// Схема валидации для сообщения
const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(500, "Message is too long"),
})

type MessageForm = z.infer<typeof messageSchema>

export function ChatSection({ onCloseChat, streamerId }: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Получаем ID чата для текущего стримера
  const { data: chatData, loading: chatLoading } = useGetChatQuery({
    variables: { streamerId },
    skip: !streamerId,
  })

  const chatId = chatData?.chat.id

  // Получаем сообщения чата
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery({
    variables: {
      chatId: chatId!,
      first: 50, // Загружаем последние 50 сообщений
      order: [{ createdAt: SortEnumType.Asc }], // Сортируем по времени создания по возрастанию
    },
    skip: !chatId, // Пропускаем запрос, если chatId еще не получен
  })

  // Хук для отправки сообщений
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

  // Отправка сообщения
  const onSubmit = async (values: MessageForm) => {
    if (!chatId) return // Не отправляем, если chatId не доступен
    try {
      await createMessage({
        variables: {
          request: {
            chatId,
            message: values.message,
          },
        },
      })
      reset({ message: "" }) // Очищаем поле ввода
      refetchMessages() // Перезагружаем сообщения, чтобы увидеть новое (пока без real-time)
    } catch (error) {
      console.error("Error sending message:", error)
      // Здесь можно добавить уведомление для пользователя об ошибке
    }
  }

  // Прокрутка к последнему сообщению при загрузке новых
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesData])

  const messages = messagesData?.chatMessages?.nodes || []

  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-white text-lg">Chat</CardTitle>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onCloseChat}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {chatLoading || messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          messages.map((msg) => (
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
          ))
        )}
        <div ref={messagesEndRef} /> {/* Элемент для прокрутки */}
      </CardContent>
      <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
        <Input
          {...register("message")}
          placeholder="Send a message"
          className="flex-1 bg-gray-700 border-gray-600 text-white focus:border-green-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(onSubmit)();
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