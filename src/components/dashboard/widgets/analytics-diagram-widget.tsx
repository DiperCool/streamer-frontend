"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import {
  useGetAnalyticsDiagramQuery,
  AnalyticsDiagramType,
  AnalyticsItemType,
} from "@/graphql/__generated__/graphql";
import { useDashboard } from "@/src/contexts/DashboardContext";
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { formatAnalyticsValue } from "@/lib/utils";
import { useSearchParams } from "next/navigation"; // Импортируем useSearchParams

export const AnalyticsDiagramWidget: React.FC = () => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";
  const searchParams = useSearchParams(); // Инициализируем useSearchParams

  const [diagramType, setDiagramType] = useState<AnalyticsDiagramType>(AnalyticsDiagramType.Day);
  const [itemType, setItemType] = useState<AnalyticsItemType>(AnalyticsItemType.StreamViewers);
  
  // Инициализируем dateRange из URL или устанавливаем значение по умолчанию
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(() => {
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    if (urlFrom && urlTo) {
      return { from: parseISO(urlFrom), to: parseISO(urlTo) };
    }
    // Значение по умолчанию, если в URL нет параметров
    const today = new Date();
    return { from: startOfDay(subDays(today, 6)), to: endOfDay(today) };
  });

  // Эффект для обновления dateRange при изменении URL-параметров
  useEffect(() => {
    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");

    if (urlFrom && urlTo) {
      setDateRange({ from: parseISO(urlFrom), to: parseISO(urlTo) });
    } else {
      // Если параметры удалены из URL, возвращаемся к значению по умолчанию
      const today = new Date();
      setDateRange({ from: startOfDay(subDays(today, 6)), to: endOfDay(today) });
    }
  }, [searchParams]); // Зависимость от searchParams

  const { data, loading, error } = useGetAnalyticsDiagramQuery({
    variables: {
      param: {
        broadcasterId: streamerId,
        analyticsDiagramType: diagramType,
        type: itemType,
        from: dateRange.from?.toISOString() || "", // Используем dateRange из состояния
        to: dateRange.to?.toISOString() || "",     // Используем dateRange из состояния
      },
    },
    skip: !streamerId || !dateRange.from || !dateRange.to,
  });

  const chartData = useMemo(() => {
    if (!data?.analyticsDiagram) return [];

    return data.analyticsDiagram.map((item) => {
      return {
        name: item.title, // Используем item.title напрямую
        value: item.value,
      };
    });
  }, [data]); // diagramType больше не влияет на форматирование title, поэтому удаляем его из зависимостей

  const getChartItemTitle = (itemType: AnalyticsItemType) => {
    switch (itemType) {
      case AnalyticsItemType.StreamViewers: return "Average Viewers";
      case AnalyticsItemType.StreamTime: return "Time Streamed";
      case AnalyticsItemType.Follower: return "Follows";
      default: return String(itemType);
    }
  };

  if (!streamerId) {
    return (
      <div className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        Select a channel to view analytics.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-3 text-red-500 text-sm flex items-center justify-center">
        Error loading diagram: {error.message}
      </div>
    );
  }

  return (
    <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
        <CardTitle className="text-white text-base">Analytics Diagram</CardTitle>
        <div className="flex space-x-2">
          <Select value={diagramType} onValueChange={(value: AnalyticsDiagramType) => setDiagramType(value)}>
            <SelectTrigger className="w-[140px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value={AnalyticsDiagramType.Day}>Day</SelectItem>
              <SelectItem value={AnalyticsDiagramType.Week}>Week</SelectItem>
              <SelectItem value={AnalyticsDiagramType.Month}>Month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={itemType} onValueChange={(value: AnalyticsItemType) => setItemType(value)}>
            <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value={AnalyticsItemType.StreamViewers}>Average Viewers</SelectItem>
              <SelectItem value={AnalyticsItemType.Follower}>Follows</SelectItem>
              <SelectItem value={AnalyticsItemType.StreamTime}>Time Streamed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-3">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data available for the selected period and metric.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" /> {/* gray-600 */}
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} /> {/* gray-400 */}
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} /> {/* gray-400 */}
              <Tooltip
                contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '4px' }} // gray-700
                labelStyle={{ color: '#E5E7EB' }} // gray-200
                itemStyle={{ color: '#10B981' }} // green-500
                formatter={(value: number) => formatAnalyticsValue(itemType, value)}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', color: '#E5E7EB' }} />
              <Line
                type="monotone"
                dataKey="value"
                name={getChartItemTitle(itemType)}
                stroke="#10B981" // green-500
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};