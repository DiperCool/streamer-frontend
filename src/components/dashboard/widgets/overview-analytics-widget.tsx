"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, CalendarIcon, ArrowUp, ArrowDown } from "lucide-react";
import { useDashboard } from "@/src/contexts/DashboardContext";
import {
  useGetOverviewAnalyticsQuery,
  AnalyticsItemType,
} from "@/graphql/__generated__/graphql";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isAfter,
  startOfDay,
  endOfDay,
  differenceInDays,
  addDays,
  parseISO,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatAnalyticsValue } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface AnalyticsItemDisplayProps {
  type: AnalyticsItemType;
  value: number;
  previousValue?: number; // Optional prop for comparison
}

const AnalyticsItemDisplay: React.FC<AnalyticsItemDisplayProps> = ({ type, value, previousValue }) => {
  const formattedValue = formatAnalyticsValue(type, value);
  const change = previousValue !== undefined ? value - previousValue : 0;
  const isPositive = change > 0;
  const isNegative = change < 0;

  const getTitle = (itemType: AnalyticsItemType) => {
    switch (itemType) {
      case AnalyticsItemType.StreamViewers: return "Average Viewers";
      case AnalyticsItemType.UniqueChatters: return "Unique Chatters";
      case AnalyticsItemType.StreamTime: return "Time Streamed";
      case AnalyticsItemType.UniqueViewers: return "Unique Viewers";
      case AnalyticsItemType.Follower: return "Follows";
      default: return itemType;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 border-r border-gray-700 last:border-r-0">
      <div className="flex items-center text-white text-lg font-semibold">
        {formattedValue}
        {previousValue !== undefined && change !== 0 && (
          <span className={cn("ml-1 text-sm", isPositive ? "text-green-500" : "text-red-500")}>
            {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </span>
        )}
      </div>
      <span className="text-gray-400 text-sm mt-1">{getTitle(type)}</span>
    </div>
  );
};

export const OverviewAnalyticsWidget: React.FC = () => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";
  const router = useRouter();
  const searchParams = useSearchParams();

  // Directly read from and to from URL search parameters
  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");

  const parsedFrom = urlFrom ? startOfDay(parseISO(urlFrom)) : undefined;
  const parsedTo = urlTo ? endOfDay(parseISO(urlTo)) : undefined;

  const { data, loading, error } = useGetOverviewAnalyticsQuery({
    variables: {
      param: {
        broadcasterId: streamerId,
        from: parsedFrom?.toISOString() || "",
        to: parsedTo?.toISOString() || "",
      },
    },
    skip: !streamerId || !parsedFrom || !parsedTo,
  });

  const analyticsData = data?.overviewAnalytics;

  // Helper to check if a date range matches a preset
  const getPresetFromDates = useCallback((from: Date, to: Date): string => {
    const today = new Date();
    const presets = {
      "last7days": { from: startOfDay(subDays(today, 6)), to: endOfDay(today) },
      "last30days": { from: startOfDay(subDays(today, 29)), to: endOfDay(today) },
      "thismonth": { from: startOfMonth(today), to: endOfDay(today) },
      "lastmonth": { from: startOfMonth(subMonths(today, 1)), to: endOfMonth(subMonths(today, 1)) },
      "thisyear": { from: new Date(today.getFullYear(), 0, 1), to: endOfDay(today) },
    };

    for (const [key, presetDates] of Object.entries(presets)) {
      if (isSameDay(from, presetDates.from) && isSameDay(to, presetDates.to)) {
        return key;
      }
    }
    return "custom";
  }, []);

  // Derive selectedPreset directly from URL params
  const selectedPreset = useMemo(() => {
    if (!parsedFrom || !parsedTo) {
      return "custom";
    }
    return getPresetFromDates(parsedFrom, parsedTo);
  }, [parsedFrom, parsedTo, getPresetFromDates]);

  // Function to apply presets by updating URL
  const applyPreset = useCallback((preset: string) => {
    const today = new Date();
    let newFrom: Date;
    let newTo: Date;

    switch (preset) {
      case "last7days":
        newFrom = startOfDay(subDays(today, 6));
        newTo = endOfDay(today);
        break;
      case "last30days":
        newFrom = startOfDay(subDays(today, 29));
        newTo = endOfDay(today);
        break;
      case "thismonth":
        newFrom = startOfMonth(today);
        newTo = endOfDay(today);
        break;
      case "lastmonth":
        newFrom = startOfMonth(subMonths(today, 1));
        newTo = endOfMonth(subMonths(today, 1));
        break;
      case "thisyear":
        newFrom = new Date(today.getFullYear(), 0, 1);
        newTo = endOfDay(today);
        break;
      default:
        return; // Do nothing for 'custom' preset here
    }
    const currentPath = `/dashboard/${activeStreamer?.userName}/analytics`;
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("from", format(newFrom, "yyyy-MM-dd"));
    newSearchParams.set("to", format(newTo, "yyyy-MM-dd"));
    router.push(`${currentPath}?${newSearchParams.toString()}`, { scroll: false });
  }, [activeStreamer?.userName, router]);

  // Effect to set default preset if no dates in URL on initial load
  useEffect(() => {
    if (!urlFrom || !urlTo) {
      applyPreset("last30days");
    }
  }, [urlFrom, urlTo, applyPreset]);

  const navigatePeriod = useCallback((direction: "prev" | "next") => {
    if (!parsedFrom || !parsedTo) return;

    const currentRangeLength = differenceInDays(parsedTo, parsedFrom);
    let newFrom: Date;
    let newTo: Date;

    if (direction === "prev") {
      newTo = subDays(parsedFrom, 1);
      newFrom = subDays(newTo, currentRangeLength);
    } else { // "next"
      newFrom = addDays(parsedTo, 1);
      newTo = addDays(newFrom, currentRangeLength);
      
      const todayEnd = endOfDay(new Date());
      if (isAfter(newTo, todayEnd)) {
        newTo = todayEnd;
        newFrom = subDays(newTo, currentRangeLength);
      }
    }
    const finalFrom = startOfDay(newFrom);
    const finalTo = endOfDay(newTo);

    const currentPath = `/dashboard/${activeStreamer?.userName}/analytics`;
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("from", format(finalFrom, "yyyy-MM-dd"));
    newSearchParams.set("to", format(finalTo, "yyyy-MM-dd"));
    router.push(`${currentPath}?${newSearchParams.toString()}`, { scroll: false });
  }, [parsedFrom, parsedTo, activeStreamer?.userName, router]);

  const formattedDateRange = parsedFrom && parsedTo
    ? `${format(parsedFrom, "MMM dd, yyyy")} – ${format(parsedTo, "MMM dd, yyyy")}`
    : "Select a date range";

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
        Error loading analytics: {error.message}
      </div>
    );
  }

  const overviewItems = analyticsData?.items || [];
  const daysCount = analyticsData?.days || 0;

  return (
    <Card className="h-full bg-gray-800 border-gray-700 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-gray-700">
        <CardTitle className="text-white text-base">Overview Analytics</CardTitle>
        <Select value={selectedPreset} onValueChange={applyPreset}>
          <SelectTrigger className="w-[280px] bg-gray-700 border-gray-600 text-white">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select a date range" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="last7days">Last 7 Days</SelectItem>
            <SelectItem value="last30days">Last 30 Days</SelectItem>
            <SelectItem value="thismonth">This Month</SelectItem>
            <SelectItem value="lastmonth">Last Month</SelectItem>
            <SelectItem value="thisyear">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <Button variant="ghost" size="icon" onClick={() => navigatePeriod("prev")} className="text-gray-400 hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-gray-300 text-sm">
            {formattedDateRange}
            <span className="block text-xs text-gray-500">{daysCount} days</span>
          </span>
          <Button variant="ghost" size="icon" onClick={() => navigatePeriod("next")} className="text-gray-400 hover:text-white">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-3 flex-1">
          {overviewItems.map((item, index) => (
            <AnalyticsItemDisplay
              key={index}
              type={item.type}
              value={item.value}
              // For simplicity, previousValue is not implemented here as it requires fetching historical data.
              // In a real app, you'd fetch data for the previous period to calculate this.
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};