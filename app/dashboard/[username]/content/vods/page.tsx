"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/alert-dialog"
import { Loader2, Edit, Trash2, Search, Video, EyeOff, Eye } from "lucide-react"
import {
  useGetVodsQuery,
  useRemoveVodMutation,
  SortEnumType,
  VodType,
} from "@/graphql/__generated__/graphql"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "sonner"
import Image from "next/image"
import { getMinioUrl, formatVodDuration } from "@/utils/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDashboard } from "@/src/contexts/DashboardContext"
import { EditVodDialog } from "@/src/components/dashboard/vods/edit-vod-dialog"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNowStrict } from "date-fns"

export default function DashboardVodsPage() {
  const { activeStreamer, activeStreamerPermissions } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [editVodId, setEditVodId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: vodsData,
    loading: vodsLoading,
    error: vodsError,
    fetchMore,
    networkStatus,
    refetch: refetchVods,
  } = useGetVodsQuery({
    variables: {
      streamerId: streamerId,
      first: 10,
      search: debouncedSearchTerm,
      order: [{ createdAt: SortEnumType.Desc }],
    },
    skip: !streamerId,
    notifyOnNetworkStatusChange: true,
  });

  const [removeVodMutation, { loading: removeLoading }] = useRemoveVodMutation();

  const handleRemoveVod = async (vodId: string) => {
    try {
      await removeVodMutation({
        variables: {
          request: {
            id: vodId,
          },
        },
      });
      refetchVods();
      toast.success("VOD removed successfully!");
    } catch (error: any) {
      console.error("Error removing VOD:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to remove VOD. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleLoadMore = async () => {
    if (!vodsData?.vods?.pageInfo.hasNextPage || networkStatus === 3) return;

    try {
      await fetchMore({
        variables: {
          after: vodsData.vods.pageInfo.endCursor,
          first: 10,
          search: debouncedSearchTerm,
          order: [{ createdAt: SortEnumType.Desc }],
          streamerId: streamerId,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.vods?.nodes) {
            return prev;
          }
          return {
            ...prev,
            vods: {
              ...fetchMoreResult.vods,
              nodes: [...(prev.vods?.nodes ?? []), ...(fetchMoreResult.vods.nodes)],
            },
          };
        },
      });
    } catch (error) {
      console.error("Error loading more VODs:", error);
      toast.error("Failed to load more VODs.");
    }
  };

  const vods = vodsData?.vods?.nodes || [];
  const hasNextPage = vodsData?.vods?.pageInfo.hasNextPage;
  const isLoadingMore = networkStatus === 3;
  const canManageVods = activeStreamerPermissions?.isAll || activeStreamerPermissions?.isVod;

  if (!streamerId) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-gray-400">
        Select a channel to manage VODs.
      </div>
    );
  }

  if (vodsLoading && networkStatus === 1) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (vodsError) {
    return <div className="text-red-500">Error loading VODs: {vodsError.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">VODs Management</h2>
        {/* <Button
          onClick={() => {}} // Placeholder for Create New VOD dialog
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Create New VOD
        </Button> */}
      </div>

      {editVodId && (
        <EditVodDialog
          vodId={editVodId}
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setEditVodId(null);
          }}
          refetchVods={refetchVods}
        />
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All VODs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search VODs..."
              className="w-full bg-gray-700 border-gray-600 pl-10 text-white placeholder:text-gray-400 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {vods.length === 0 && !vodsLoading ? (
            <p className="text-gray-400">No VODs found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Preview</TableHead>
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Views</TableHead>
                  <TableHead className="text-gray-300">Duration</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Uploaded</TableHead>
                  {canManageVods && <TableHead className="text-right text-gray-300">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {vods.map((vod) => (
                  <TableRow key={vod.id} className="border-gray-700 hover:bg-gray-700">
                    <TableCell>
                      <Avatar className="w-20 h-12 rounded-md">
                        <AvatarImage src={getMinioUrl(vod.preview!)} alt={vod.title || "VOD Preview"} />
                        <AvatarFallback className="bg-gray-600 text-white text-sm">
                          <Video className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-white">{vod.title || "Untitled VOD"}</TableCell>
                    <TableCell className="text-gray-300">{vod.category?.title || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">{vod.views}</TableCell>
                    <TableCell className="text-gray-300">{formatVodDuration(vod.duration)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        vod.type === VodType.Public ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"
                      }`}>
                        {vod.type === VodType.Public ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {vod.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{formatDistanceToNowStrict(new Date(vod.createdAt), { addSuffix: true })}</TableCell>
                    {canManageVods && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-green-500"
                            onClick={() => {
                              setEditVodId(vod.id);
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
                                  Are you sure you want to remove this VOD?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  This action cannot be undone. The VOD "
                                  <span className="font-semibold text-white">
                                    {vod.title}
                                  </span>" will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveVod(vod.id)}
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
                    )}
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