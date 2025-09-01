"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Heart, Menu, BarChart2, Monitor, Video, Users, Settings, MessageSquare, Key, UserCog } from "lucide-react" // Import new icons
import Link from "next/link"
import { usePathname } from "next/navigation" // Import usePathname
import { CollapsibleSidebarNav } from "./collapsible-sidebar-nav" // Import new component

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isMobile: boolean;
  sidebarOpen: boolean;
  onCloseClick: () => void;
  isDashboard?: boolean; // New prop
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isMobile, sidebarOpen, onCloseClick, isDashboard = false, ...props }, ref) => {
    const pathname = usePathname(); // Use pathname here

    // Determine if any child of 'Channel' is active
    const isChannelActive = pathname.startsWith("/dashboard/channel");

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800",
          className
        )}
        {...props}
      >
        <SidebarHeader isMobile={isMobile} sidebarOpen={sidebarOpen} onCloseClick={onCloseClick}>
          {/* The content of SidebarHeader will now be identical to Navbar's left section */}
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav>
            {isDashboard ? (
              <>
                <Link href="/dashboard" passHref>
                  <SidebarNavItem icon={<Home />} active={pathname === "/dashboard"}>
                    Dashboard Home
                  </SidebarNavItem>
                </Link>
                <Link href="/dashboard/analytics" passHref>
                  <SidebarNavItem icon={<BarChart2 />} active={pathname === "/dashboard/analytics"}>
                    Analytics
                  </SidebarNavItem>
                </Link>

                {/* Collapsible Channel Section */}
                <CollapsibleSidebarNav title="Channel" icon={<Monitor />} active={isChannelActive}>
                  <Link href="/dashboard/channel/chat" passHref>
                    <SidebarNavItem icon={<MessageSquare />} active={pathname === "/dashboard/channel/chat"}>
                      Chat
                    </SidebarNavItem>
                  </Link>
                  <Link href="/dashboard/channel/roles" passHref>
                    <SidebarNavItem icon={<UserCog />} active={pathname === "/dashboard/channel/roles"}>
                      Roles
                    </SidebarNavItem>
                  </Link>
                  <Link href="/dashboard/channel/community" passHref>
                    <SidebarNavItem icon={<Users />} active={pathname === "/dashboard/channel/community"}>
                      Community
                    </SidebarNavItem>
                  </Link>
                  <Link href="/dashboard/channel/stream-key" passHref>
                    <SidebarNavItem icon={<Key />} active={pathname === "/dashboard/channel/stream-key"}>
                      Stream URL & Key
                    </SidebarNavItem>
                  </Link>
                </CollapsibleSidebarNav>

                <Link href="/dashboard/content" passHref>
                  <SidebarNavItem icon={<Video />} active={pathname === "/dashboard/content"}>
                    Content
                  </SidebarNavItem>
                </Link>
                <Link href="/dashboard/settings" passHref>
                  <SidebarNavItem icon={<Settings />} active={pathname === "/dashboard/settings"}>
                    Dashboard Settings
                  </SidebarNavItem>
                </Link>
              </>
            ) : (
              <>
                <Link href="/" passHref>
                  <SidebarNavItem icon={<Home />} active={pathname === "/"}>
                    Home
                  </SidebarNavItem>
                </Link>
                <SidebarNavItem icon={<Heart />} active={pathname === "/following"}> {/* Assuming a /following route */}
                  Following
                </SidebarNavItem>
              </>
            )}
          </SidebarNav>
        </SidebarContent>
      </div>
    );
  }
)
Sidebar.displayName = "Sidebar"

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  isMobile: boolean;
  sidebarOpen: boolean;
  onCloseClick?: () => void;
}

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  SidebarHeaderProps
>(({ className, isMobile, sidebarOpen, onCloseClick, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center px-6", className)}
    {...props}
  >
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onCloseClick}
        className="text-gray-300 hover:text-white"
      >
        <Menu className="h-5 w-5" />
      </Button>
      {/* Логотип теперь всегда виден в Sidebar, независимо от isMobile */}
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold text-green-500">STREAMER</div>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">BETA</span>
      </div>
    </div>
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