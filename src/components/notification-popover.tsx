"use client";

import React, { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetNotificationsQuery, useReadNotificationsMutation, LiveStartedNotificationDto } from "@/graphql/__generated__/graphql";
import { getMinioUrl } from "@/utils/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const NotificationPopover: React.FC = () => {
  const [open, setOpen] = useState(false);

  const { data, loading, error, refetch } = useGetNotificationsQuery();
  const [readNotificationsMutation, { loading: markingAsRead }] = useReadNotificationsMutation({
    onCompleted: () => refetch(), // Refetch notifications after marking as read
  });

  const notifications = data?.notifications?.nodes || [];
  const unreadCount = notifications.filter(n => !n.seen).length;

  useEffect(() => {
    if (open && unreadCount > 0 && !markingAsRead) {
      readNotificationsMutation();
    }
  }, [open, unreadCount, markingAsRead, readNotificationsMutation]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 rounded-full bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-800 border-gray-700 text-white" align="end">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <ScrollArea className="h-72">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">Error loading notifications: {error.message}</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-gray-400 text-center">No new notifications.</div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => {
                // Используем __typename вместо discriminator
                if (notification.__typename === "LiveStartedNotificationDto") {
                  const liveNotification = notification as LiveStartedNotificationDto;
                  const streamer = liveNotification.streamer;
                  const timeAgo = formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true });

                  return (
                    <Link href={`/${streamer?.userName}`} key={notification.id} passHref>
                      <div
                        className={cn(
                          "flex items-center space-x-3 p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors",
                          !notification.seen && "bg-blue-900/20"
                        )}
                        onClick={() => setOpen(false)} // Close popover on click
                      >
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={getMinioUrl(streamer?.avatar!)} alt={streamer?.userName || "Streamer"} />
                          <AvatarFallback className="bg-green-600 text-white text-sm">
                            {streamer?.userName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                          <p className="text-sm text-white">
                            <span className="font-semibold text-green-400">{streamer?.userName}</span> started a live stream!
                          </p>
                          <span className="text-xs text-gray-400">{timeAgo}</span>
                        </div>
                      </div>
                    </Link>
                  );
                }
                // Fallback for other notification types if needed
                return (
                  <div key={notification.id} className={cn("p-3 border-b border-gray-700 text-sm text-gray-400", !notification.seen && "bg-blue-900/20")}>
                    Unknown notification type.
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};