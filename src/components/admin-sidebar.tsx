"use client"

import React from "react"
import { Home, Users, Video, List } from "lucide-react"
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
      <Link href="/admins" passHref>
        <SidebarNavItem icon={<Home />} active={pathname === "/admins"}>
          Admin Home
        </SidebarNavItem>
      </Link>
      <Link href="/admins/streamers" passHref>
        <SidebarNavItem icon={<Users />} active={pathname.startsWith("/admins/streamers")}>
          Streamers
        </SidebarNavItem>
      </Link>
      <Link href="/admins/vods" passHref>
        <SidebarNavItem icon={<Video />} active={pathname.startsWith("/admins/vods")}>
          Vods
        </SidebarNavItem>
      </Link>
      <Link href="/admins/categories" passHref>
        <SidebarNavItem icon={<List />} active={pathname.startsWith("/admins/categories")}>
          Categories
        </SidebarNavItem>
      </Link>
    </SidebarNav>
  )
}