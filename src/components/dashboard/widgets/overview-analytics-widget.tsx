"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  isSameMonth,
  isSameYear,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatAnalyticsValue } from "@/lib/utils"; // Corrected import path

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

  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(subDays(new Date(), 29)),
    to: endOfDay(new Date()),
  });
  const [selectedPreset, setSelectedPreset] = useState<string>("last30days");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  // Effect to refetch when streamerId or dateRange changes
  useEffect(() => {
    if (streamerId && dateRange.from && dateRange.to) {
      refetch();
    }
  }, [streamerId, dateRange, refetch]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange({ from: startOfDay(range.from), to: endOfDay(range.to) });
      setSelectedPreset("custom");
    }
  };

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
    setIsCalendarOpen(false);
  }, []);

  useEffect(() => {
    applyPreset(selectedPreset); // Apply default preset on mount
  }, [applyPreset, selectedPreset]);

  const navigatePeriod = useCallback((direction: "prev" | "next") => {
    if (!dateRange.from || !dateRange.to) return;

    const diffInDays = (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24) + 1;
    let newFrom: Date;
    let newTo: Date;

    if (direction === "prev") {
      newTo = subDays(dateRange.from, 1);
      newFrom = subDays(newTo, diffInDays - 1);
    } else { // "next"
      newFrom = addMonths(dateRange.from, 1); // For simplicity, let's assume month-based navigation for now
      newTo = endOfMonth(newFrom);
      if (isAfter(newFrom, new Date())) { // Don't go past today
        newFrom = startOfDay(new Date());
        newTo = endOfDay(new Date());
      }
    }
    setDateRange({ from: newFrom, to: newTo });
    setSelectedPreset("custom"); // Custom range after navigation
  }, [dateRange]);

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectedPreset("");
    setIsCalendarOpen(false);
  };

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
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formattedDateRange}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700 text-white" align="end">
            <div className="flex">
              <div className="flex flex-col p-4 border-r border-gray-700">
                <h4 className="text-sm font-semibold mb-2">Date Presets</h4>
                <div className="space-y-2">
                  <Button variant="ghost" className={cn("w-full justify-start", selectedPreset === "last7days" && "bg-green-600 hover:bg-green-700 text-white")} onClick={() => applyPreset("last7days")}>Last 7 Days</Button>
                  <Button variant="ghost" className={cn("w-full justify-start", selectedPreset === "last30days" && "bg-green-600 hover:bg-green-700 text-white")} onClick={() => applyPreset("last30days")}>Last 30 Days</Button>
                  <Button variant="ghost" className={cn("w-full justify-start", selectedPreset === "thismonth" && "bg-green-600 hover:bg-green-700 text-white")} onClick={() => applyPreset("thismonth")}>This Month</Button>
                  <Button variant="ghost" className={cn("w-full justify-start", selectedPreset === "lastmonth" && "bg-green-600 hover:bg-green-700 text-white")} onClick={() => applyPreset("lastmonth")}>Last Month</Button>
                  <Button variant="ghost" className={cn("w-full justify-start", selectedPreset === "thisyear" && "bg-green-600 hover:bg-green-700 text-white")} onClick={() => applyPreset("thisyear")}>This Year</Button>
                </div>
              </div>
              <div className="flex flex-col">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className="p-4"
                />
                <div className="flex justify-end p-4 border-t border-gray-700 space-x-2">
                  <Button variant="outline" onClick={clearDateRange} className="border-gray-600 text-gray-300 hover:bg-gray-700">Clear</Button>
                  <Button onClick={() => setIsCalendarOpen(false)} className="bg-green-600 hover:bg-green-700 text-white">Update</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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