"use client";

import React, { useMemo } from "react";
import { useAdminTransactionStatisticsQuery } from "@/graphql/__generated__/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface AdminStatsProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ date, onDateChange }) => {
  const variables = useMemo(() => {
    return {
      fromDate: date?.from?.toISOString(),
      toDate: date?.to?.toISOString(),
    };
  }, [date]);

  const { data, loading, error } = useAdminTransactionStatisticsQuery({
    variables,
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Revenue</h1>
        <DateRangePicker date={date} onDateChange={onDateChange} />
      </div>

      {loading && !data && (
        <div className="flex items-center justify-center min-h-[100px]">
          <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        </div>
      )}

      {error && (
        <Card className="bg-red-900 border-red-700 text-white">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load revenue statistics: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">Total Gross Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">${data.adminTransactionStatistics.totalGrossVolume.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">Total Paid Out</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">${data.adminTransactionStatistics.totalPaidOut.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">Platform Net</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">${data.adminTransactionStatistics.totalPlatformNet.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-400">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{data.adminTransactionStatistics.transactionsCount}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
