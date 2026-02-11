"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  useGetMeQuery,
  useGetPartnerQuery,
  useBecomePartnerMutation,
  useGenerateOnboardingLinkMutation,
  StripeOnboardingStatus,
} from "@/graphql/__generated__/graphql"
import { useAuth0 } from "@auth0/auth0-react"

export const PartnerOnboardingCard: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const { data: meData, loading: meLoading } = useGetMeQuery({
    skip: !isAuthenticated,
  });

  const streamerId = meData?.me.id;

  const { data: partnerData, loading: partnerLoading, error: partnerError, refetch: refetchPartner } = useGetPartnerQuery({
    variables: { streamerId: streamerId || "" },
    skip: !streamerId,
  });

  const [becomePartnerMutation, { loading: becomePartnerLoading }] = useBecomePartnerMutation();
  const [generateOnboardingLinkMutation, { loading: generateLinkLoading }] = useGenerateOnboardingLinkMutation();

  const handleBecomePartner = async () => {
    if (!streamerId) return;
    try {
      await becomePartnerMutation({ variables: { streamerId } });
      await refetchPartner(); // Refetch partner data to get the updated status
      toast.success("Initiated partner registration!");
      // After initiating, now generate the link
      await handleGenerateOnboardingLink();
    } catch (error: any) {
      console.error("Error becoming partner:", error);
      toast.error(error.graphQLErrors?.[0]?.message || "Failed to become partner.");
    }
  };

  const handleGenerateOnboardingLink = async () => {
    if (!streamerId) return;
    try {
      const { data } = await generateOnboardingLinkMutation({ variables: { streamerId } });
      if (data?.generateOnboardingLink.onboardingLink) {
        window.open(data.generateOnboardingLink.onboardingLink, "_blank");
        toast.info("Redirecting to Stripe onboarding...");
      } else {
        toast.error("Failed to get onboarding link.");
      }
    } catch (error: any) {
      console.error("Error generating onboarding link:", error);
      toast.error(error.graphQLErrors?.[0]?.message || "Failed to generate onboarding link.");
    }
  };

  const isLoading = meLoading || partnerLoading;

  if (!isAuthenticated) {
    return null; // Or a message indicating not logged in
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Partner Onboarding</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </CardContent>
      </Card>
    );
  }

  if (partnerError) {
    return (
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Partner Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading partner status: {partnerError.message}</p>
        </CardContent>
      </Card>
    );
  }

  const onboardingStatus = partnerData?.partner.stripeOnboardingStatus;

  // Only render the card if onboarding is not completed
  if (onboardingStatus === StripeOnboardingStatus.Completed) {
    return null;
  }

  return (
    <Card className="bg-gray-800 border-gray-700 mb-8">
      <CardHeader>
        <CardTitle className="text-white">Partner Onboarding</CardTitle>
      </CardHeader>
      <CardContent>
        {onboardingStatus === StripeOnboardingStatus.Completed ? (
          <div className="text-green-500 font-semibold flex items-center">
            Partner Onboarding Completed!
          </div>
        ) : onboardingStatus === StripeOnboardingStatus.NotStarted ? (
          <div className="space-y-4">
            <p className="text-gray-300">
              Become a partner to start earning revenue from your streams.
            </p>
            <Button
              onClick={handleBecomePartner}
              disabled={becomePartnerLoading || generateLinkLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {becomePartnerLoading || generateLinkLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Become a Partner"
              )}
            </Button>
          </div>
        ) : onboardingStatus === StripeOnboardingStatus.InProgress ? (
          <div className="space-y-4">
            <p className="text-gray-300">
              Your partner onboarding is in progress. Please complete the remaining steps.
            </p>
            <Button
              onClick={handleGenerateOnboardingLink}
              disabled={generateLinkLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {generateLinkLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Continue Onboarding"
              )}
            </Button>
          </div>
        ) : (
          <p className="text-gray-300">Unable to determine partner status.</p>
        )}
      </CardContent>
    </Card>
  );
};
