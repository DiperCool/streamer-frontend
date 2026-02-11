"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useGetSubscriptionPlansByStreamerIdQuery, SubscriptionPlanDto } from "@/graphql/__generated__/graphql";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SubscriptionPlansPopoverProps {
  streamerId: string;
  streamerUserName: string;
  onSelectPlan: (plan: SubscriptionPlanDto) => void;
}

export const SubscriptionPlansPopover: React.FC<SubscriptionPlansPopoverProps> = ({
  streamerId,
  streamerUserName,
  onSelectPlan,
}) => {
  const { data, loading, error } = useGetSubscriptionPlansByStreamerIdQuery({
    variables: { streamerId },
    skip: !streamerId,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading plans: {error.message}</div>;
  }

  const plans = data?.subscriptionPlansByStreamerId || [];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white mb-2">Subscribe to {streamerUserName}</h3>
      <p className="text-sm text-gray-400 mb-4">
        A subscription is a great way to help {streamerUserName} keep doing what they are doing.
      </p>

      {plans.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No subscription plans available.</p>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-md border border-gray-600"
            >
              <div>
                <p className="font-medium text-white">{plan.name}</p>
                <p className="text-sm text-gray-400">${plan.price.toFixed(2)} / month</p>
              </div>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onSelectPlan(plan)}
              >
                <Sparkles className="h-4 w-4 mr-2" /> Subscribe
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};