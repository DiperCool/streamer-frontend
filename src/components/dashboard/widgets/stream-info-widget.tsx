"use client";

import React, { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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

const streamInfoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  language: z.string().min(1, "Language is required"),
  categoryId: z.string().uuid("Invalid category ID").nullable(),
  tags: z.string().optional(), // Comma-separated tags
});

type StreamInfoFormValues = z.infer<typeof streamInfoSchema>;

export const StreamInfoWidget: React.FC = () => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";

  const { data: streamInfoData, loading: streamInfoLoading, error: streamInfoError, refetch: refetchStreamInfo } = useGetStreamInfoQuery({
    variables: { streamerId },
    skip: !streamerId,
  });

  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery({
    variables: { order: [{ title: SortEnumType.Asc }] },
  });

  const [updateStreamInfo, { loading: updateLoading }] = useUpdateStreamInfoMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<StreamInfoFormValues>({
    resolver: zodResolver(streamInfoSchema),
    defaultValues: {
      title: "",
      language: "English", // Default language
      categoryId: null,
      tags: "",
    },
  });

  useEffect(() => {
    if (streamInfoData?.streamInfo) {
      const info = streamInfoData.streamInfo;
      reset({
        title: info.title || "",
        language: info.language || "English",
        categoryId: info.category?.id || null,
        tags: info.tags?.map(tag => tag.title).join(", ") || "",
      });
    }
  }, [streamInfoData, reset]);

  const onSubmit = async (values: StreamInfoFormValues) => {
    if (!streamerId || !streamInfoData?.streamInfo?.id) return;

    try {
      await updateStreamInfo({
        variables: {
          streamInfo: {
            streamerId,
            title: values.title,
            language: values.language,
            categoryId: values.categoryId,
            tags: values.tags ? values.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
          },
        },
      });
      refetchStreamInfo();
      toast.success("Stream info updated successfully!");
    } catch (error: any) {
      console.error("Error updating stream info:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to update stream info. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (streamInfoData?.streamInfo) {
      const info = streamInfoData.streamInfo;
      reset({
        title: info.title || "",
        language: info.language || "English",
        categoryId: info.category?.id || null,
        tags: info.tags?.map(tag => tag.title).join(", ") || "",
      });
    }
  };

  if (streamInfoLoading || categoriesLoading) {
    return (
      <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </CardContent>
    );
  }

  if (streamInfoError || categoriesError) {
    return (
      <CardContent className="flex-1 p-3 text-red-500 text-sm flex items-center justify-center">
        Error loading stream info or categories: {streamInfoError?.message || categoriesError?.message}
      </CardContent>
    );
  }

  const categories = categoriesData?.categories?.nodes || [];

  return (
    <CardContent className="flex-1 p-3 flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">Title</Label>
        <Input
          id="title"
          type="text"
          {...register("title")}
          placeholder="Stream Title"
          className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="language" className="text-white">Language</Label>
        <Select
          value={watch("language")}
          onValueChange={(value) => setValue("language", value, { shouldDirty: true })}
        >
          <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus:border-green-500">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Russian">Russian</SelectItem>
            {/* Add more languages as needed */}
          </SelectContent>
        </Select>
        {errors.language && (
          <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-white">Category</Label>
        <Select
          value={watch("categoryId") || ""}
          onValueChange={(value) => setValue("categoryId", value === "" ? null : value, { shouldDirty: true })}
        >
          <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus:border-green-500">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="">None</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-white">Tags (comma-separated)</Label>
        <Textarea
          id="tags"
          {...register("tags")}
          placeholder="gaming, fps, just chatting"
          className="bg-gray-700 border-gray-600 text-white focus:border-green-500 min-h-[80px]"
        />
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          disabled={!isDirty || updateLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty || updateLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {updateLoading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </CardContent>
  );
};