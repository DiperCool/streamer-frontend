"use client";

import React, { useState, useEffect } from "react";
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
import { Loader2, Image as ImageIcon, Plus } from "lucide-react";
import FileUploadButton from "@/components/ui/fileUploadButton";
import { useCreateBannerMutation } from "@/graphql/__generated__/graphql";
import { toast } from "sonner";
import Image from "next/image";
import { getMinioUrl } from "@/utils/utils";

const createBannerSchema = z.object({
  title: z.string().max(100, "Title must be at most 100 characters").optional(), // Сделано необязательным
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  image: z.string().min(1, "Image is required"),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

type CreateBannerFormValues = z.infer<typeof createBannerSchema>;

interface CreateBannerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  streamerId: string;
  refetchBanners: () => void;
}

export const CreateBannerDialog: React.FC<CreateBannerDialogProps> = ({
  isOpen,
  onOpenChange,
  streamerId,
  refetchBanners,
}) => {
  const [createBannerMutation, { loading: createLoading }] = useCreateBannerMutation();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateBannerFormValues>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      url: "",
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

  const onSubmit = async (values: CreateBannerFormValues) => {
    try {
      await createBannerMutation({
        variables: {
          banner: {
            streamerId,
            title: values.title || null, // Отправляем null, если пустая строка
            description: values.description || null, // Отправляем null, если пустая строка
            image: values.image,
            url: values.url || null,
          },
        },
      });
      refetchBanners();
      onOpenChange(false);
      toast.success("Banner created successfully!");
    } catch (error: any) {
      console.error("Error creating banner:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to create banner. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Banner</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new banner to your channel's about section.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title (Optional)</Label> {/* Обновлен текст лейбла */}
            <Input
              id="title"
              type="text"
              {...register("title")}
              placeholder="Banner Title"
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description (Optional)</Label> {/* Обновлен текст лейбла */}
            <Textarea
              id="description"
              {...register("description")}
              placeholder="A short description for your banner"
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500 min-h-[80px]"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">Image*</Label>
            {previewImageUrl && (
              <div className="relative w-full h-32 rounded-md overflow-hidden mb-2">
                <Image
                  src={previewImageUrl}
                  alt="Image Preview"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
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

          <div className="space-y-2">
            <Label htmlFor="url" className="text-white">Link URL (Optional)</Label>
            <Input
              id="url"
              type="url"
              {...register("url")}
              placeholder="https://your-link.com"
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={createLoading || !isValid}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {createLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Create Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};