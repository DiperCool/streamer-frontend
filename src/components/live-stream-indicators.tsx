"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { formatLiveDuration } from "@/utils/utils"

interface LiveStreamIndicatorsProps {
  isLive: boolean;
  startedAt?: string | null;
}

export const LiveStreamIndicators: React.FC<LiveStreamIndicatorsProps> = ({ isLive, startedAt }) => {
  const [liveDuration, setLiveDuration] = useState("00:00:00");

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLive && startedAt) {
      interval = setInterval(() => {
        setLiveDuration(formatLiveDuration(startedAt));
      }, 1000);
    } else {
      setLiveDuration("00:00:00"); // Сброс, если не в эфире
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, startedAt]);

  if (!isLive) {
    return null; // Не отображаем индикаторы, если стрим не в эфире
  }

  return (
    <>
      <Badge className="absolute bottom-4 left-4 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
        LIVE
      </Badge>
      <Badge className="absolute bottom-4 left-20 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
        {liveDuration}
      </Badge>
    </>
  );
};