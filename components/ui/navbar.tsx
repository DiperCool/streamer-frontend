"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  onMenuClick?: () => void
}

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
    ({ className, onMenuClick, ...props }, ref) => {
      const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0()

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
                  className="text-gray-300 hover:text-white lg:hidden"
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
                    <span className="text-gray-300">{user?.name}</span>
                    <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white"
                        onClick={async ()=>{
                          await logout({
                            logoutParams: {
                              returnTo: typeof window !== "undefined" ? window.location.origin : "/",
                            },
                          });
                        }}
                    >
                      Log Out
                    </Button>
                  </>
              )}
            </div>
          </div>
      )
    }
)
Navbar.displayName = "Navbar"

export { Navbar }