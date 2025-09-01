"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Home, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardProvider } from "@/src/contexts/DashboardContext";

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const pathname = usePathname()

  // Determine if the current route is part of the dashboard
  const isDashboard = pathname.startsWith("/dashboard");

  // Effect for updating sidebarOpen upon isMobile change
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out",
        "top-0 h-full",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen} onCloseClick={() => setSidebarOpen(false)} isDashboard={isDashboard}>
          {/* Sidebar content is now handled internally by Sidebar component based on isDashboard prop */}
        </Sidebar>
      </div>

      {/* Overlay for mobile devices */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen", // Removed pt-16 from here
        "transition-all duration-200 ease-in-out",
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        <DashboardProvider> {/* DashboardProvider now wraps Navbar and children */}
          {/* Navbar */}
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} sidebarOpen={sidebarOpen} />
          
          {/* Page content */}
          <div className="flex-1 pt-16"> {/* Added pt-16 here to push content below the fixed Navbar */}
            {children}
          </div>
        </DashboardProvider>
      </div>
    </div>
  )
}