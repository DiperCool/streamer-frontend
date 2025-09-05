"use client"

import React, { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import { Loader2, Image as ImageIcon } from "lucide-react"
import FileUploadButton from "@/components/ui/fileUploadButton"
import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from "@/graphql/__generated__/graphql"
import { toast } from "sonner"
import Image from "next/image"
import { getMinioUrl } from "@/utils/utils"

const editCategorySchema = z.object({
  id: z.string().uuid("Invalid category ID"),
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  image: z.string().min(1, "Image is required"),
});

type EditCategoryFormValues = z.infer<typeof editCategorySchema>;

interface EditCategoryDialogProps {
  categoryId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetchCategories: () => void;
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  categoryId,
  isOpen,
  onOpenChange,
  refetchCategories,
}) => {
  const { data: categoryData, loading: categoryLoading, error: categoryError, refetch: refetchCategoryById } = useGetCategoryByIdQuery({
    variables: { id: categoryId },
    skip: !isOpen || !categoryId,
  });
  const [updateCategoryMutation, { loading: updateLoading }] = useUpdateCategoryMutation();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<EditCategoryFormValues>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      id: categoryId,
      title: "",
      image: "",
    },
  });

  useEffect(() => {
    if (isOpen && categoryId) {
      refetchCategoryById();
    }
  }, [isOpen, categoryId, refetchCategoryById]);

  useEffect(() => {
    if (isOpen && categoryData?.category) {
      const category = categoryData.category;
      reset({
        id: category.id,
        title: category.title,
        image: category.image,
      });
      setPreviewImageUrl(getMinioUrl(category.image));
    }
  }, [isOpen, reset, categoryData]);

  const handleImageUpload = (fileName: string) => {
    setValue("image", fileName, { shouldDirty: true, shouldValidate: true });
    setPreviewImageUrl(getMinioUrl(fileName));
  };

  const onSubmit = async (values: EditCategoryFormValues) => {
    try {
      await updateCategoryMutation({
        variables: {
          input: {
            id: values.id,
            title: values.title,
            image: values.image,
          },
        },
      });
      refetchCategories();
      onOpenChange(false);
      toast.success("Category updated successfully!");
    } catch (error: any) {
      console.error("Error updating category:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to update category. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {categoryLoading ? "Loading Category..." : categoryError ? "Error Loading Category" : `Edit Category: ${categoryData?.category?.title || "..."}`}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {categoryLoading ? "Fetching category details." : categoryError ? categoryError.message : "Update the title and image for this category."}
          </DialogDescription>
        </DialogHeader>
        {categoryLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : categoryError ? (
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} className="bg-gray-700 hover:bg-gray-600 text-white">
              Close
            </Button>
          </DialogFooter>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle" className="text-white">Title</Label>
              <Input
                id="editTitle"
                type="text"
                {...register("title")}
                placeholder="Category Title"
                className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="editImage" className="text-white">Image</Label>
              {previewImageUrl && (
                <div className="relative w-32 h-32 rounded-md overflow-hidden mb-2">
                  <Image
                    src={previewImageUrl}
                    alt="Image Preview"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="128px"
                  />
                </div>
              )}
              <FileUploadButton onUpload={handleImageUpload}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Update Image
              </FileUploadButton>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
              )}
            </div>

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