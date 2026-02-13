"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles, Crown } from "lucide-react";
import { SubscriptionPlansPopover } from "./subscription-plans-popover";
import { CompletePurchaseDialog } from "./complete-purchase-dialog";
import { SubscriptionPlanDto, SubscriptionDto } from "@/graphql/__generated__/graphql";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StreamerSubscribeButtonProps {
  streamerId: string;
  streamerUserName: string;
  userSubscription?: SubscriptionDto | null;
  isLoading?: boolean;
}

const SubscriptionDetails: React.FC<{ subscription: SubscriptionDto }> = ({ subscription }) => (
  <Card className="w-80 border-none bg-transparent shadow-none">
    <CardHeader className="p-4">
      <CardTitle className="text-white text-lg flex items-center">
        <Crown className="w-5 h-5 mr-2 text-yellow-400" />
        Your Subscription
      </CardTitle>
      <CardDescription className="text-gray-400">Details of your current subscription.</CardDescription>
    </CardHeader>
    <CardContent className="p-4 pt-0 text-gray-200 text-sm">
      <div className="flex justify-between py-1">
        <span className="text-gray-400">Plan:</span>
        <span className="font-semibold">{subscription.title}</span>
      </div>
      <div className="flex justify-between py-1">
        <span className="text-gray-400">Status:</span>
        <span className="font-semibold capitalize">{subscription.status.toLowerCase()}</span>
      </div>
      <div className="flex justify-between py-1">
        <span className="text-gray-400">Subscribed On:</span>
        <span className="font-semibold">{formatDate(subscription.createdAt)}</span>
      </div>
      <div className="flex justify-between py-1">
        <span className="text-gray-400">Renews On:</span>
        <span className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</span>
      </div>
    </CardContent>
    <CardFooter className="p-4 flex justify-end">
      {/* <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">Manage Subscription</Button> */}
    </CardFooter>
  </Card>
);

export const StreamerSubscribeButton: React.FC<StreamerSubscribeButtonProps> = ({
  streamerId,
  streamerUserName,
  userSubscription,
  isLoading,
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
    setIsPopoverOpen(false);
    setIsPurchaseDialogOpen(true);
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-32" />;
  }

  const isSubscribed = !!userSubscription;

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={isSubscribed ? "secondary" : "default"}
            className={
              isSubscribed
                ? "bg-purple-700 hover:bg-purple-800 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }
            onClick={() => {
              if (isSubscribed) {
                setIsPopoverOpen(true);
              }
            }}
          >
            <div className="flex items-center">
              {isSubscribed ? (
                <>
                  <Crown className="h-4 w-4 mr-2" /> Subscribed
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" /> Subscribe
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-gray-800 border-gray-700 text-white" align="end">
          {isSubscribed ? (
            <SubscriptionDetails subscription={userSubscription} />
          ) : (
            <SubscriptionPlansPopover
              streamerId={streamerId}
              streamerUserName={streamerUserName}
              onSelectPlan={handleSelectPlan}
            />
          )}
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