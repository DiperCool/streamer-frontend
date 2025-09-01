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
import { useGetMeQuery } from "@/graphql/__generated__/graphql";

interface ActiveStreamer {
  id: string;
  userName: string;
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

  const otherChannels = React.useMemo(() => {
    if (!meData) return [];
    return myRoles.filter(
      (role) => role.broadcasterId !== activeStreamer?.id && role.broadcaster
    );
  }, [myRoles, activeStreamer, meData]);

  if (!activeStreamer || !meData) {
    return null; // Or a loading spinner/placeholder
  }

  const avatarImage = activeStreamer.avatar || meData.avatar || "/placeholder-user.jpg"; // Use activeStreamer's avatar if available, otherwise meData's

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
        {otherChannels.length > 0 && (
          <>
            <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold text-gray-300">
              Access to other channels
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700 my-1" />
            {otherChannels.map((role) => (
              role.broadcaster && (
                <DropdownMenuItem
                  key={role.broadcaster.id}
                  onClick={() => {
                    setActiveStreamer({
                      id: role.broadcaster!.id,
                      userName: role.broadcaster!.userName || "Unknown",
                    });
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 px-2 py-1.5 cursor-pointer hover:bg-green-600 hover:text-white"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={getMinioUrl(role.broadcaster.avatar!)} alt="Channel Avatar" />
                    <AvatarFallback className="bg-gray-600 text-white text-xs">
                      {role.broadcaster.userName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{role.broadcaster.userName}</span>
                  {/* Mute icon from screenshot is omitted as it's not part of core functionality */}
                </DropdownMenuItem>
              )
            ))}
            <DropdownMenuSeparator className="bg-gray-700 my-1" />
          </>
        )}
        {/* Option to switch back to own channel if not currently active */}
        {activeStreamer.id !== meData.id && (
          <DropdownMenuItem
            onClick={() => {
              setActiveStreamer({
                id: meData.id,
                userName: meData.userName || "my-channel",
              });
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-2 py-1.5 cursor-pointer hover:bg-green-600 hover:text-white"
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={getMinioUrl(meData.avatar!)} alt="My Channel Avatar" />
              <AvatarFallback className="bg-green-600 text-white text-xs">
                {meData.userName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{meData.userName} (My Channel)</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};