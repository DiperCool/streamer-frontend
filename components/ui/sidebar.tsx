"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Heart, Menu, BarChart2, Monitor, Video, Users, Settings, MessageSquare, Key, UserCog, Info } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CollapsibleSidebarNav } from "./collapsible-sidebar-nav"
import { useDashboard } from "@/src/contexts/DashboardContext"
import { AdminSidebar } from "@/src/components/admin-sidebar"
import { FollowingStreamersSidebar } from "@/src/components/following-streamers-sidebar"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isMobile: boolean;
  sidebarOpen: boolean;
  onCloseClick: () => void;
  isDashboard?: boolean;
  isAdmin?: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isMobile, sidebarOpen, onCloseClick, isDashboard = false, isAdmin = false, ...props }, ref) => {
    const pathname = usePathname();
    const { activeStreamer } = useDashboard();

    const dashboardBaseUrl = activeStreamer ? `/dashboard/${activeStreamer.userName}` : "/dashboard";

    const isChannelActive = pathname.startsWith(`${dashboardBaseUrl}/channel`);
    const isContentActive = pathname.startsWith(`${dashboardBaseUrl}/content`); // New active check for Content

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800",
          className
        )}
        {...props}
      >
        <SidebarHeader isMobile={isMobile} sidebarOpen={sidebarOpen} onCloseClick={onCloseClick} isAdmin={isAdmin}>
        </SidebarHeader>
        <SidebarContent>
          {isAdmin ? (
            <AdminSidebar onCloseClick={onCloseClick} />
          ) : (
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

                  <CollapsibleSidebarNav title="Channel" icon={<Monitor />} active={isChannelActive}>
                    <Link href={`${dashboardBaseUrl}/channel/stream-info`} passHref>
                      <SidebarNavItem icon={<Info />} active={pathname === `${dashboardBaseUrl}/channel/stream-info`}>
                        Stream Info
                      </SidebarNavItem>
                    </Link>
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
                  </CollapsibleSidebarNav>

                  {/* New CollapsibleSidebarNav for Content */}
                  <CollapsibleSidebarNav title="Content" icon={<Video />} active={isContentActive}>
                    <Link href={`${dashboardBaseUrl}/content/vods`} passHref>
                      <SidebarNavItem icon={<Video />} active={pathname === `${dashboardBaseUrl}/content/vods`}>
                        VODs
                      </SidebarNavItem>
                    </Link>
                    {/* Add other content sub-items here if needed */}
                  </CollapsibleSidebarNav>

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
                  <Link href="/browse" passHref>
                    <SidebarNavItem icon={<Video />} active={pathname === "/browse"}>
                      Browse
                    </SidebarNavItem>
                  </Link>
                  
                  {/* Separator with increased vertical margin */}
                  <div className="my-6 border-b border-gray-700 mx-3" /> 

                  {/* Following Streamers List */}
                  <FollowingStreamersSidebar />
                </>
              )}
            </SidebarNav>
          )}
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
  isAdmin?: boolean;
}

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  SidebarHeaderProps
>(({ className, isMobile, sidebarOpen, onCloseClick, isAdmin = false, ...props }, ref) => (
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
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold text-green-500">{isAdmin ? "ADMIN" : "STREAMER"}</div>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{isAdmin ? "PANEL" : "BETA"}</span>
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