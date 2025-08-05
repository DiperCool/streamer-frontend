"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search } from "lucide-react"

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  onMenuClick?: () => void
}

const Navbar = React.forwardRef<HTMLDivElement, NavbarProps>(
  ({ className, onMenuClick, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6",
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
        <Button variant="ghost" className="text-gray-300 hover:text-white">
          Log In
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Sign Up
        </Button>
      </div>
    </div>
  )
)
Navbar.displayName = "Navbar"

export { Navbar }