"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Home, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const pathname = usePathname()

  // Эффект для обновления sidebarOpen при изменении isMobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out", // z-index Sidebar теперь 50
        "top-0 h-full",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen}>
          <SidebarHeader isMobile={isMobile} sidebarOpen={sidebarOpen} onCloseClick={() => setSidebarOpen(false)}>
            {/* Логотип STREAMER BETA будет здесь, условно отображаемый */}
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
            </SidebarNav>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Overlay для мобильных устройств */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Основной контент */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen pt-16",
        "transition-all duration-200 ease-in-out",
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} sidebarOpen={sidebarOpen} />
        
        {/* Содержимое страницы */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}