"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getMinioUrl } from "@/utils/utils";
import { RoleDto, StreamerMeDto } from "@/graphql/__generated__/graphql";
import { useRouter } from "next/navigation"; // Импортируем useRouter

interface ActiveStreamer {
  id: string;
  userName: string;
  avatar?: string | null; // Обновлено для согласованности
}

interface BroadcasterSwitcherProps {
  activeStreamer: ActiveStreamer | null;
  setActiveStreamer: (streamer: ActiveStreamer) => void;
  myRoles: RoleDto[];
  meData: StreamerMeDto | undefined;
}

export const BroadcasterSwitcher: React.FC<BroadcasterSwitcherProps> = ({
  activeStreamer,
  setActiveStreamer,
  myRoles,
  meData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Инициализируем useRouter

  const currentStreamerRole = React.useMemo(() => {
    if (!activeStreamer || !meData) return null;

    if (activeStreamer.id === meData.id) {
      return "Broadcaster"; // Current user is the broadcaster of their own channel
    }

    const role = myRoles.find(
      (r) => r.broadcasterId === activeStreamer.id && r.streamerId === meData.id
    );
    return role ? role.type : null;
  }, [activeStreamer, myRoles, meData]);

  const allAvailableChannels = React.useMemo(() => {
    const channels: Array<{ id: string; userName: string; avatar?: string | null; roleType?: string }> = [];

    // Add current user's own channel
    if (meData) {
        channels.push({
            id: meData.id,
            userName: meData.userName || "my-channel",
            avatar: meData.avatar,
            roleType: "Broadcaster",
        });
    }

    // Add other channels from roles
    myRoles.forEach(role => {
        if (role.broadcaster) {
            channels.push({
                id: role.broadcaster.id,
                userName: role.broadcaster.userName || "Unknown",
                avatar: role.broadcaster.avatar,
                roleType: role.type,
            });
        }
    });

    // Filter out duplicates if a user is a broadcaster of their own channel AND has a role for it
    const uniqueChannels = Array.from(new Map(channels.map(item => [item.id, item])).values());
    return uniqueChannels;
  }, [meData, myRoles]);

  if (!activeStreamer || !meData) {
    return null; // Or a loading spinner/placeholder
  }

  const avatarImage = activeStreamer.avatar || meData.avatar || "/placeholder-user.jpg";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-800 transition-colors">
          <Avatar className="w-8 h-8">
            <AvatarImage src={getMinioUrl(avatarImage)} alt="Broadcaster Avatar" />
            <AvatarFallback className="bg-green-600 text-white text-sm">
              {activeStreamer.userName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-white font-semibold text-sm">{activeStreamer.userName}</span>
            {currentStreamerRole && (
              <span className="text-gray-400 text-xs">{currentStreamerRole}</span>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-gray-800 border-gray-700 text-white p-1">
        <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold text-gray-300">
          Switch Channel
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700 my-1" />
        {allAvailableChannels.map((channel) => {
            const isActive = activeStreamer?.id === channel.id;
            return (
                <DropdownMenuItem
                    key={channel.id}
                    onClick={() => {
                        if (!isActive) { // Only switch if not already active
                            setActiveStreamer({
                                id: channel.id,
                                userName: channel.userName,
                                avatar: channel.avatar,
                            });
                            setIsOpen(false);
                            // Перенаправляем на базовый маршрут дашборда после смены активного стримера
                            router.push(`/dashboard`); 
                        }
                    }}
                    className={cn(
                        "flex items-center space-x-2 px-2 py-1.5 cursor-pointer",
                        isActive
                            ? "bg-gray-700 text-white cursor-default" // Active style
                            : "hover:bg-green-600 hover:text-white" // Inactive style
                    )}
                    disabled={isActive} // Disable interaction for the active item
                >
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={getMinioUrl(channel.avatar!)} alt="Channel Avatar" />
                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                            {channel.userName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <span className="text-sm">{channel.userName}</span>
                        {channel.roleType && (
                            <span className="text-gray-400 text-xs">{channel.roleType}</span>
                        )}
                    </div>
                </DropdownMenuItem>
            );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};