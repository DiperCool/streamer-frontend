"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Heart, Menu, BarChart2, Monitor, Video, Users, Settings, MessageSquare, Key, UserCog } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CollapsibleSidebarNav } from "./collapsible-sidebar-nav"
import { useDashboard } from "@/src/contexts/DashboardContext" // Import useDashboard

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isMobile: boolean;
  sidebarOpen: boolean;
  onCloseClick: () => void;
  isDashboard?: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isMobile, sidebarOpen, onCloseClick, isDashboard = false, ...props }, ref) => {
    const pathname = usePathname();
    const { activeStreamer } = useDashboard(); // Use useDashboard hook

    const dashboardBaseUrl = activeStreamer ? `/dashboard/${activeStreamer.userName}` : "/dashboard";

    // Determine if any child of 'Channel' is active
    const isChannelActive = pathname.startsWith(`${dashboardBaseUrl}/channel`);

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
                <Link href={dashboardBaseUrl} passHref>
                  <SidebarNavItem icon={<Home />} active={pathname === dashboardBaseUrl}>
                    Dashboard Home
                  </SidebarNavItem>
                </Link>
                <Link href={`${dashboardBaseUrl}/analytics`} passHref>
                  <SidebarNavItem icon={<BarChart2 />} active={pathname === `${dashboardBaseUrl}/analytics`}>
                    Analytics
                  </SidebarNavItem>
                </Link>

                {/* Collapsible Channel Section */}
                <CollapsibleSidebarNav title="Channel" icon={<Monitor />} active={isChannelActive}>
                  <Link href={`${dashboardBaseUrl}/channel/chat`} passHref>
                    <SidebarNavItem icon={<MessageSquare />} active={pathname === `${dashboardBaseUrl}/channel/chat`}>
                      Chat
                    </SidebarNavItem>
                  </Link>
                  <Link href={`${dashboardBaseUrl}/channel/roles`} passHref>
                    <SidebarNavItem icon={<UserCog />} active={pathname === `${dashboardBaseUrl}/channel/roles`}>
                      Roles
                    </SidebarNavItem>
                  </Link>
                  <Link href={`${dashboardBaseUrl}/channel/community`} passHref>
                    <SidebarNavItem icon={<Users />} active={pathname === `${dashboardBaseUrl}/channel/community`}>
                      Community
                    </SidebarNavItem>
                  </Link>
                  <Link href={`${dashboardBaseUrl}/channel/stream-key`} passHref>
                    <SidebarNavItem icon={<Key />} active={pathname === `${dashboardBaseUrl}/channel/stream-key`}>
                      Stream URL & Key
                    </SidebarNavItem>
                  </Link>
                </CollapsibleSidebarNav>

                <Link href={`${dashboardBaseUrl}/content`} passHref>
                  <SidebarNavItem icon={<Video />} active={pathname === `${dashboardBaseUrl}/content`}>
                    Content
                  </SidebarNavItem>
                </Link>
                <Link href={`${dashboardBaseUrl}/settings`} passHref>
                  <SidebarNavItem icon={<Settings />} active={pathname === `${dashboardBaseUrl}/settings`}>
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
    rightIcon?: React.ReactNode
  }
>(({ className, icon, active, children, rightIcon, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    className={cn(
      "w-full py-2 text-gray-300 hover:bg-gray-800 hover:text-white",
      rightIcon ? "justify-between" : "justify-start",
      active && "bg-gray-800 text-white",
      className
    )}
    {...props}
  >
    <span className="flex items-center">
      {icon && <span className="mr-2 h-4 w-4 flex items-center justify-center">{icon}</span>}
      {children}
    </span>
    {rightIcon}
  </Button>
))
SidebarNavItem.displayName = "SidebarNavItem"

export { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem }