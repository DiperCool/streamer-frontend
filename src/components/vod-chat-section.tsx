"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { format, isToday } from "date-fns"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, MessageSquareReply, Pin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { VariableSizeList, ListOnScrollProps } from 'react-window';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMinioUrl } from "@/utils/utils"
import {
  useGetChatQuery,
  useGetChatMessagesHistoryQuery,
  SortEnumType,
  ChatMessageDto,
} from "@/graphql/__generated__/graphql"
import { MessageItem } from "@/src/components/chat/message-item"

interface VodChatSectionProps {
  onCloseChat?: () => void;
  streamerId: string;
  vodCreatedAt: string;
  playerPosition: number;
}

const MESSAGE_ITEM_BASE_HEIGHT = 50;
const REPLY_HEIGHT_ADDITION = 20;
const LONG_MESSAGE_TEXT_THRESHOLD = 50;
const LONG_MESSAGE_HEIGHT_PER_LINE = 18;

interface RowData {
  messages: ChatMessageDto[];
  currentHoveredMessageId: string | null;
  onMouseEnter: (messageId: string) => void;
  onMouseLeave: () => void;
  pinnedMessageId: string | null;
}

const Row = React.memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: RowData }) => {
  const { messages, currentHoveredMessageId, onMouseEnter, onMouseLeave, pinnedMessageId } = data;
  const message = messages[index];
  if (!message) return null;

  const isPinned = message.id === pinnedMessageId;

  return (
    <div style={style}>
      <MessageItem
        message={message}
        onReply={() => {}}
        onDelete={() => {}}
        onPin={() => {}}
        onUnpin={() => {}}
        isPinned={isPinned}
        currentHoveredMessageId={currentHoveredMessageId}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        chatId={""}
      />
    </div>
  );
});

export function VodChatSection({ onCloseChat, streamerId, vodCreatedAt, playerPosition }: VodChatSectionProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);
  const outerListRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(0);
  const [listWidth, setListWidth] = useState(0);

  const [allFetchedMessages, setAllFetchedMessages] = useState<ChatMessageDto[]>([]);
  const [nextFromCursor, setNextFromCursor] = useState<string | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessageDto[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  const { data: chatData, loading: chatLoading } = useGetChatQuery({
    variables: { streamerId },
    skip: !streamerId,
  });

  const chatId = chatData?.chat.id;
  const pinnedMessage = chatData?.chat.pinnedMessage;
  const pinnedMessageId = chatData?.chat.pinnedMessageId;

  const { data: historyData, loading: historyLoading, refetch: refetchHistory } = useGetChatMessagesHistoryQuery({
    variables: {
      chatId: chatId!,
      startFrom: nextFromCursor || vodCreatedAt,
      order: [{ createdAt: SortEnumType.Asc }], // Сортируем по возрастанию для истории
    },
    skip: !chatId || !vodCreatedAt,
    pollInterval: 5000,
    // onCompleted удален, логика перенесена в useEffect
  });

  // Эффект для обработки данных, полученных из useGetChatMessagesHistoryQuery
  useEffect(() => {
    if (historyData?.chatMessagesHistory) {
      const newMessages = historyData.chatMessagesHistory.messages;
      setAllFetchedMessages(prev => {
        const existingIds = new Set(prev.map(msg => msg.id));
        const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
        return [...prev, ...uniqueNewMessages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
      setNextFromCursor(historyData.chatMessagesHistory.nextFrom);
    }
  }, [historyData]); // Зависимость от historyData

  // ResizeObserver для динамической высоты/ширины VariableSizeList
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

  // Эффект для фильтрации сообщений на основе playerPosition
  useEffect(() => {
    if (!vodCreatedAt || allFetchedMessages.length === 0) {
      setDisplayedMessages([]);
      return;
    }

    const vodStartTime = new Date(vodCreatedAt).getTime();
    const currentTimeInVod = vodStartTime + playerPosition * 1000;

    const newDisplayedMessages = allFetchedMessages.filter(msg =>
      new Date(msg.createdAt).getTime() <= currentTimeInVod
    );
    setDisplayedMessages(newDisplayedMessages);

    // Прокрутка к низу, если пользователь был внизу или это первый рендер
    if (isUserAtBottom && listRef.current && newDisplayedMessages.length > 0) {
      listRef.current.scrollToItem(newDisplayedMessages.length - 1, "end");
    } else if (!initialScrollDone && newDisplayedMessages.length > 0) {
        listRef.current?.scrollToItem(newDisplayedMessages.length - 1, "end");
        setInitialScrollDone(true);
    }
  }, [playerPosition, allFetchedMessages, vodCreatedAt, isUserAtBottom, initialScrollDone]);

  // Сброс сообщений при смене VOD или streamerId
  useEffect(() => {
    setAllFetchedMessages([]);
    setNextFromCursor(null);
    setDisplayedMessages([]);
    setInitialScrollDone(false);
    setIsUserAtBottom(true);
  }, [streamerId, vodCreatedAt]);

  // Функция для получения размера элемента для VariableSizeList
  const getItemSize = useCallback((index: number) => {
    const message = displayedMessages[index];
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
  }, [displayedMessages]);

  const onListScroll = useCallback(({ scrollOffset }: ListOnScrollProps) => {
    if (outerListRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = outerListRef.current;
      setIsUserAtBottom((scrollHeight - scrollTop - clientHeight) < MESSAGE_ITEM_BASE_HEIGHT);
    }
  }, []);

  const itemData = React.useMemo(() => ({
    messages: displayedMessages,
    currentHoveredMessageId: hoveredMessageId,
    onMouseEnter: setHoveredMessageId,
    onMouseLeave: () => setHoveredMessageId(null),
    pinnedMessageId: pinnedMessageId,
  }), [displayedMessages, hoveredMessageId, pinnedMessageId]);

  const isLoading = chatLoading || historyLoading;

  return (
    <Card className="bg-gray-800 border-gray-700 h-full flex flex-col relative">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-white text-lg">Chat Replay</CardTitle>
        {onCloseChat && (
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onCloseChat}>
            <X className="h-5 w-5" />
          </Button>
        )}
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
          {/* В VOD чате нет функционала открепления */}
        </div>
      )}

      <div className="flex-1 overflow-hidden" ref={chatContainerRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : (
          listHeight > 0 && listWidth > 0 && displayedMessages.length > 0 ? (
            <VariableSizeList
              ref={listRef}
              outerRef={outerListRef}
              height={listHeight}
              width={listWidth}
              itemCount={displayedMessages.length}
              itemSize={getItemSize}
              itemData={itemData}
              onScroll={onListScroll}
              estimatedItemSize={MESSAGE_ITEM_BASE_HEIGHT}
              className="custom-scrollbar"
            >
              {Row}
            </VariableSizeList>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No messages available for this VOD.
            </div>
          )
        )}
      </div>
    </Card>
  );
}