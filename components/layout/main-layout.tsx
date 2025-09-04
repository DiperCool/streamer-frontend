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
  const pathname = usePathname()

  const isDashboard = pathname.startsWith("/dashboard/");
  const isAdmin = pathname.startsWith("/admins");

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

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
        "flex-1 flex flex-col min-h-screen",
        "transition-all duration-200 ease-in-out",
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} sidebarOpen={sidebarOpen} isDashboard={isDashboard} isAdmin={isAdmin} />
          
          <div className="flex-1 pt-16">
            {children}
          </div>
      </div>
    </div>
  )
}