"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles } from "lucide-react";
import { SubscriptionPlansPopover } from "./subscription-plans-popover";
import { CompletePurchaseDialog } from "./complete-purchase-dialog";
import { SubscriptionPlanDto } from "@/graphql/__generated__/graphql";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";

interface StreamerSubscribeButtonProps {
  streamerId: string;
  streamerUserName: string;
}

export const StreamerSubscribeButton: React.FC<StreamerSubscribeButtonProps> = ({
  streamerId,
  streamerUserName,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanDto | null>(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleSelectPlan = (plan: SubscriptionPlanDto) => {
    if (!isAuthenticated) {
      toast.info("Please log in to subscribe.");
      loginWithRedirect();
      return;
    }
    setSelectedPlan(plan);
    setIsPopoverOpen(false); // Close popover
    setIsPurchaseDialogOpen(true); // Open purchase dialog
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!streamerId}
          >
            <Sparkles className="h-4 w-4 mr-2" /> Subscribe
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-gray-800 border-gray-700 text-white" align="end">
          <SubscriptionPlansPopover
            streamerId={streamerId}
            streamerUserName={streamerUserName}
            onSelectPlan={handleSelectPlan}
          />
        </PopoverContent>
      </Popover>

      {selectedPlan && (
        <CompletePurchaseDialog
          isOpen={isPurchaseDialogOpen}
          onOpenChange={setIsPurchaseDialogOpen}
          selectedPlan={selectedPlan}
          streamerUserName={streamerUserName}
        />
      )}
    </>
  );
};