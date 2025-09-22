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
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { formatAnalyticsValue } from "@/lib/utils";

export const AnalyticsDiagramWidget: React.FC = () => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";

  const [diagramType, setDiagramType] = useState<AnalyticsDiagramType>(AnalyticsDiagramType.Day);
  const [itemType, setItemType] = useState<AnalyticsItemType>(AnalyticsItemType.StreamViewers);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfDay(subDays(new Date(), 6)),
    to: endOfDay(new Date()),
  });

  useEffect(() => {
    const today = new Date();
    let newFrom: Date;
    let newTo: Date;

    switch (diagramType) {
      case AnalyticsDiagramType.Day:
        newFrom = startOfDay(subDays(today, 6)); // Last 7 days
        newTo = endOfDay(today);
        break;
      case AnalyticsDiagramType.Week:
        newFrom = startOfWeek(subWeeks(today, 7), { weekStartsOn: 1 }); // Last 8 weeks (to show 7 full weeks + current partial)
        newTo = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case AnalyticsDiagramType.Month:
        newFrom = startOfMonth(subMonths(today, 11)); // Last 12 months
        newTo = endOfMonth(today);
        break;
      default:
        newFrom = startOfDay(subDays(today, 6));
        newTo = endOfDay(today);
        break;
    }
    setDateRange({ from: newFrom, to: newTo });
  }, [diagramType]);

  const { data, loading, error } = useGetAnalyticsDiagramQuery({
    variables: {
      param: {
        broadcasterId: streamerId,
        analyticsDiagramType: diagramType,
        type: itemType,
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      },
    },
    skip: !streamerId || !dateRange.from || !dateRange.to,
  });

  const chartData = useMemo(() => {
    if (!data?.analyticsDiagram) return [];

    return data.analyticsDiagram.map((item) => {
      // Удалена логика форматирования item.title
      return {
        name: item.title, // Используем item.title напрямую
        value: item.value,
      };
    });
  }, [data, diagramType]); // diagramType больше не влияет на форматирование title, но остается в зависимостях, если другие части useMemo его используют.

  const getChartItemTitle = (itemType: AnalyticsItemType) => {
    switch (itemType) {
      case AnalyticsItemType.StreamViewers: return "Average Viewers";
      case AnalyticsItemType.UniqueChatters: return "Unique Chatters";
      case AnalyticsItemType.StreamTime: return "Time Streamed";
      case AnalyticsItemType.UniqueViewers: return "Unique Viewers";
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
              <SelectItem value={AnalyticsItemType.UniqueChatters}>Unique Chatters</SelectItem>
              <SelectItem value={AnalyticsItemType.UniqueViewers}>Unique Viewers</SelectItem>
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