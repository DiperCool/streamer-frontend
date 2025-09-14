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
import { Loader2, Image as ImageIcon } from "lucide-react";
import FileUploadButton from "@/components/ui/fileUploadButton";
import { useUpdateBannerMutation, BannerDto } from "@/graphql/__generated__/graphql";
import { toast } from "sonner";
import Image from "next/image";
import { getMinioUrl } from "@/utils/utils";

const editBannerSchema = z.object({
  id: z.string().uuid("Invalid banner ID"),
  title: z.string().max(100, "Title must be at most 100 characters").optional(), // Сделано необязательным
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  image: z.string().min(1, "Image is required"),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

type EditBannerFormValues = z.infer<typeof editBannerSchema>;

interface EditBannerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  banner: BannerDto; // Pass the full banner object
  streamerId: string;
  refetchBanners: () => void;
}

export const EditBannerDialog: React.FC<EditBannerDialogProps> = ({
  isOpen,
  onOpenChange,
  banner,
  streamerId,
  refetchBanners,
}) => {
  const [updateBannerMutation, { loading: updateLoading }] = useUpdateBannerMutation();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<EditBannerFormValues>({
    resolver: zodResolver(editBannerSchema),
    defaultValues: {
      id: banner.id,
      title: banner.title || "",
      description: banner.description || "",
      image: banner.image || "",
      url: banner.url || "",
    },
  });

  useEffect(() => {
    if (isOpen && banner) {
      reset({
        id: banner.id,
        title: banner.title || "",
        description: banner.description || "",
        image: banner.image || "",
        url: banner.url || "",
      });
      setPreviewImageUrl(banner.image ? getMinioUrl(banner.image) : null);
    } else if (!isOpen) {
      setPreviewImageUrl(null);
    }
  }, [isOpen, banner, reset]);

  const handleImageUpload = (fileName: string) => {
    setValue("image", fileName, { shouldDirty: true, shouldValidate: true });
    setPreviewImageUrl(getMinioUrl(fileName));
  };

  const onSubmit = async (values: EditBannerFormValues) => {
    try {
      await updateBannerMutation({
        variables: {
          banner: {
            bannerId: values.id,
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
      toast.success("Banner updated successfully!");
    } catch (error: any) {
      console.error("Error updating banner:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to update banner. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Banner: {banner.title || "Untitled Banner"}</DialogTitle> {/* Обновлен заголовок */}
          <DialogDescription className="text-gray-400">
            Update the details for this banner.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="editTitle" className="text-white">Title (Optional)</Label> {/* Обновлен текст лейбла */}
            <Input
              id="editTitle"
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
            <Label htmlFor="editDescription" className="text-white">Description (Optional)</Label> {/* Обновлен текст лейбла */}
            <Textarea
              id="editDescription"
              {...register("description")}
              placeholder="A short description for your banner"
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500 min-h-[80px]"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="editImage" className="text-white">Image*</Label>
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
              Update Image
            </FileUploadButton>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="editUrl" className="text-white">Link URL (Optional)</Label>
            <Input
              id="editUrl"
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
              disabled={updateLoading || !isDirty || !isValid}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {updateLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};