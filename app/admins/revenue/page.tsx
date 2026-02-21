"use client";

import React, { useMemo, useState } from "react";
import { AdminTransactionsTab } from "@/src/components/admins/AdminTransactionsTab";
import { AdminPayoutsTab } from "@/src/components/admins/AdminPayoutsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminStats } from "@/src/components/admins/AdminStats";
import { DateRange } from "react-day-picker";

const AdminRevenuePage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "transactions";

  const handleTabChange = (value: string) => {
    router.push(`${pathname}?tab=${value}`);
  };

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  });

  const fromDate = date?.from?.toISOString();
  const toDate = date?.to?.toISOString();


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AdminStats date={date} onDateChange={setDate} />
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="transactions">
            <TabsList className="bg-gray-900 mb-8">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions">
              <AdminTransactionsTab fromDate={fromDate} toDate={toDate} />
            </TabsContent>
            <TabsContent value="payouts">
              <AdminPayoutsTab fromDate={fromDate} toDate={toDate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRevenuePage;
