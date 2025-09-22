"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

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
  const isInitialMount = useRef(true);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedPreset, setSelectedPreset] = useState<string>("last30days");

  const { data, loading, error, refetch } = useGetOverviewAnalyticsQuery({
    variables: {
      param: {
        broadcasterId: streamerId,
        from: dateRange.from?.toISOString() || "",
        to: dateRange.to?.toISOString() || "",
      },
    },
    skip: !streamerId || !dateRange.from || !dateRange.to,
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

  // Function to apply presets
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
        return;
    }
    setDateRange({ from: newFrom, to: newTo });
    setSelectedPreset(preset);
  }, []);

  // Effect to initialize state from URL on first mount
  useEffect(() => {
    if (isInitialMount.current) {
      const urlFrom = searchParams.get("from");
      const urlTo = searchParams.get("to");
      const urlPreset = searchParams.get("preset"); // Still check for legacy preset param

      if (urlFrom && urlTo) {
        const fromDate = parseISO(urlFrom);
        const toDate = parseISO(urlTo);
        setDateRange({ from: fromDate, to: toDate });
        setSelectedPreset(getPresetFromDates(fromDate, toDate));
      } else if (urlPreset) {
        // Handle legacy preset param by applying it and then letting the URL sync effect update to from/to
        applyPreset(urlPreset);
      } else {
        // Default if no params
        applyPreset("last30days");
      }
      isInitialMount.current = false;
    }
  }, [searchParams, applyPreset, getPresetFromDates]);

  // Effect to update URL when dateRange changes
  useEffect(() => {
    if (isInitialMount.current) return; // Prevent running on initial mount

    const currentPath = `/dashboard/${activeStreamer?.userName}/analytics`;
    const newSearchParams = new URLSearchParams();

    if (dateRange.from && dateRange.to) {
      newSearchParams.set("from", format(dateRange.from, "yyyy-MM-dd"));
      newSearchParams.set("to", format(dateRange.to, "yyyy-MM-dd"));
    }

    router.replace(`${currentPath}?${newSearchParams.toString()}`, { scroll: false });
  }, [dateRange, router, activeStreamer?.userName]);


  // Effect to refetch when streamerId or dateRange changes
  useEffect(() => {
    if (streamerId && dateRange.from && dateRange.to) {
      refetch();
    }
  }, [streamerId, dateRange, refetch]);


  const navigatePeriod = useCallback((direction: "prev" | "next") => {
    if (!dateRange.from || !dateRange.to) return;

    const currentRangeLength = differenceInDays(dateRange.to, dateRange.from);
    let newFrom: Date;
    let newTo: Date;

    if (direction === "prev") {
      newTo = subDays(dateRange.from, 1);
      newFrom = subDays(newTo, currentRangeLength);
    } else { // "next"
      newFrom = addDays(dateRange.to, 1);
      newTo = addDays(newFrom, currentRangeLength);
      
      const todayEnd = endOfDay(new Date());
      if (isAfter(newTo, todayEnd)) {
        newTo = todayEnd;
        newFrom = subDays(newTo, currentRangeLength);
      }
    }
    const finalFrom = startOfDay(newFrom);
    const finalTo = endOfDay(newTo);
    setDateRange({ from: finalFrom, to: finalTo });
    setSelectedPreset(getPresetFromDates(finalFrom, finalTo)); // Determine preset after navigation
  }, [dateRange, getPresetFromDates]);

  const formattedDateRange = dateRange.from && dateRange.to
    ? `${format(dateRange.from, "MMM dd, yyyy")} – ${format(dateRange.to, "MMM dd, yyyy")}`
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
        <div className="grid grid-cols-5 flex-1">
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