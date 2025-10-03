"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid } from "lucide-react";
import { BannerDto, useGetBannersQuery } from "@/graphql/__generated__/graphql";
import { CreateBannerDialog } from "./create-banner-dialog";
import { BannerCard } from "./banner-card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreamerBannersSectionProps {
  streamerId: string;
  canManageBanners: boolean;
  className?: string;
}

export const StreamerBannersSection: React.FC<StreamerBannersSectionProps> = ({
  streamerId,
  canManageBanners,
  className,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  console.log("StreamerBannersSection - streamerId:", streamerId);
  console.log("StreamerBannersSection - canManageBanners:", canManageBanners);

  const { data: bannersData, loading: bannersLoading, error: bannersError, refetch: refetchBanners } = useGetBannersQuery({
    variables: { streamerId },
    skip: !streamerId,
  });

  // Добавлены логи для отладки
  console.log("StreamerBannersSection - bannersLoading:", bannersLoading);
  console.log("StreamerBannersSection - bannersError:", bannersError);
  console.log("StreamerBannersSection - bannersData:", bannersData);

  const banners = bannersData?.banners || [];
  console.log("StreamerBannersSection - banners.length:", banners.length);

  if (bannersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (bannersError) {
    return <div className="text-red-500">Error loading banners: {bannersError.message}</div>;
  }

  return (
    <Card className={cn("bg-gray-800 border-gray-700 mb-8", className)}>
      <CardHeader>
        {/* Удален CardTitle "Channel Banners" */}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              streamerId={streamerId}
              canManageBanners={canManageBanners}
              refetchBanners={refetchBanners}
            />
          ))}

          {canManageBanners && (
            <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
              <LayoutGrid className="h-12 w-12 mb-2" />
              <p className="text-lg font-semibold">Add a new banner</p>
              <p className="text-sm mb-4">
                Share more information about yourself, donations, or PC specs.
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Banner
              </Button>
            </div>
          )}
        </div>
        {banners.length === 0 && !bannersLoading && (
            <p className="text-gray-400 text-center py-10">No banners found for this channel.</p>
        )}
      </CardContent>

      {canManageBanners && (
        <CreateBannerDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          streamerId={streamerId}
          refetchBanners={refetchBanners}
        />
      )}
    </Card>
  );
};