"use client"

import React from "react"
import { OverviewAnalyticsWidget } from "@/src/components/dashboard/widgets/overview-analytics-widget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsDiagramWidget } from "@/src/components/dashboard/widgets/analytics-diagram-widget" // Импортируем новый виджет

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Analytics</h1>
      <p className="text-gray-400">View your stream and content analytics here.</p>
      
      <Card className="bg-gray-800 border-gray-700 flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-white">Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          <OverviewAnalyticsWidget />
        </CardContent>
      </Card>

      {/* Новый виджет диаграммы */}
      <div className="h-[400px]"> {/* Задаем фиксированную высоту для диаграммы */}
        <AnalyticsDiagramWidget />
      </div>
    </div>
  )
}