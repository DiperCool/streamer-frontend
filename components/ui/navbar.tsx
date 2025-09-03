"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search, Sparkles, Store, Settings, LogOut, LayoutDashboard } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"
import { useGetMeQuery } from "@/graphql/__generated__/graphql"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMinioUrl } from "@/utils/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDashboard } from "@/src/contexts/DashboardContext"
import { BroadcasterSwitcher } from "@/src/components/broadcaster-switcher"
import { StreamerSearchPopover } from "@/src/components/streamer-search-popover"; // Import the new component

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  onMenuClick?: () => void;
  isMobile: boolean;
  sidebarOpen: boolean;
  isDashboard: boolean;
}

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
    ({ className, onMenuClick, isMobile, sidebarOpen, isDashboard, ...props }, ref) => {
      const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0()
      const { data: meData, loading: meLoading } = useGetMeQuery({
        skip: !isAuthenticated,
      });
      const router = useRouter();
      const { activeStreamer, setActiveStreamer, myRoles, myRolesLoading, currentAuthUserStreamer } = useDashboard();

      const userName = meData?.me?.userName;
      const userAvatar = meData?.me?.avatar;

      const handleLogout = async () => {
        await logout({
          logoutParams: {
            returnTo: typeof window !== "undefined" ? window.location.origin : "/",
          },
        });
      };

      return (
          <div
              ref={ref}
              className={cn(
                  "fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6",
                  className
              )}
              {...props}
          >
            {/* Left Section: Menu, Logo, and Broadcaster Switcher (if dashboard) */}
            <div className="flex items-center space-x-4">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMenuClick}
                  className="text-gray-300 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
              {!isMobile && (
                <div className="flex items-center space-x-2">
                  <div className="text-xl font-bold text-green-500">STREAMER</div>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">BETA</span>
                </div>
              )}
              {/* Broadcaster Switcher for Dashboard */}
              {!isMobile && isAuthenticated && activeStreamer && currentAuthUserStreamer && isDashboard && (
                <BroadcasterSwitcher
                  activeStreamer={activeStreamer}
                  setActiveStreamer={setActiveStreamer}
                  myRoles={myRoles}
                />
              )}
            </div>

            {/* Center Section: Search Input (if not dashboard) */}
            <div className="flex-1 flex justify-center">
              {!isMobile && !isDashboard && (
                <StreamerSearchPopover>
                  <Button
                    variant="outline"
                    className="w-96 bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white justify-start"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    <span>Search streamers...</span>
                  </Button>
                </StreamerSearchPopover>
              )}
            </div>

            {/* Right Section: Auth Buttons / User Dropdown */}
            <div className="flex items-center space-x-4">
              {!isLoading && !isAuthenticated && (
                  <>
                    <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white"
                        onClick={() => loginWithRedirect()}
                    >
                      Log In
                    </Button>
                    <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                            loginWithRedirect({
                              authorizationParams: {
                                screen_hint: "signup",
                              },
                            })
                        }
                    >
                      Sign Up
                    </Button>
                  </>
              )}
              {!isLoading && isAuthenticated && (
                  <>
                    {meLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                    ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-gray-300 hover:text-white cursor-pointer p-0 h-auto w-auto rounded-full">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={getMinioUrl(userAvatar!)} alt="User Avatar" />
                                <AvatarFallback className="bg-green-600 text-white text-sm">
                                  {userName?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className={cn(
                              "bg-gray-800 border-gray-700 text-white p-1",
                              "w-56"
                            )}
                          >
                            {userName && (
                              <>
                                <DropdownMenuLabel className="flex items-center space-x-2 px-2 py-1.5 text-base font-semibold text-white">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={getMinioUrl(userAvatar!)} alt="User Avatar" />
                                    <AvatarFallback className="bg-green-600 text-white text-sm">
                                      {userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{userName}</span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-700 my-1" />
                              </>
                            )}
                            <DropdownMenuItem onClick={() => router.push(`/${userName}`)} className="cursor-pointer flex items-center text-gray-300 hover:bg-green-600 hover:text-white">
                              <Store className="h-4 w-4 mr-2" /> Channel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/${currentAuthUserStreamer?.userName || userName}`)} className="cursor-pointer flex items-center text-gray-300 hover:bg-green-600 hover:text-white">
                              <LayoutDashboard className="h-4 w-4 mr-2" /> Creator Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Subscriptions clicked')} className="cursor-pointer flex items-center text-gray-300 hover:bg-green-600 hover:text-white">
                              <Sparkles className="h-4 w-4 mr-2" /> Subscriptions
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/settings/profile`)} className="cursor-pointer flex items-center text-gray-300 hover:bg-green-600 hover:text-white">
                              <Settings className="h-4 w-4 mr-2" /> Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700 my-1" />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center text-red-400 hover:bg-red-600 hover:text-white">
                              <LogOut className="h-4 w-4 mr-2" /> Log Out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                  </>
              )}
            </div>
          </div>
      )
    }
)
Navbar.displayName = "Navbar"

export { Navbar }