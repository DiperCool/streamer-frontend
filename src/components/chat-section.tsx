"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Gift, X, Loader2, ChevronUp, MessageSquareReply } from "lucide-react"
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
    ChatMessagesEdge,
} from "@/graphql/__generated__/graphql"
import { useApolloClient } from "@apollo/client"
import { MessageItem } from "@/src/components/chat/message-item" // Import the new component

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
  const [isScrolledToTop, setIsScrolledToTop] = useState(false); // State to track if scrolled to top

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

  // Refactored handleScroll into a useCallback
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      // Consider "top" if scrollTop is very close to 0 (e.g., within 10 pixels)
      setIsScrolledToTop(chatContainerRef.current.scrollTop < 10);
    }
  }, []);

  // Effect to handle initial message loading and scroll to bottom
  useEffect(() => {
    if (messagesData?.chatMessages?.nodes && chatContainerRef.current && !initialMessagesLoaded) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
        handleScroll(); // Call handleScroll after programmatic scroll
        setInitialMessagesLoaded(true)
      }, 0);
    }
  }, [messagesData, initialMessagesLoaded, handleScroll, chatContainerRef])

  // Effect to refetch on chat open and reset initialMessagesLoaded
  useEffect(() => {
    if (chatId) {
      refetch();
      setInitialMessagesLoaded(false);
    }
  }, [chatId, refetch]);

  // Effect to handle scroll detection for "Load More" button visibility
  useEffect(() => {
    const currentRef = chatContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      // Removed initial handleScroll() call here, as it's handled by the initialMessagesLoaded useEffect
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [chatContainerRef, handleScroll]); // Added handleScroll to dependencies

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
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col relative">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2"> {/* Group Chat title and Load More button */}
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

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar" ref={chatContainerRef}>
        {chatLoading || messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {messagesData?.chatMessages?.nodes?.slice().reverse().map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                onReply={setReplyToMessage}
                onDelete={handleDeleteMessage}
                currentHoveredMessageId={hoveredMessageId}
                onMouseEnter={setHoveredMessageId}
                onMouseLeave={() => setHoveredMessageId(null)}
              />
            ))}
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