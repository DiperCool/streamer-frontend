"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Gift, X, Loader2, ChevronUp, MessageSquareReply } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { VariableSizeList, ListOnScrollProps } from 'react-window';
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
    ChatMessagesEdge,
} from "@/graphql/__generated__/graphql"
import { useApolloClient } from "@apollo/client"
import { MessageItem } from "@/src/components/chat/message-item"

interface ChatSectionProps {
  onCloseChat: () => void
  streamerId: string
  onScrollToBottom: () => void; // Новый пропс для прокрутки родителя
}

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(500, "Message is too long"),
})

type MessageForm = z.infer<typeof messageSchema>
const messagesCount = 50; // Увеличено количество сообщений для начальной загрузки
const MESSAGE_ITEM_BASE_HEIGHT = 50; // Базовая высота для однострочного сообщения без ответа
const REPLY_HEIGHT_ADDITION = 20; // Дополнительная высота для сообщения, которое является ответом
const LONG_MESSAGE_TEXT_THRESHOLD = 50; // Порог символов для определения длинного сообщения
const LONG_MESSAGE_HEIGHT_PER_LINE = 18; // Примерная высота для каждой дополнительной строки длинного сообщения

// Define interface for data passed to Row component
interface RowData {
  messages: ChatMessageDto[];
  onReply: (message: ChatMessageDto) => void;
  onDelete: (messageId: string) => void;
  currentHoveredMessageId: string | null;
  onMouseEnter: (messageId: string) => void;
  onMouseLeave: () => void;
}

// Row component for VariableSizeList - moved outside ChatSection
const Row = React.memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: RowData }) => {
  const { messages, onReply, onDelete, currentHoveredMessageId, onMouseEnter, onMouseLeave } = data;
  const message = messages[index];
  if (!message) return null;

  return (
    <div style={style}>
      <MessageItem
        message={message}
        onReply={onReply}
        onDelete={onDelete}
        currentHoveredMessageId={currentHoveredMessageId}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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

    // Простая оценка для длинных сообщений
    if (message.message.length > LONG_MESSAGE_TEXT_THRESHOLD) {
      // Примерная оценка количества дополнительных строк
      const extraLines = Math.ceil((message.message.length - LONG_MESSAGE_TEXT_THRESHOLD) / 30); 
      height += extraLines * LONG_MESSAGE_HEIGHT_PER_LINE;
    }

    return height;
  }, [reversedMessages]);

  // Effect to handle initial message loading and scroll to bottom
  useEffect(() => {
    if (reversedMessages.length > 0 && listRef.current && !initialMessagesLoaded) {
      const timer = setTimeout(() => {
        listRef.current?.scrollToItem(reversedMessages.length - 1, "end"); // Прокрутка в конец при начальной загрузке
        setIsScrolledToTop(false);
        setIsUserAtBottom(true);
        setInitialMessagesLoaded(true);
      }, 50); // Задержка в 50 мс
      return () => clearTimeout(timer);
    }
  }, [reversedMessages, initialMessagesLoaded]);

  // УДАЛЕН Effect to scroll to bottom when reply box appears
  // useEffect(() => {
  //   if (replyToMessage) {
  //     onScrollToBottom(); 
  //   }
  // }, [replyToMessage, onScrollToBottom]);

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

        // Scroll to bottom if user was already at bottom
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
                // Case 1: The message itself is being deleted
                if (node.id === deletedMessage.id) {
                  return { ...node, isDeleted: true, message: "[deleted]" };
                }
                // Case 2: The message replies to the deleted message
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

        // Clear replyToMessage if the deleted message was being replied to
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
      // UI will be updated via the useChatMessageDeletedSubscription, which directly modifies the Apollo cache
    } catch (error) {
      console.error("Error deleting message:", error);
      // Optionally show a toast notification for error
    }
  };

  const handleLoadMore = async () => {
    if (!chatId || !messagesData?.chatMessages?.pageInfo.hasNextPage || networkStatus === 3) return;

    // Store current scroll position before fetching more
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
          
          // Calculate new scroll position to maintain view
          // Используем getItemSize для более точного расчета
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
      setIsScrolledToTop(scrollTop < 10); // If scrollTop is very small, consider it "at top"
      setIsUserAtBottom((scrollHeight - scrollTop - clientHeight) < MESSAGE_ITEM_BASE_HEIGHT); // Check if near bottom
    }
  }, [messagesData, isLoadingMore, initialMessagesLoaded]);

  // Memoize the itemData object to ensure stability for VariableSizeList
  const itemData = React.useMemo(() => ({
    messages: reversedMessages,
    onReply: setReplyToMessage,
    onDelete: handleDeleteMessage,
    currentHoveredMessageId: hoveredMessageId,
    onMouseEnter: setHoveredMessageId,
    onMouseLeave: () => setHoveredMessageId(null),
  }), [reversedMessages, setReplyToMessage, handleDeleteMessage, hoveredMessageId, setHoveredMessageId]);


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