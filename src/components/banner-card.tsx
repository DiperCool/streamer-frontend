"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { BannerDto } from "@/graphql/__generated__/graphql";
import { getMinioUrl } from "@/utils/utils";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { useRemoveBannerMutation } from "@/graphql/__generated__/graphql";
import { EditBannerDialog } from "./edit-banner-dialog";
import { cn } from "@/lib/utils"; // Импортируем cn

interface BannerCardProps {
  banner: BannerDto;
  streamerId: string;
  canManageBanners: boolean;
  refetchBanners: () => void;
}

export const BannerCard: React.FC<BannerCardProps> = ({
  banner,
  streamerId,
  canManageBanners,
  refetchBanners,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [removeBannerMutation, { loading: removeLoading }] = useRemoveBannerMutation();

  const handleRemoveBanner = async () => {
    try {
      await removeBannerMutation({
        variables: {
          banner: {
            bannerId: banner.id,
            streamerId: streamerId,
          },
        },
      });
      refetchBanners();
      toast.success("Banner removed successfully!");
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error removing banner:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to remove banner. Please try again.";
      toast.error(errorMessage);
    }
  };

  const hasTextContent = banner.title || banner.description;

  const imageContent = (
    <>
      <Image
        src={getMinioUrl(banner.image!)}
        alt={banner.title || "Banner image"}
        fill
        style={{ objectFit: "cover" }}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="absolute inset-0 w-full h-full transform scale-[1.01] translate-x-[-0.5%] translate-y-[-0.5%]" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </>
  );

  return (
    <div
      className="group relative w-full rounded-lg overflow-hidden bg-gray-800 shadow-lg flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container (with optional Link) - always apply aspect-video */}
      {banner.url ? (
        <Link 
          href={banner.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={cn(
            "block relative w-full overflow-hidden transition-transform duration-200 group-hover:scale-105 aspect-video" // Всегда aspect-video
          )}
        >
          {imageContent}
        </Link>
      ) : (
        <div className={cn(
          "relative w-full overflow-hidden transition-transform duration-200 group-hover:scale-105 aspect-video" // Всегда aspect-video
        )}>
          {imageContent}
        </div>
      )}

      {/* Title and Description below the image - conditionally rendered */}
      {hasTextContent && (
        <div className="p-4">
          {banner.title && <h3 className="text-xl font-semibold text-white">{banner.title}</h3>}
          {banner.description && <p className="text-gray-300 text-sm mt-1">{banner.description}</p>}
        </div>
      )}

      {/* Action buttons (Edit/Delete) - only visible if canManageBanners is true and hovered */}
      {canManageBanners && isHovered && (
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="bg-gray-900/70 hover:bg-gray-700/90 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditDialogOpen(true);
            }}
            title="Edit Banner"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="bg-red-600/70 hover:bg-red-700/90 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            title="Delete Banner"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Dialogs for editing and deleting - only rendered if canManageBanners is true */}
      {canManageBanners && (
        <>
          <EditBannerDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            banner={banner}
            streamerId={streamerId}
            refetchBanners={refetchBanners}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Are you sure you want to delete this banner?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This action cannot be undone. The banner "
                  <span className="font-semibold text-white">{banner.title}</span>" will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemoveBanner}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={removeLoading}
                >
                  {removeLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};