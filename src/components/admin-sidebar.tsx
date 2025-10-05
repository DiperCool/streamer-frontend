"use client"

import React from "react"
import { Users, Video, List, Bot } from "lucide-react" // Добавлен импорт Bot
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
      <Link href="/admins/streamers" passHref>
        <SidebarNavItem icon={<Users />} active={pathname.startsWith("/admins/streamers")}>
          Streamers
        </SidebarNavItem>
      </Link>
      <Link href="/admins/categories" passHref>
        <SidebarNavItem icon={<List />} active={pathname.startsWith("/admins/categories")}>
          Categories
        </SidebarNavItem>
      </Link>
      <Link href="/admins/bots" passHref> {/* Новый пункт меню для ботов */}
        <SidebarNavItem icon={<Bot />} active={pathname.startsWith("/admins/bots")}>
          Bots
        </SidebarNavItem>
      </Link>
    </SidebarNav>
  )
}