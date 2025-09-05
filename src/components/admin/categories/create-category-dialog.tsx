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
import { useCreateCategoryMutation } from "@/graphql/__generated__/graphql"
import { toast } from "sonner"
import Image from "next/image"
import { getMinioUrl } from "@/utils/utils"

const createCategorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  image: z.string().min(1, "Image is required"),
});

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

interface CreateCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetchCategories: () => void;
}

export const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({
  isOpen,
  onOpenChange,
  refetchCategories,
}) => {
  const [createCategoryMutation, { loading: createLoading }] = useCreateCategoryMutation();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      title: "",
      image: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setPreviewImageUrl(null);
    }
  }, [isOpen, reset]);

  const handleImageUpload = (fileName: string) => {
    setValue("image", fileName, { shouldDirty: true, shouldValidate: true });
    setPreviewImageUrl(getMinioUrl(fileName));
  };

  const onSubmit = async (values: CreateCategoryFormValues) => {
    try {
      await createCategoryMutation({
        variables: {
          input: {
            title: values.title,
            image: values.image,
          },
        },
      });
      refetchCategories();
      onOpenChange(false);
      toast.success("Category created successfully!");
    } catch (error: any) {
      console.error("Error creating category:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to create category. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Category</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new streaming category with a title and an image.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
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
            <Label htmlFor="image" className="text-white">Image</Label>
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
              Upload Image
            </FileUploadButton>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={createLoading || !isValid}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {createLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};