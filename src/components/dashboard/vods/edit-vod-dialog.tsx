"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, X, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  useGetVodQuery,
  useUpdateVodMutation,
  useGetCategoriesQuery,
  useGetTagsQuery,
  SortEnumType,
  VodType,
  GetVodsDocument,
} from "@/graphql/__generated__/graphql"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { CategorySelectInput } from "@/src/components/ui/category-select-input"
import { TagSelectInput } from "@/src/components/ui/tag-select-input"
import Image from "next/image"
import { getMinioUrl } from "@/utils/utils"
import FileUploadButton from "@/components/ui/fileUploadButton"
import { useDashboard } from "@/src/contexts/DashboardContext"

const editVodSchema = z.object({
  id: z.string().uuid("Invalid VOD ID"),
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  description: z.string().max(1000, "Description must be at most 1000 characters").optional(),
  language: z.string().min(1, "Language is required"),
  categoryId: z.string().uuid("Invalid category ID").nullable(),
  type: z.nativeEnum(VodType, {
    errorMap: () => ({ message: "Please select a VOD type" }),
  }),
  tagsInput: z.string().optional(), // For the input field to add new tags
  tags: z.array(z.string()
    .min(1, "Tag cannot be empty")
    .max(25, "Tag must be at most 25 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Tags can only contain letters, numbers, and underscores")
  ).max(10, "You can add up to 10 tags").optional(), // Actual tags array
  // Removed: preview: z.string().optional(),
});

type EditVodFormValues = z.infer<typeof editVodSchema>;

interface EditVodDialogProps {
  vodId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetchVods: () => void;
}

export const EditVodDialog: React.FC<EditVodDialogProps> = ({
  vodId,
  isOpen,
  onOpenChange,
  refetchVods,
}) => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";

  const { data: vodData, loading: vodLoading, error: vodError, refetch: refetchVodById } = useGetVodQuery({
    variables: { vodId },
    skip: !isOpen || !vodId,
  });

  const { data: categoriesData, loading: categoriesLoading } = useGetCategoriesQuery({
    variables: { order: [{ title: SortEnumType.Asc }] },
  });

  const { data: tagsData, loading: tagsLoading } = useGetTagsQuery({
    variables: { order: [{ title: SortEnumType.Asc }] },
  });

  const [updateVodMutation, { loading: updateLoading }] = useUpdateVodMutation({
    refetchQueries: [
      {
        query: GetVodsDocument,
        variables: { streamerId: streamerId, first: 10, order: [{ createdAt: SortEnumType.Desc }] },
      },
    ],
  });
  // Removed: const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors, isDirty, isValid },
  } = useForm<EditVodFormValues>({
    resolver: zodResolver(editVodSchema),
    defaultValues: {
      id: vodId,
      title: "",
      description: "",
      language: "English",
      categoryId: null,
      type: VodType.Public,
      tagsInput: "",
      tags: [],
      // Removed: preview: "",
    },
  });

  const currentTags = watch("tags") || [];
  const tagsInput = watch("tagsInput");

  useEffect(() => {
    if (isOpen && vodId) {
      refetchVodById();
    }
  }, [isOpen, vodId, refetchVodById]);

  useEffect(() => {
    if (isOpen && vodData?.vod) {
      const vod = vodData.vod;
      reset({
        id: vod.id,
        title: vod.title || "",
        description: vod.description || "",
        language: vod.language || "English",
        categoryId: vod.category?.id || null,
        type: vod.type,
        tags: vod.tags?.map(tag => tag.title) || [],
        // Removed: preview: vod.preview || "",
        tagsInput: "",
      });
      // Removed: setPreviewImageUrl(vod.preview ? getMinioUrl(vod.preview) : null);
    } else if (!isOpen) {
      reset();
      clearErrors();
      // Removed: setPreviewImageUrl(null);
    }
  }, [isOpen, reset, vodData, clearErrors]);

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
        trigger("tags");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", currentTags.filter((tag) => tag !== tagToRemove), { shouldDirty: true });
    trigger("tags");
    clearErrors("tags");
  };

  // Removed: const handlePreviewUpload = (fileName: string) => {
  //   setValue("preview", fileName, { shouldDirty: true, shouldValidate: true });
  //   setPreviewImageUrl(getMinioUrl(fileName));
  // };

  const onSubmit = async (values: EditVodFormValues) => {
    try {
      await updateVodMutation({
        variables: {
          request: {
            id: values.id,
            title: values.title,
            description: values.description || "",
            language: values.language,
            categoryId: values.categoryId,
            type: values.type,
            tags: values.tags || [],
            // Removed: preview: values.preview || "",
          },
        },
      });
      refetchVods();
      onOpenChange(false);
      toast.success("VOD updated successfully!");
    } catch (error: any) {
      console.error("Error updating VOD:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to update VOD. Please try again.";
      toast.error(errorMessage);
    }
  };

  const isLoading = vodLoading || categoriesLoading || tagsLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isLoading ? "Loading VOD..." : vodError ? "Error Loading VOD" : `Edit VOD: ${vodData?.vod?.title || "..."}`}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isLoading ? "Fetching VOD details." : vodError ? vodError.message : "Update the details for this VOD."}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : vodError ? (
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} className="bg-gray-700 hover:bg-gray-600 text-white">
              Close
            </Button>
          </DialogFooter>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Title*</Label>
              <Input
                id="title"
                type="text"
                {...register("title")}
                placeholder="VOD Title"
                className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Tell viewers about your VOD"
                className="bg-gray-700 border-gray-600 text-white focus:border-green-500 min-h-[100px]"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
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

            <div className="space-y-2">
              <Label htmlFor="type" className="text-white">VOD Type*</Label>
              <Select
                value={watch("type")}
                onValueChange={(value: VodType) => setValue("type", value, { shouldDirty: true })}
              >
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus:border-green-500">
                  <SelectValue placeholder="Select VOD type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value={VodType.Public}>Public</SelectItem>
                  <SelectItem value={VodType.Private}>Private</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
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
                  <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs flex items-center">
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

            {/* Removed Preview Image section */}

            <DialogFooter>
              <Button
                type="submit"
                disabled={updateLoading || !isDirty || !isValid}
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