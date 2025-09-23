"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs" // Оставляем импорты, так как они могут использоваться в других местах, но не в этом файле напрямую
import { useDashboard } from "@/src/contexts/DashboardContext"

export default function ChannelLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const { username } = params;
  const pathname = usePathname();
  const { activeStreamer } = useDashboard();
  const streamerUsername = activeStreamer?.userName ?? username;

  // Логика активной вкладки больше не нужна для этого макета, так как вкладки удалены.
  // Однако, для корректной работы боковой панели, мы можем оставить определение 'activeTab'
  // или просто удалить его, так как оно не используется для рендеринга вкладок здесь.
  // Для простоты, удалим его, так как оно не влияет на рендеринг в этом файле.

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-2 text-white">Channel Management</h1>
      {/* Вкладки удалены, содержимое отображается напрямую */}
      {children}
    </div>
  );
}