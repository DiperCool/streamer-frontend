"use client";

import React, { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Edit } from "lucide-react"; // Added Edit icon
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useDashboard,
} from "@/src/contexts/DashboardContext";
import {
  useGetStreamInfoQuery,
  useUpdateStreamInfoMutation,
  useGetCategoriesQuery,
  CategoryDto,
  SortEnumType,
} from "@/graphql/__generated__/graphql";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { EditStreamInfoDialog } from "./edit-stream-info-dialog"; // Import the new dialog
import { getMinioUrl } from "@/utils/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const StreamInfoWidget: React.FC = () => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for dialog visibility

  const { data: streamInfoData, loading: streamInfoLoading, error: streamInfoError, refetch: refetchStreamInfo } = useGetStreamInfoQuery({
    variables: { streamerId },
    skip: !streamerId,
  });

  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery({
    variables: { order: [{ title: SortEnumType.Asc }] },
  });

  if (streamInfoLoading || categoriesLoading) {
    return (
      <div className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (streamInfoError || categoriesError) {
    return (
      <div className="flex-1 p-3 text-red-500 text-sm flex items-center justify-center">
        Error loading stream info or categories: {streamInfoError?.message || categoriesError?.message}
      </div>
    );
  }

  const streamInfo = streamInfoData?.streamInfo;
  const categories = categoriesData?.categories?.nodes || [];
  const currentCategory = categories.find(cat => cat.id === streamInfo?.categoryId);

  return (
    <div className="flex-1 p-3 flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{streamInfo?.title || "Untitled Stream"}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-5 w-5" />
        </Button>
      </div>

      {/* Category (Image + Title), Language and Tags */}
      <div className="flex items-start space-x-4"> {/* Main container for category block */}
        {currentCategory ? (
          <>
            <Avatar className="h-12 w-12 rounded-md"> {/* Increased size */}
              <AvatarImage src={getMinioUrl(currentCategory.image)} alt={currentCategory.title} />
              <AvatarFallback className="bg-gray-600 text-white text-xs">
                {currentCategory.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1"> {/* Container for title, language, and tags */}
              <span className="text-green-400 text-base font-semibold">{currentCategory.title}</span>
              <div className="flex flex-wrap gap-2 items-center"> {/* Language and Tags */}
                {streamInfo?.language && (
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                    {streamInfo.language}
                  </Badge>
                )}
                {streamInfo?.tags && streamInfo.tags.length > 0 && (
                  streamInfo.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                      {tag.title}
                    </Badge>
                  ))
                )}
                {(!streamInfo?.language && (!streamInfo?.tags || streamInfo.tags.length === 0)) && (
                  <p className="text-gray-400 text-sm">No language or tags specified</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400">No category selected</p>
        )}
      </div>

      {/* Edit Button - pushed to bottom */}
      <Button
        variant="secondary"
        className="w-full mt-auto bg-gray-700 hover:bg-gray-600 text-white"
        onClick={() => setIsEditDialogOpen(true)}
      >
        <Edit className="h-5 w-5 mr-2" /> Edit
      </Button>

      {/* Edit Dialog */}
      {streamerId && (
        <EditStreamInfoDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          streamerId={streamerId}
          refetchStreamInfo={refetchStreamInfo}
        />
      )}
    </div>
  );
};