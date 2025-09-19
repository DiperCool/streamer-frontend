"use client";

import React, { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useNotificationCreatedSubscription,
  LiveStartedNotificationDto,
  UserFollowedNotificationDto, // Import the new notification type
  useGetMeQuery,
  useReadAllNotificationsMutation,
} from "@/graphql/__generated__/graphql";
import { getMinioUrl } from "@/utils/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { useApolloClient } from "@apollo/client";

interface NotificationPopoverProps {
  // refetchMe больше не нужен, так как мы будем обновлять состояние напрямую
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = () => {
  const [open, setOpen] = useState(false);
  const client = useApolloClient();

  const { data: meData, refetch: refetchMe } = useGetMeQuery();
  const hasUnreadNotifications = meData?.me?.hasUnreadNotifications ?? false;

  const { data, loading, error, refetch } = useGetNotificationsQuery();
  const [readNotificationMutation, { loading: markingAsRead }] = useReadNotificationMutation();
  const [readAllNotificationsMutation, { loading: markingAllAsRead }] = useReadAllNotificationsMutation();

  const notifications = data?.notifications?.nodes || [];
  const unreadNotifications = notifications.filter(n => !n.seen);

  // Подписка на новые уведомления
  useNotificationCreatedSubscription({
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData.data?.notificationCreated) {
        refetch();
        refetchMe(); // Keep refetchMe here to update the bell icon immediately on new notification
        toast.info("You have a new notification!");
      }
    },
  });

  // Function to handle marking a single notification as read
  const handleReadSingleNotification = async (notificationId: string) => {
    try {
      const { data: result } = await readNotificationMutation({
        variables: {
          readNotification: {
            id: notificationId,
          },
        },
      });
      if (result?.readNotification) {
        client.cache.modify({
          id: client.cache.identify(meData?.me!),
          fields: {
            hasUnreadNotifications() {
              return result.readNotification.hasUnreadNotifications;
            },
          },
        });
      }
      refetch(); // Refetch to update the list in the popover
    } catch (err) {
      console.error("Error marking single notification as read:", err);
      toast.error("Failed to mark notification as read.");
    }
  };

  // Function to handle marking all notifications as read
  const handleReadAllNotifications = async () => {
    try {
      const { data: result } = await readAllNotificationsMutation();
      if (result?.readAllNotifications.result) {
        client.cache.modify({
          id: client.cache.identify(meData?.me!),
          fields: {
            hasUnreadNotifications() {
              return false; // All notifications are read, so set to false
            },
          },
        });
        refetch(); // Refetch to update the list in the popover
        toast.success("All notifications marked as read!");
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast.error("Failed to mark all notifications as read.");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white">
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-900" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-800 border-gray-700 text-white" align="end">
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReadAllNotifications}
              disabled={markingAllAsRead || unreadNotifications.length === 0}
              className="text-green-500 hover:text-green-400"
            >
              {markingAllAsRead ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Mark all as read"}
            </Button>
          )}
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
                const timeAgo = formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true });

                if (notification.__typename === "LiveStartedNotificationDto") {
                  const liveNotification = notification as LiveStartedNotificationDto;
                  const streamer = liveNotification.streamer;

                  return (
                    <Link href={`/${streamer?.userName}`} key={notification.id} passHref>
                      <div
                        className={cn(
                          "flex items-center space-x-3 p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors",
                          !notification.seen && "bg-blue-900/20"
                        )}
                        onClick={() => {
                          setOpen(false);
                          if (!notification.seen) {
                            handleReadSingleNotification(notification.id);
                          }
                        }}
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
                } else if (notification.__typename === "UserFollowedNotificationDto") {
                  const followedNotification = notification as UserFollowedNotificationDto;
                  // Согласно текущей схеме, у UserFollowedNotificationDto есть только поле 'streamer',
                  // которое представляет канал, на который подписались (т.е. ваш канал).
                  // Информация о том, кто подписался (follower), отсутствует.
                  const followedStreamer = followedNotification.streamer; 

                  return (
                    <div // Нет ссылки, так как нет информации о подписчике для перехода
                      key={notification.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors",
                        !notification.seen && "bg-blue-900/20"
                      )}
                      onClick={() => {
                        setOpen(false);
                        if (!notification.seen) {
                          handleReadSingleNotification(notification.id);
                        }
                      }}
                    >
                      <Avatar className="w-9 h-9">
                        {/* Используем аватар канала, на который подписались, или заглушку */}
                        <AvatarImage src={getMinioUrl(followedStreamer?.avatar!)} alt={followedStreamer?.userName || "Channel"} />
                        <AvatarFallback className="bg-green-600 text-white text-sm">
                          {followedStreamer?.userName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1">
                        <p className="text-sm text-white">
                          Ваш канал был подписан! {/* Упрощенное сообщение из-за ограничений схемы */}
                        </p>
                        <span className="text-xs text-gray-400">{timeAgo}</span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={notification.id} className={cn("p-3 border-b border-gray-700 text-sm text-gray-400", !notification.seen && "bg-blue-900/20")}>
                    Неизвестный тип уведомления.
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