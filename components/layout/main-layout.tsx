"use client"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Home, Heart, User, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out",
        "top-16 h-[calc(100vh-4rem)]",
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen pt-16",
        sidebarOpen && "lg:ml-64" // Применяем ml-64 только если sidebarOpen и на больших экранах
      )}>
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}