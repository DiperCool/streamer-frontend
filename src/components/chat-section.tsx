"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { format, isToday } from "date-fns" // Добавлен импорт format, isToday
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Gift, X, Loader2, ChevronUp, MessageSquareReply, Pin } from "lucide-react" // Добавлен Pin
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { VariableSizeList, ListOnScrollProps } from 'react-window';
import {
    useGetChatQuery,
    useGetChatMessagesQuery,
    useCreateMessageMutation,
    useDeleteMessageMutation,
    usePinMessageMutation, // Импорт мутации для закрепления
    useUnpinMessageMutation, // Импорт мутации для открепления
    useChatUpdatedSubscription, // Импорт подписки для обновления чата
    SortEnumType,
    ChatMessageDto,
    GetChatMessagesQuery,
    GetChatMessagesDocument,
    ChatMessagesEdge,
    GetChatDocument, // Импорт для обновления кэша чата
} from "@/graphql/__generated__/graphql"
import { useApolloClient } from "@apollo/client"
import { MessageItem } from "@/src/components/chat/message-item"
import { getMinioUrl } from "@/utils/utils" // Импорт getMinioUrl

interface ChatSectionProps {
  onCloseChat: () => void
  streamerId: string
  onScrollToBottom: () => void;
}

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(500, "Message is too long"),
})

type MessageForm = z.infer<typeof messageSchema>
const messagesCount = 50;
const MESSAGE_ITEM_BASE_HEIGHT = 50;
const REPLY_HEIGHT_ADDITION = 20;
const LONG_MESSAGE_TEXT_THRESHOLD = 50;
const LONG_MESSAGE_HEIGHT_PER_LINE = 18;
const PINNED_MESSAGE_HEIGHT = 70; // Примерная высота для закрепленного сообщения

interface RowData {
  messages: ChatMessageDto[];
  onReply: (message: ChatMessageDto) => void;
  onDelete: (messageId: string) => void;
  onPin: (messageId: string) => void;
  onUnpin: (chatId: string) => void;
  currentHoveredMessageId: string | null;
  onMouseEnter: (messageId: string) => void;
  onMouseLeave: () => void;
  chatId: string;
  pinnedMessageId: string | null; // Передаем ID закрепленного сообщения
}

const Row = React.memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: RowData }) => {
  const { messages, onReply, onDelete, onPin, onUnpin, currentHoveredMessageId, onMouseEnter, onMouseLeave, chatId, pinnedMessageId } = data;
  const message = messages[index];
  if (!message) return null;

  const isPinned = message.id === pinnedMessageId; // Проверяем, закреплено ли это сообщение

  return (
    <div style={style}>
      <MessageItem
        message={message}
        onReply={onReply}
        onDelete={onDelete}
        onPin={onPin}
        onUnpin={onUnpin}
        isPinned={isPinned}
        currentHoveredMessageId={currentHoveredMessageId}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        chatId={chatId}
      />
    </div>
  );
});

export function ChatSection({ onCloseChat, streamerId, onScrollToBottom }: ChatSectionProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<VariableSizeList>(null);
  const outerListRef = useRef<HTMLDivElement>(null);
  const client = useApolloClient();

  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false)
  const [replyToMessage, setReplyToMessage] = useState<ChatMessageDto | null>(null)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [isScrolledToTop, setIsScrolledToTop] = useState(false);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [listHeight, setListHeight] = useState(0);
  const [listWidth, setListWidth] = useState(0);

  const { data: chatData, loading: chatLoading } = useGetChatQuery({
    variables: { streamerId },
    skip: !streamerId,
  })

  const chatId = chatData?.chat.id
  const pinnedMessage = chatData?.chat.pinnedMessage;
  const pinnedMessageId = chatData?.chat.pinnedMessageId;

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
  const [pinMessageMutation] = usePinMessageMutation(); // Инициализация мутации закрепления
  const [unpinMessageMutation] = useUnpinMessageMutation(); // Инициализация мутации открепления

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

  // Подписка на обновление чата (для закрепленных сообщений)
  useChatUpdatedSubscription({
    variables: { chatId: chatId! },
    skip: !chatId,
    onData: ({ client, data }) => {
      const updatedChat = data.data?.chatUpdated;
      if (updatedChat) {
        // Обновляем кэш для GetChatQuery
        client.cache.updateQuery(
          {
            query: GetChatDocument,
            variables: { streamerId },
          },
          (prev) => {
            if (!prev || !prev.chat) return prev;
            return {
              ...prev,
              chat: {
                ...prev.chat,
                pinnedMessageId: updatedChat.pinnedMessageId,
                pinnedMessage: updatedChat.pinnedMessage ? {
                  ...updatedChat.pinnedMessage,
                  __typename: 'PinnedChatMessageDto',
                  message: updatedChat.pinnedMessage.message ? {
                    ...updatedChat.pinnedMessage.message,
                    __typename: 'ChatMessageDto',
                    sender: updatedChat.pinnedMessage.message.sender ? {
                      ...updatedChat.pinnedMessage.message.sender,
                      __typename: 'StreamerDto',
                    } : null,
                  } : null,
                } : null,
              },
            };
          }
        );
      }
    },
  });

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

  // Memoize reversed messages for VariableSizeList
  const reversedMessages = React.useMemo(() => {
    return messagesData?.chatMessages?.nodes ? [...messagesData.chatMessages.nodes].reverse() : [];
  }, [messagesData]);

  // Function to get item size for VariableSizeList
  const getItemSize = useCallback((index: number) => {
    const message = reversedMessages[index];
    if (!message) return MESSAGE_ITEM_BASE_HEIGHT;

    let height = MESSAGE_ITEM_BASE_HEIGHT;

    if (message.reply) {
      height += REPLY_HEIGHT_ADDITION;
    }

    if (message.message.length > LONG_MESSAGE_TEXT_THRESHOLD) {
      const extraLines = Math.ceil((message.message.length - LONG_MESSAGE_TEXT_THRESHOLD) / 30); 
      height += extraLines * LONG_MESSAGE_HEIGHT_PER_LINE;
    }

    return height;
  }, [reversedMessages]);

  // Effect to handle initial message loading and scroll to bottom
  useEffect(() => {
    if (reversedMessages.length > 0 && listRef.current && !initialMessagesLoaded) {
      const timer = setTimeout(() => {
        listRef.current?.scrollToItem(reversedMessages.length - 1, "end");
        setIsScrolledToTop(false);
        setIsUserAtBottom(true);
        setInitialMessagesLoaded(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [reversedMessages, initialMessagesLoaded]);

  // Effect to refetch on chat open and reset initialMessagesLoaded
  useEffect(() => {
    if (chatId) {
      refetch();
      setInitialMessagesLoaded(false);
    }
  }, [chatId, refetch]);

  // Subscription for new messages
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
              (node: ChatMessageDto) => node.id === newMessage.id
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
                isDeleted: newMessage.reply.isDeleted,
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

        if (isUserAtBottom && listRef.current) {
          listRef.current.scrollToItem(reversedMessages.length, "end"); 
        }
      }
    },
  });

  // Subscription for deleted messages
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
              (node: ChatMessageDto) => {
                if (node.id === deletedMessage.id) {
                  return { ...node, isDeleted: true, message: "[deleted]" };
                }
                if (node.replyId === deletedMessage.id) {
                  return {
                    ...node,
                    reply: node.reply ? {
                      ...node.reply,
                      isDeleted: true,
                      message: "[deleted]",
                    } : node.reply,
                  };
                }
                return node;
              }
            );
            const updatedEdges = prev.chatMessages.edges?.map(
              (edge: ChatMessagesEdge) => {
                const updatedNode = (() => {
                  if (edge.node.id === deletedMessage.id) {
                    return { ...edge.node, isDeleted: true, message: "[deleted]" };
                  }
                  if (edge.node.replyId === deletedMessage.id) {
                    return {
                      ...edge.node,
                      reply: edge.node.reply ? {
                        ...edge.node.reply,
                        isDeleted: true,
                        message: "[deleted]",
                      } : edge.node.reply,
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

        if (replyToMessage?.id === deletedMessage.id) {
          setReplyToMessage(null);
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
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handlePinMessage = async (messageId: string) => {
    if (!chatId) return;
    try {
      await pinMessageMutation({
        variables: {
          pinMessage: {
            messageId: messageId,
          },
        },
      });
      // UI will be updated via the useChatUpdatedSubscription
    } catch (error) {
      console.error("Error pinning message:", error);
    }
  };

  const handleUnpinMessage = async (chatId: string) => {
    try {
      await unpinMessageMutation({
        variables: {
          request: {
            chatId: chatId,
          },
        },
      });
      // UI will be updated via the useChatUpdatedSubscription
    } catch (error) {
      console.error("Error unpinning message:", error);
    }
  };

  const handleLoadMore = async () => {
    if (!chatId || !messagesData?.chatMessages?.pageInfo.hasNextPage || networkStatus === 3) return;

    const currentScrollOffset = outerListRef.current?.scrollTop || 0;

    try {
      await fetchMore({
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
          
          let newItemsHeight = 0;
          for (let i = 0; i < newNodes.length; i++) {
            newItemsHeight += getItemSize(prev.chatMessages?.nodes?.length ?? 0 + i);
          }
          const newScrollOffset = currentScrollOffset + newItemsHeight;
          
          setTimeout(() => {
            outerListRef.current?.scrollTo(0, newScrollOffset);
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

  const onListScroll = useCallback(({ scrollOffset }: ListOnScrollProps) => {
    if (outerListRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = outerListRef.current;
      setIsScrolledToTop(scrollTop < 10);
      setIsUserAtBottom((scrollHeight - scrollTop - clientHeight) < MESSAGE_ITEM_BASE_HEIGHT);
    }
  }, [messagesData, isLoadingMore, initialMessagesLoaded]);

  const itemData = React.useMemo(() => ({
    messages: reversedMessages,
    onReply: setReplyToMessage,
    onDelete: handleDeleteMessage,
    onPin: handlePinMessage,
    onUnpin: handleUnpinMessage,
    currentHoveredMessageId: hoveredMessageId,
    onMouseEnter: setHoveredMessageId,
    onMouseLeave: () => setHoveredMessageId(null),
    chatId: chatId!,
    pinnedMessageId: pinnedMessageId,
  }), [reversedMessages, setReplyToMessage, handleDeleteMessage, handlePinMessage, handleUnpinMessage, hoveredMessageId, setHoveredMessageId, chatId, pinnedMessageId]);


  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col relative">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-white text-lg">Chat</CardTitle>
          {messagesData?.chatMessages?.pageInfo.hasNextPage && isScrolledToTop && (
            <Button
              variant="default"
              size="icon"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 h-8 w-8 flex items-center justify-center"
            >
              {isLoadingMore ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onCloseChat}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      {/* Pinned Message Display */}
      {pinnedMessage && (
        <div className="bg-blue-900/30 border-b border-blue-800 p-3 flex items-center justify-between text-sm text-blue-200">
          <div className="flex items-center space-x-2">
            <Pin className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <span className="font-semibold">{pinnedMessage.message?.sender?.userName}:</span>
            <span className="truncate flex-1">{pinnedMessage.message?.message}</span>
            <span className="text-blue-300 text-xs ml-2">
              {isToday(new Date(pinnedMessage.createdAt))
                ? format(new Date(pinnedMessage.createdAt), "HH:mm")
                : format(new Date(pinnedMessage.createdAt), "MMM dd, yyyy")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-blue-300 hover:text-white hover:bg-blue-800/50"
            onClick={() => handleUnpinMessage(chatId!)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <CardContent className="flex-1 p-0" ref={chatContainerRef}>
        {chatLoading || messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          listHeight > 0 && listWidth > 0 && (
            <VariableSizeList
              ref={listRef}
              outerRef={outerListRef}
              height={listHeight}
              width={listWidth}
              itemCount={reversedMessages.length}
              itemSize={getItemSize}
              itemData={itemData}
              onScroll={onListScroll}
              estimatedItemSize={MESSAGE_ITEM_BASE_HEIGHT}
              className="custom-scrollbar"
            >
              {Row}
            </VariableSizeList>
          )
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