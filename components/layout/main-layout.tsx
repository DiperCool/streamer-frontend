"use client"
import React, { useState } => "react"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Home, Heart, User, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"; // Импортируем хук

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile(); // Определяем, является ли устройство мобильным
  // Инициализируем sidebarOpen: если это мобильное устройство, то false (закрыт), иначе true (открыт)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); 
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out",
        "top-16 h-[calc(100vh-4rem)]",
        // Теперь translate-x-0 (открыт) или -translate-x-full (закрыт) применяется на всех экранах
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-500">STREAMER</div>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">BETA</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav>
              <Link href="/" passHref>
                <SidebarNavItem icon={<Home />} active={pathname === "/"}>
                  Home
                </SidebarNavItem>
              </Link>
              <SidebarNavItem icon={<Heart />}>
                Following
              </SidebarNavItem>
              <SidebarNavItem icon={<User />}>
                Profile
              </SidebarNavItem>
              <Link href="/settings/profile" passHref>
                <SidebarNavItem icon={<Settings />} active={pathname.startsWith("/settings")}>
                  Settings
                </SidebarNavItem>
              </Link>
            </SidebarNav>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Overlay для мобильных устройств */}
      {sidebarOpen && isMobile && ( // Показываем оверлей только на мобильных, когда сайдбар открыт
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Основной контент */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen pt-16",
        "transition-all duration-200 ease-in-out", // Добавляем классы перехода сюда
        // Отступ для основного контента: на мобильных всегда 0, на больших экранах зависит от sidebarOpen
        "ml-0", // По умолчанию отступ 0 для всех экранов
        sidebarOpen ? "lg:ml-64" : "lg:ml-0" // На больших экранах (lg) отступ 64px, если сайдбар открыт, иначе 0
      )}>
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Содержимое страницы */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}