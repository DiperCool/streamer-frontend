"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isSidebarTransitioning, setIsSidebarTransitioning] = useState(false); // Новое состояние
  const pathname = usePathname()

  const isDashboard = pathname.startsWith("/dashboard/");
  const isAdmin = pathname.startsWith("/admins");

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Отслеживание перехода сайдбара
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (sidebarOpen !== !isMobile) { // Если состояние sidebarOpen отличается от ожидаемого (т.е. идет переход)
      setIsSidebarTransitioning(true);
      timeoutId = setTimeout(() => {
        setIsSidebarTransitioning(false);
      }, 200); // Длительность перехода 200ms
    } else {
      setIsSidebarTransitioning(false);
    }
    return () => clearTimeout(timeoutId);
  }, [sidebarOpen, isMobile]);


  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out",
        "top-0 h-full",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen} onCloseClick={() => setSidebarOpen(false)} isDashboard={isDashboard} isAdmin={isAdmin}>
        </Sidebar>
      </div>

      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "flex-1 flex flex-col",
        "transition-all duration-200 ease-in-out",
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} sidebarOpen={sidebarOpen} isDashboard={isDashboard} isAdmin={isAdmin} />
          
          <div className="flex-1 pt-16 overflow-y-auto"> {/* Added overflow-y-auto here */}
            {/* Передаем isSidebarTransitioning в дочерние элементы */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { isSidebarTransitioning } as { isSidebarTransitioning: boolean });
              }
              return child;
            })}
          </div>
      </div>
    </div>
  )
}