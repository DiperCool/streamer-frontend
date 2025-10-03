"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { CategorySelectInput } from "@/src/components/ui/category-select-input";

const streamInfoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  language: z.string().min(1, "Language is required"),
  categoryId: z.string().uuid("Invalid category ID").nullable(),
  tagsInput: z.string().optional(),
  tags: z.array(z.string()
    .min(1, "Tag cannot be empty")
    .max(25, "Tag must be at most 25 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Tags can only contain letters, numbers, and underscores")
  ).max(10, "You can add up to 10 tags").optional(),
});

type StreamInfoFormValues = z.infer<typeof streamInfoSchema>;

interface EditStreamInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  streamerId: string;
  refetchStreamInfo: () => void;
}

export const EditStreamInfoDialog: React.FC<EditStreamInfoDialogProps> = ({
  isOpen,
  onOpenChange,
  streamerId,
  refetchStreamInfo,
}) => {
  const { data: streamInfoData, loading: streamInfoLoading, error: streamInfoError } = useGetStreamInfoQuery({
    variables: { streamerId },
    skip: !streamerId || !isOpen,
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
    setError,
    clearErrors,
    trigger,
    formState: { errors, isDirty },
  } = useForm<StreamInfoFormValues>({
    resolver: zodResolver(streamInfoSchema),
    defaultValues: {
      title: "",
      language: "English",
      categoryId: null,
      tagsInput: "",
      tags: [],
    },
  });

  const currentTags = watch("tags") || [];
  const tagsInput = watch("tagsInput");

  useEffect(() => {
    if (isOpen && streamInfoData?.streamInfo) {
      const info = streamInfoData.streamInfo;
      reset({
        title: info.title || "",
        language: info.language || "English",
        categoryId: info.category?.id || null,
        tags: info.tags?.map(tag => tag.title) || [],
        tagsInput: "",
      });
    } else if (!isOpen) {
      reset();
      clearErrors();
    }
  }, [isOpen, streamInfoData, reset, clearErrors]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputVal = tagsInput.trim();
      if (!inputVal) return;

      const newTagsToAdd = inputVal
        .split(/[, ]+/)
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      let updatedTags = [...currentTags];
      let hasError = false;
      let errorMessage = "";

      for (const newTag of newTagsToAdd) {
        if (updatedTags.length >= 10) {
          errorMessage = "Max 10 tags reached.";
          hasError = true;
          break;
        }
        if (newTag.length > 25) {
          errorMessage = `Tag "${newTag}" is too long (max 25 characters).`;
          hasError = true;
          break;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(newTag)) {
          errorMessage = `Tag "${newTag}" contains invalid characters. Only letters, numbers, and underscores are allowed.`;
          hasError = true;
          break;
        }
        if (updatedTags.includes(newTag)) {
          errorMessage = `Tag "${newTag}" already exists.`;
          hasError = true;
          break;
        }
        updatedTags.push(newTag);
      }

      if (hasError) {
        setError("tagsInput", { type: "manual", message: errorMessage });
      } else {
        setValue("tags", updatedTags, { shouldDirty: true, shouldValidate: true });
        setValue("tagsInput", "");
        clearErrors("tagsInput");
        clearErrors("tags");
        trigger("tags");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", currentTags.filter((tag) => tag !== tagToRemove), { shouldDirty: true });
    trigger("tags");
    clearErrors("tags");
  };

  const onSubmit = async (values: StreamInfoFormValues) => {
    if (!streamerId) return;

    try {
      await updateStreamInfo({
        variables: {
          streamInfo: {
            streamerId,
            title: values.title,
            language: values.language,
            categoryId: values.categoryId,
            tags: values.tags || [],
          },
        },
      });
      refetchStreamInfo();
      onOpenChange(false);
      toast.success("Stream info updated successfully!");
    } catch (error: any) {
      console.error("Error updating stream info:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to update stream info. Please try again.";
      toast.error(errorMessage);
    }
  };

  const isLoading = streamInfoLoading || categoriesLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Stream Info</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your stream's title, category, tags, and language.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : streamInfoError || categoriesError ? (
          <div className="text-red-500 p-4">
            Error: {streamInfoError?.message || categoriesError?.message}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Title*</Label>
              <Input
                id="title"
                type="text"
                {...register("title")}
                placeholder="My awesome stream"
                className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category*</Label>
              <CategorySelectInput
                categories={categoriesData?.categories?.nodes || []}
                value={watch("categoryId")}
                onValueChange={(value) => setValue("categoryId", value, { shouldDirty: true })}
                placeholder="Select a category"
                error={errors.categoryId?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagsInput" className="text-white">Tags</Label>
              <Input
                id="tagsInput"
                type="text"
                {...register("tagsInput")}
                placeholder="Choose your own tag (comma-separated)"
                onKeyDown={handleAddTag}
                className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
              />
              {errors.tagsInput && (
                <p className="text-red-500 text-sm mt-1">{errors.tagsInput.message}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {currentTags.map((tag) => (
                  <Badge key={tag} variant="itemTag">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1 text-gray-400 hover:text-white"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Add up to 10 tags (Max 25 characters, only letters, numbers, and underscores). {currentTags.length} / 10
              </p>
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-white">Language*</Label>
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
                </SelectContent>
              </Select>
              {errors.language && (
                <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={updateLoading || !isDirty}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {updateLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};