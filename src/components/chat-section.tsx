"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Gift, X, Loader2, ChevronUp, MessageSquareReply } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FixedSizeList, ListOnScrollProps } from 'react-window';
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
}

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(500, "Message is too long"),
})

type MessageForm = z.infer<typeof messageSchema>
const messagesCount = 15;
const MESSAGE_ITEM_HEIGHT = 50; // Approximate fixed height for a message item

// Define interface for data passed to Row component
interface RowData {
  messages: ChatMessageDto[];
  onReply: (message: ChatMessageDto) => void;
  onDelete: (messageId: string) => void;
  currentHoveredMessageId: string | null;
  onMouseEnter: (messageId: string) => void;
  onMouseLeave: () => void;
}

// Row component for FixedSizeList - moved outside ChatSection
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

export function ChatSection({ onCloseChat, streamerId }: ChatSectionProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null) // Ref for the outer div to get dimensions
  const listRef = useRef<FixedSizeList>(null); // Ref for FixedSizeList instance methods
  const outerListRef = useRef<HTMLDivElement>(null); // Ref for the actual scrollable DOM element of FixedSizeList
  const client = useApolloClient();

  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false)
  const [replyToMessage, setReplyToMessage] = useState<ChatMessageDto | null>(null)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [isScrolledToTop, setIsScrolledToTop] = useState(false);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true); // New state to track if user is at the bottom
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

  // ResizeObserver to get dynamic height/width for FixedSizeList
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

  // Memoize reversed messages for FixedSizeList
  const reversedMessages = React.useMemo(() => {
    return messagesData?.chatMessages?.nodes ? [...messagesData.chatMessages.nodes].reverse() : [];
  }, [messagesData]);

  // Effect to handle initial message loading and scroll to bottom
  useEffect(() => {
    if (reversedMessages.length > 0 && listRef.current && !initialMessagesLoaded) {
      listRef.current.scrollToItem(reversedMessages.length - 1, "auto"); // Scroll to end on initial load
      setInitialMessagesLoaded(true);
      setIsScrolledToTop(false); // Ensure button is hidden after initial scroll
      setIsUserAtBottom(true); // Assume user is at bottom after initial scroll
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

        // Scroll to bottom if user was already at bottom
        if (isUserAtBottom && listRef.current) {
          listRef.current.scrollToItem(reversedMessages.length, "end"); // Use "end" for new messages
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
          
          // No automatic scroll adjustment here. User will need to scroll up to see older messages.
          // This simplifies the logic and avoids complex react-window prepend scroll management.

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
      setIsUserAtBottom((scrollHeight - scrollTop - clientHeight) < MESSAGE_ITEM_HEIGHT); // Check if near bottom

      // Trigger load more if scrolling up and near the top
      if (scrollTop < MESSAGE_ITEM_HEIGHT * 2 && messagesData?.chatMessages?.pageInfo.hasNextPage && !isLoadingMore) {
        handleLoadMore();
      }
    }
  }, [messagesData, isLoadingMore, handleLoadMore]);

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

      <CardContent className="flex-1 p-0" ref={chatContainerRef}> {/* p-0 to let FixedSizeList manage padding */}
        {chatLoading || messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          listHeight > 0 && listWidth > 0 && (
            <FixedSizeList
              ref={listRef}
              outerRef={outerListRef} {/* Pass outerRef here */}
              height={listHeight}
              width={listWidth}
              itemCount={reversedMessages.length}
              itemSize={MESSAGE_ITEM_HEIGHT}
              itemData={{
                messages: reversedMessages,
                onReply: setReplyToMessage,
                onDelete: handleDeleteMessage,
                currentHoveredMessageId: hoveredMessageId,
                onMouseEnter: setHoveredMessageId,
                onMouseLeave: () => setHoveredMessageId(null),
              }}
              onScroll={onListScroll}
              className="custom-scrollbar" // Apply custom scrollbar if needed
            >
              {Row}
            </FixedSizeList>
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