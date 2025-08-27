"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Heart, Menu, Search, User, Settings } from "lucide-react"
// useIsMobile is not directly used here, but passed from MainLayout

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isMobile: boolean;
  sidebarOpen: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isMobile, sidebarOpen, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800",
        className
      )}
      {...props}
    >
      <SidebarHeader isMobile={isMobile} sidebarOpen={sidebarOpen}>
        {/* Логотип будет здесь */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav>
          <Link href="/" passHref>
            <SidebarNavItem icon={<Home />} active={false}>
              Home
            </SidebarNavItem>
          </Link>
          <SidebarNavItem icon={<Heart />}>
            Following
          </SidebarNavItem>
        </SidebarNav>
      </SidebarContent>
    </div>
  )
)
Sidebar.displayName = "Sidebar"

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  isMobile: boolean;
  sidebarOpen: boolean;
}

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  SidebarHeaderProps
>(({ className, isMobile, sidebarOpen, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center px-6 py-4 lg:py-0", className)}
    {...props}
  >
    {isMobile && sidebarOpen && ( // Логотип виден только на мобильных, когда сайдбар открыт
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold text-green-500">STREAMER</div>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">BETA</span>
      </div>
    )}
  </div>
));
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto py-2", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("space-y-1 px-3", className)}
    {...props}
  />
))
SidebarNav.displayName = "SidebarNav"

const SidebarNavItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: React.ReactNode
    active?: boolean
  }
>(({ className, icon, active, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className={cn(
      "w-full justify-start px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white",
      active && "bg-gray-800 text-white",
      className
    )}
    {...props}
  >
    {icon && <span className="mr-3 h-4 w-4 flex items-center justify-center">{icon}</span>}
    {children}
  </Button>
))
SidebarNavItem.displayName = "SidebarNavItem"

export { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem }