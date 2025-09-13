"use client";

import React from "react";
import {
  useGetBannedUsersQuery,
  SortEnumType,
  BannedUserDto,
  useUserUnbannedSubscription,
  useUserBannedSubscription,
  useUnbanUserMutation, // Импортируем useUnbanUserMutation
} from "@/graphql/__generated__/graphql";
import { useDashboard } from "@/src/contexts/DashboardContext";
import { Loader2, UserX, Ban, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMinioUrl } from "@/utils/utils";
import { format, isPast } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// Удаляем импорт useBanUserMutation, так как он больше не нужен для разбана

export const BannedUsersTab: React.FC = () => {
  const { activeStreamer, activeStreamerPermissions } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";

  const {
    data: bannedUsersData,
    loading: bannedUsersLoading,
    error: bannedUsersError,
    refetch: refetchBannedUsers,
  } = useGetBannedUsersQuery({
    variables: {
      streamerId: streamerId,
      order: [{ bannedAt: SortEnumType.Desc }],
    },
    skip: !streamerId,
  });

  const [unbanUserMutation, { loading: unbanLoading }] = useUnbanUserMutation(); // Используем правильную мутацию

  // Subscription for user banned events
  useUserBannedSubscription({
    variables: {
      broadcasterId: streamerId,
      userId: activeStreamer?.id ?? "", // This should be the user who got banned, not the broadcaster
    },
    skip: !streamerId,
    onData: () => {
      refetchBannedUsers();
      toast.info("A user has been banned.");
    },
  });

  // Subscription for user unbanned events
  useUserUnbannedSubscription({
    variables: {
      broadcasterId: streamerId,
      userId: activeStreamer?.id ?? "", // This should be the user who got unbanned
    },
    skip: !streamerId,
    onData: () => {
      refetchBannedUsers();
      toast.info("A user has been unbanned.");
    },
  });

  const handleUnbanUser = async (userIdToUnban: string) => {
    try {
      await unbanUserMutation({
        variables: {
          request: {
            userId: userIdToUnban,
            broadcasterId: streamerId,
          },
        },
      });
      refetchBannedUsers();
      toast.success("User unbanned successfully!");
    } catch (error: any) {
      console.error("Error unbanning user:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to unban user. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (!activeStreamer) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-400">
        Select a channel to manage banned users.
      </div>
    );
  }

  if (bannedUsersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (bannedUsersError) {
    return (
      <div className="text-red-500">Error loading banned users: {bannedUsersError.message}</div>
    );
  }

  const bannedUsers = bannedUsersData?.bannedUsers?.nodes || [];
  const canManageChat = activeStreamerPermissions?.isAll || activeStreamerPermissions?.isChat;

  if (!canManageChat) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500">
        You do not have permission to manage chat bans.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Banned Users</CardTitle>
        </CardHeader>
        <CardContent>
          {bannedUsers.length === 0 ? (
            <p className="text-gray-400">No users are currently banned.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Reason</TableHead>
                  <TableHead className="text-gray-300">Banned By</TableHead>
                  <TableHead className="text-gray-300">Banned At</TableHead>
                  <TableHead className="text-gray-300">Banned Until</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bannedUsers.map((bannedUser) => {
                  const banExpires = new Date(bannedUser.bannedUntil);
                  const isPermanent = banExpires.getFullYear() > new Date().getFullYear() + 50; // Arbitrary "forever" check
                  const hasExpired = isPast(banExpires) && !isPermanent;

                  return (
                    <TableRow key={bannedUser.id} className="border-gray-700 hover:bg-gray-700">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={getMinioUrl(bannedUser.user?.avatar!)} alt={bannedUser.user?.userName || "User"} />
                            <AvatarFallback className="bg-gray-600 text-white text-sm">
                              {bannedUser.user?.userName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-white">{bannedUser.user?.userName || "Unknown User"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{bannedUser.reason}</TableCell>
                      <TableCell className="text-gray-300">{bannedUser.bannedBy?.userName || "N/A"}</TableCell>
                      <TableCell className="text-gray-300">{format(new Date(bannedUser.bannedAt), "MMM dd, yyyy HH:mm")}</TableCell>
                      <TableCell className="text-gray-300">
                        {isPermanent ? (
                          <span className="text-red-400">Permanent</span>
                        ) : hasExpired ? (
                          <span className="text-green-400">Expired</span>
                        ) : (
                          format(banExpires, "MMM dd, yyyy HH:mm")
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {!hasExpired && ( // Show unban if not expired (even if permanent, as permanent bans can still be manually lifted)
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-green-500"
                                  title="Unban User"
                                  disabled={unbanLoading}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white">
                                    Are you sure you want to unban {bannedUser.user?.userName}?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-400">
                                    This action will immediately lift the ban for{" "}
                                    <span className="font-semibold text-white">
                                      {bannedUser.user?.userName}
                                    </span>.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleUnbanUser(bannedUser.userId)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    disabled={unbanLoading}
                                  >
                                    {unbanLoading ? "Unbanning..." : "Unban"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};