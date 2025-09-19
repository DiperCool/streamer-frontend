"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  useGetMeQuery,
  useReadAllNotificationsMutation,
  NotificationDto,
  GetNotificationsDocument, // Import the document for cache updates
} from "@/graphql/__generated__/graphql";
import { getMinioUrl } from "@/utils/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { useApolloClient } from "@apollo/client";

const INITIAL_DISPLAY_COUNT = 10; // Initial number of notifications to display
const ITEMS_PER_LOAD = 5; // Number of additional notifications to load

export const NotificationPopover: React.FC = () => {
  const [open, setOpen] = useState(false);
  const client = useApolloClient();
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  const { data: meData, refetch: refetchMe } = useGetMeQuery();
  const hasUnreadNotifications = meData?.me?.hasUnreadNotifications ?? false;

  const {
    data,
    loading,
    error,
    fetchMore,
    networkStatus,
  } = useGetNotificationsQuery({
    variables: {
      first: displayCount,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [readNotificationMutation, { loading: readingSingleNotification }] = useReadNotificationMutation();
  const [readAllNotificationsMutation, { loading: markingAllAsRead }] = useReadAllNotificationsMutation();


  const notifications = data?.notifications?.nodes || [];
  const hasNextPage = data?.notifications?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3; // networkStatus 3 means fetching more

  // Subscription for new notifications
  useNotificationCreatedSubscription({
    onData: ({ data: subscriptionData }) => {
      const newNotification = subscriptionData.data?.notificationCreated;
      if (newNotification) {
        // Update cache to add the new notification
        client.cache.updateQuery(
          {
            query: GetNotificationsDocument,
            variables: { first: displayCount, after: data?.notifications?.pageInfo.endCursor },
          },
          (prev) => {
            if (!prev || !prev.notifications) {
              return prev;
            }

            const newNotificationNode: NotificationDto = {
              __typename: 'NotificationDto',
              ...newNotification,
              streamer: newNotification.streamer ? {
                __typename: 'StreamerDto',
                id: newNotification.streamer.id,
                userName: newNotification.streamer.userName,
                avatar: newNotification.streamer.avatar,
                isLive: newNotification.streamer.isLive,
              } : null,
            };

            // Add new notification to the beginning of the list (most recent)
            const updatedNodes = [newNotificationNode, ...(prev.notifications.nodes || [])];
            // Removed 'edges' update as it's not queried
            // const updatedEdges = [{
            //     __typename: 'NotificationsEdge',
            //     cursor: btoa(newNotificationNode.createdAt.toString()),
            //     node: newNotificationNode,
            // }, ...(prev.notifications.edges || [])];

            return {
              ...prev,
              notifications: {
                ...prev.notifications,
                nodes: updatedNodes,
                // edges: updatedEdges, // Removed 'edges' update
                pageInfo: {
                  ...prev.notifications.pageInfo,
                  // startCursor: updatedEdges[0]?.cursor || prev.notifications.pageInfo.startCursor, // Removed 'edges' related update
                  hasPreviousPage: true,
                },
              },
            };
          }
        );
        refetchMe(); // Refetch 'me' query to update the bell icon immediately
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

      // Update cache for the specific notification
      client.cache.modify({
        id: client.cache.identify({ __typename: 'NotificationDto', id: notificationId }),
        fields: {
          seen() {
            return true;
          },
        },
      });

      // Update cache for hasUnreadNotifications on the 'me' object
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
      toast.success("Notification marked as read!");
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
        // Update cache for all notifications
        notifications.forEach(n => {
          if (!n.seen) {
            client.cache.modify({
              id: client.cache.identify(n),
              fields: {
                seen() {
                  return true;
                },
              },
            });
          }
        });

        // Update cache for hasUnreadNotifications on the 'me' object
        client.cache.modify({
          id: client.cache.identify(meData?.me!),
          fields: {
            hasUnreadNotifications() {
              return false;
            },
          },
        });
        toast.success("All notifications marked as read!");
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const handleLoadMore = async () => {
    if (!hasNextPage || isLoadingMore) return;

    try {
      await fetchMore({
        variables: {
          first: ITEMS_PER_LOAD,
          after: data?.notifications?.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.notifications?.nodes) {
            return prev;
          }
          return {
            ...prev,
            notifications: {
              ...fetchMoreResult.notifications,
              nodes: [...(prev.notifications?.nodes ?? []), ...(fetchMoreResult.notifications.nodes)],
              // Removed 'edges' update as it's not queried
              // edges: [...(prev.notifications?.edges ?? []), ...(fetchMoreResult.notifications.edges)],
            },
          };
        },
      });
      setDisplayCount(prev => prev + ITEMS_PER_LOAD);
    } catch (error) {
      console.error("Error loading more notifications:", error);
      toast.error("Failed to load more notifications.");
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.seen).length;

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
              disabled={markingAllAsRead || unreadNotificationsCount === 0}
              className="text-green-500 hover:text-green-400"
            >
              {markingAllAsRead ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Mark all as read"}
            </Button>
          )}
        </div>
        <ScrollArea className="h-72">
          {loading && networkStatus === 1 ? ( // Only show initial loading spinner
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
                const streamer = notification.streamer;

                let notificationMessage: React.ReactNode;
                let notificationLink: string | undefined;
                let avatarSrc: string | undefined;
                let avatarFallback: string | undefined;

                switch (notification.discriminator) {
                  case "LiveStartedNotification":
                    notificationMessage = (
                      <>
                        <span className="font-semibold text-green-400">{streamer?.userName}</span> started a live stream!
                      </>
                    );
                    notificationLink = `/${streamer?.userName}`;
                    avatarSrc = getMinioUrl(streamer?.avatar!);
                    avatarFallback = streamer?.userName?.charAt(0).toUpperCase() || "U";
                    break;
                  case "UserFollowedNotification":
                    notificationMessage = (
                      <>
                        <span className="font-semibold text-green-400">{streamer?.userName || "Unknown user"}</span> followed you!
                      </>
                    );
                    notificationLink = `/${streamer?.userName}`;
                    avatarSrc = getMinioUrl(streamer?.avatar!);
                    avatarFallback = streamer?.userName?.charAt(0).toUpperCase() || "U";
                    break;
                  default:
                    notificationMessage = "Unknown notification type.";
                    break;
                }

                const notificationContent = (
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
                      <AvatarImage src={avatarSrc} alt={avatarFallback || "User"} />
                      <AvatarFallback className="bg-green-600 text-white text-sm">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                      <p className="text-sm text-white">{notificationMessage}</p>
                      <span className="text-xs text-gray-400">{timeAgo}</span>
                    </div>
                  </div>
                );

                return notificationLink ? (
                  <Link href={notificationLink} key={notification.id} passHref>
                    {notificationContent}
                  </Link>
                ) : (
                  <div key={notification.id}>
                    {notificationContent}
                  </div>
                );
              })}
              {hasNextPage && (
                <div className="flex justify-center p-3">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    variant="ghost"
                    className="text-green-500 hover:bg-gray-700 hover:text-green-400"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};