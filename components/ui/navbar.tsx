"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"
import { useGetMeQuery } from "@/graphql/__generated__/graphql" // Импортируем useGetMeQuery
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu" // Импортируем компоненты DropdownMenu
import { useRouter } from "next/navigation" // Импортируем useRouter для навигации

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  onMenuClick?: () => void
}

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
    ({ className, onMenuClick, ...props }, ref) => {
      const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0()
      const { data: streamerData, loading: streamerLoading } = useGetMeQuery({
        skip: !isAuthenticated, // Пропускаем запрос, если пользователь не аутентифицирован
      });
      const router = useRouter();

      const userName = streamerData?.me?.userName;

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
                  "fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6",
                  className
              )}
              {...props}
          >
            <div className="flex items-center space-x-4">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMenuClick}
                  className="text-gray-300 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Search"
                    className="w-96 bg-gray-800 border-gray-700 pl-10 text-white placeholder:text-gray-400 focus:border-green-500"
                />
              </div>
            </div>

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
                    {streamerLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                    ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-gray-300 hover:text-white cursor-pointer">
                              {userName || "My Account"} {/* Отображаем userName или 'My Account' */}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48 bg-gray-700 border-gray-600 text-white">
                            <DropdownMenuItem onClick={() => router.push(`/settings/profile`)} className="cursor-pointer">
                              Settings
                            </DropdownMenuItem>
                            {userName && (
                                <DropdownMenuItem onClick={() => router.push(`/${userName}`)} className="cursor-pointer">
                                  Channel
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 hover:bg-red-600 hover:text-white">
                              Log Out
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