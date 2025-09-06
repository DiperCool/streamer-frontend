"use client";

import React, { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wifi } from "lucide-react";
import { useDashboard } from "@/src/contexts/DashboardContext";
import {
  useGetCurrentStreamQuery,
  useStreamUpdatedSubscription,
  useStreamerUpdatedSubscription,
  useGetStreamerQuery, // Добавлен импорт useGetStreamerQuery
  GetCurrentStreamDocument, // Импортируем документ запроса
} from "@/graphql/__generated__/graphql";
import { formatDistanceToNowStrict, intervalToDuration, formatDuration } from "date-fns";
import { useApolloClient } from "@apollo/client"; // Импортируем useApolloClient

// Helper function to format duration in HH:MM:SS
const formatLiveDuration = (startDate: string | null | undefined): string => {
  if (!startDate) return "00:00:00";
  
  const start = new Date(startDate);
  const now = new Date();

  if (isNaN(start.getTime())) return "00:00:00";

  const duration = intervalToDuration({ start, end: now });

  const hours = duration.hours ? String(duration.hours).padStart(2, '0') : '00';
  const minutes = duration.minutes ? String(duration.minutes).padStart(2, '0') : '00';
  const seconds = duration.seconds ? String(duration.seconds).padStart(2, '0') : '00';

  return `${hours}:${minutes}:${seconds}`;
};

export const SessionInfoWidget: React.FC = () => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";
  const [timeLive, setTimeLive] = useState("00:00:00");
  const client = useApolloClient(); // Инициализируем Apollo Client

  // Получаем данные стримера, чтобы определить статус isLive
  const { data: streamerStatusData, loading: streamerStatusLoading, refetch: refetchStreamerStatus } = useGetStreamerQuery({
    variables: { userName: activeStreamer?.userName ?? "" },
    skip: !activeStreamer?.userName,
  });

  const isStreamerActuallyLive = streamerStatusData?.streamer?.isLive ?? false;

  const { data: currentStreamData, loading: currentStreamLoading, error: currentStreamError, refetch: refetchCurrentStream } = useGetCurrentStreamQuery({
    variables: { streamerId },
    skip: !streamerId || !isStreamerActuallyLive, // Пропускаем запрос, если стример не в сети
  });

  // Подписка на обновления стрима в реальном времени
  useStreamUpdatedSubscription({
    variables: { streamId: currentStreamData?.currentStream?.id ?? "" },
    skip: !currentStreamData?.currentStream?.id,
    onData: ({ data }) => {
      const updatedStream = data.data?.streamUpdated;
      if (updatedStream) {
        client.cache.updateQuery(
          {
            query: GetCurrentStreamDocument,
            variables: { streamerId: streamerId },
          },
          (prev) => {
            if (!prev || !prev.currentStream) {
              return prev;
            }
            return {
              ...prev,
              currentStream: {
                ...prev.currentStream,
                ...updatedStream,
                streamer: {
                  ...prev.currentStream.streamer,
                  ...updatedStream.streamer,
                  __typename: 'StreamerDto',
                },
                category: updatedStream.category ? {
                  ...prev.currentStream.category,
                  ...updatedStream.category,
                  __typename: 'CategoryDto',
                } : prev.currentStream.category,
                tags: updatedStream.tags || [],
                __typename: 'StreamDto',
              },
            };
          }
        );
      }
    },
  });

  // Подписка на обновления стримера (например, изменение статуса isLive)
  useStreamerUpdatedSubscription({
    variables: { streamerId },
    skip: !streamerId,
    onData: ({ data }) => {
      if (data.data?.streamerUpdated) {
        refetchStreamerStatus(); // Перезапрашиваем статус стримера
        refetchCurrentStream(); // Также перезапрашиваем данные текущего стрима
      }
    },
  });

  const isLive = currentStreamData?.currentStream?.active ?? false;
  const startedAt = currentStreamData?.currentStream?.started;
  const currentViewers = currentStreamData?.currentStream?.currentViewers ?? 0;

  // Effect to update "Time Live" every second when live
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLive && startedAt) {
      interval = setInterval(() => {
        setTimeLive(formatLiveDuration(startedAt));
      }, 1000);
    } else {
      setTimeLive("00:00:00"); // Reset when offline
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, startedAt]);

  if (streamerStatusLoading || (isStreamerActuallyLive && currentStreamLoading)) {
    return (
      <div className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (currentStreamError) {
    // Если есть ошибка при загрузке стрима, но стример не в сети, это не критично.
    // Если стример должен быть в сети, но есть ошибка, то это проблема.
    // Для простоты, если isStreamerActuallyLive = false, мы не показываем ошибку currentStreamError.
    if (isStreamerActuallyLive) {
      return (
        <div className="flex-1 p-3 text-red-500 text-sm flex items-center justify-center">
          Error loading session info.
        </div>
      );
    }
  }

  return (
    <CardContent className="flex-1 p-0 flex flex-col">
      <div className="grid grid-cols-3 text-center text-gray-400 text-sm h-full">
        <div className="flex flex-col items-center justify-center border-r border-gray-700 p-2">
          <div className="flex items-center justify-center h-8">
            {isLive ? (
              <Badge className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                LIVE
              </Badge>
            ) : (
              <Badge className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs font-semibold">
                OFFLINE
              </Badge>
            )}
          </div>
          <span className="mt-2">Session</span>
        </div>

        <div className="flex flex-col items-center justify-center border-r border-gray-700 p-2">
          <span className="text-white text-lg font-semibold h-8 flex items-center justify-center">
            {isLive ? currentViewers : "-"}
          </span>
          <span className="mt-2">Viewers</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2">
          <span className="text-white text-lg font-semibold h-8 flex items-center justify-center">
            {isLive ? timeLive : "-"}
          </span>
          <span className="mt-2">Time Live</span>
        </div>
      </div>
    </CardContent>
  );
};