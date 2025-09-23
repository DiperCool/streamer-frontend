"use client"

import React from "react"
import { Users, Video, List } from "lucide-react" // Удален Home
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNav, SidebarNavItem } from "@/components/ui/sidebar"

interface AdminSidebarProps {
  onCloseClick: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseClick }) => {
  const pathname = usePathname();

  return (
    <SidebarNav>
      {/* Удален Link и SidebarNavItem для Admin Home */}
      <Link href="/admins/streamers" passHref>
        <SidebarNavItem icon={<Users />} active={pathname.startsWith("/admins/streamers")}>
          Streamers
        </SidebarNavItem>
      </Link>
      {/* Удален Link и SidebarNavItem для Vods */}
      <Link href="/admins/categories" passHref>
        <SidebarNavItem icon={<List />} active={pathname.startsWith("/admins/categories")}>
          Categories
        </SidebarNavItem>
      </Link>
    </SidebarNav>
  )
}