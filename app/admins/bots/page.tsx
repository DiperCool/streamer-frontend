"use client";

import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Plus, Edit, Trash2, Search, Bot as BotIcon } from "lucide-react";
import {
  useGetBotsQuery,
  useRemoveBotMutation,
  SortEnumType,
  BotState,
} from "@/graphql/__generated__/graphql";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMinioUrl } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { CreateBotDialog } from "@/src/components/admin/bots/create-bot-dialog";
import { EditBotDialog } from "@/src/components/admin/bots/edit-bot-dialog";

const ITEMS_PER_PAGE = 10;

export default function AdminBotsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editBotId, setEditBotId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: botsData,
    loading: botsLoading,
    error: botsError,
    fetchMore,
    networkStatus,
    refetch: refetchBots,
  } = useGetBotsQuery({
    variables: {
      first: ITEMS_PER_PAGE,
      search: debouncedSearchTerm,
      order: [{ streamerId: SortEnumType.Asc }], // Default sort by streamer ID
    },
    notifyOnNetworkStatusChange: true,
  });

  const [removeBotMutation, { loading: removeLoading }] = useRemoveBotMutation();

  const handleRemoveBot = async (botId: string) => {
    try {
      await removeBotMutation({
        variables: {
          input: {
            id: botId,
          },
        },
      });
      refetchBots();
      toast.success("Bot removed successfully!");
    } catch (error: any) {
      console.error("Error removing bot:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to remove bot. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleLoadMore = async () => {
    if (!botsData?.bots?.pageInfo.hasNextPage || networkStatus === 3) return;

    try {
      await fetchMore({
        variables: {
          after: botsData.bots.pageInfo.endCursor,
          first: ITEMS_PER_PAGE,
          search: debouncedSearchTerm,
          order: [{ streamerId: SortEnumType.Asc }],
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.bots?.nodes) {
            return prev;
          }
          return {
            ...prev,
            bots: {
              ...fetchMoreResult.bots,
              nodes: [...(prev.bots?.nodes ?? []), ...(fetchMoreResult.bots.nodes)],
            },
          };
        },
      });
    } catch (error) {
      console.error("Error loading more bots:", error);
      toast.error("Failed to load more bots.");
    }
  };

  const bots = botsData?.bots?.nodes || [];
  const hasNextPage = botsData?.bots?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;

  if (botsLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (botsError) {
    return <div className="text-red-500">Error loading bots: {botsError.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Bots Management</h2>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Create New Bot
        </Button>
      </div>

      <CreateBotDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        refetchBots={refetchBots}
      />

      {editBotId && (
        <EditBotDialog
          botId={editBotId}
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setEditBotId(null);
          }}
          refetchBots={refetchBots}
        />
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Bots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search bots by streamer username..."
              className="w-full bg-gray-700 border-gray-600 pl-10 text-white placeholder:text-gray-400 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {bots.length === 0 && !botsLoading ? (
            <p className="text-gray-400">No bots found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Streamer</TableHead>
                  <TableHead className="text-gray-300">Stream Video URL</TableHead>
                  <TableHead className="text-gray-300">State</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.map((bot) => (
                  <TableRow key={bot.id} className="border-gray-700 hover:bg-gray-700">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={getMinioUrl(bot.streamer?.avatar!)} alt={bot.streamer?.userName || "Streamer"} />
                          <AvatarFallback className="bg-gray-600 text-white text-sm">
                            {bot.streamer?.userName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-white">{bot.streamer?.userName || "Unknown Streamer"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 truncate max-w-xs">
                      <a href={bot.streamVideoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                        {bot.streamVideoUrl}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={bot.state === BotState.Active ? "statusLive" : "statusOffline"} className="px-2 py-0.5 rounded-full text-xs font-semibold">
                        {bot.state}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-green-500"
                          onClick={() => {
                            setEditBotId(bot.id);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500"
                              disabled={removeLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Are you sure you want to remove this bot?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                This action cannot be undone. The bot for streamer "
                                <span className="font-semibold text-white">
                                  {bot.streamer?.userName}
                                </span>" will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveBot(bot.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={removeLoading}
                              >
                                {removeLoading ? "Removing..." : "Remove"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoadingMore ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}