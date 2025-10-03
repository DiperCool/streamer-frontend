"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: // Existing secondary variant, will be replaced by more specific ones where needed
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // New variants based on user request and existing usage
        statusLive: "border-transparent bg-red-600 text-white", // For 'LIVE' status
        statusOffline: "border-transparent bg-gray-600 text-gray-300", // For 'OFFLINE' status
        statusCurrentStream: "border-transparent bg-purple-600 text-white", // For 'Current Stream' status
        infoViewers: "border-transparent bg-black/70 text-white", // For viewer counts, duration
        infoFollowers: "border-transparent bg-gray-700 text-white hover:bg-green-600 hover:text-white", // For follower counts
        itemCategory: "border-transparent bg-green-600 text-white hover:bg-green-700", // For category items
        itemLanguage: "border-transparent bg-gray-700 text-white hover:bg-green-600 hover:text-white", // For language tags
        itemTag: "border-transparent bg-gray-700 text-white hover:bg-green-600 hover:text-white", // For general tags
        vodPublic: "border-transparent bg-green-600 text-white", // For public VOD type
        vodPrivate: "border-transparent bg-gray-600 text-gray-300", // For private VOD type
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }