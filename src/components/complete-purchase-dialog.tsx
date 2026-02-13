"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Plus } from "lucide-react";
import {
  useGetPaymentMethodsQuery,
  useMakePaymentMethodDefaultMutation,
  useGetMeQuery, // Added to get streamerId for subscription
  usePaymentMethodCreatedSubscription, // Added to listen for new payment methods
  SubscriptionPlanDto,
  PaymentMethodDto, useCreateSubscriptionMutation,
} from "@/graphql/__generated__/graphql";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AddPaymentMethodDialog } from "@/src/components/settings/payment-methods/AddPaymentMethodDialog";
import { cn } from "@/lib/utils";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"; // Import Stripe hooks

interface CompletePurchaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: SubscriptionPlanDto;
  streamerUserName: string;
}

export const CompletePurchaseDialog: React.FC<CompletePurchaseDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedPlan,
  streamerUserName,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const { data: paymentMethodsData, loading: paymentMethodsLoading, error: paymentMethodsError, refetch: refetchPaymentMethods } = useGetPaymentMethodsQuery();
  const [createSubscriptionMutation, { loading: createSubLoading }] = useCreateSubscriptionMutation();
  const { data: meData } = useGetMeQuery(); // Get user data to obtain streamerId
  const streamerId = meData?.me?.id;

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(null);

  // Listen for payment method created events
  usePaymentMethodCreatedSubscription({
    skip: !streamerId || !isOpen, // Only listen if streamerId is available and dialog is open
    onData: async ({ client, data }) => {
      if (data?.data?.paymentMethodCreated) {
        toast.info("New payment method detected, updating list.");
        const { data: newPaymentMethodsData } = await refetchPaymentMethods(); // Refetch to get the newly added method
        if (newPaymentMethodsData?.paymentMethods && newPaymentMethodsData.paymentMethods.length > 0) {
          // Attempt to select the newly created method, or default/first
          const newlyCreatedMethod = newPaymentMethodsData.paymentMethods.find(pm => pm.id === data.data?.paymentMethodCreated?.id);
          const defaultMethod = newPaymentMethodsData.paymentMethods.find(pm => pm.isDefault);
          setSelectedPaymentMethodId(newlyCreatedMethod?.id || defaultMethod?.id || newPaymentMethodsData.paymentMethods[0].id);
        }
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setPaymentErrorMessage(null);
      setIsProcessingPayment(false);
      // Set default payment method if available when dialog opens
      if (paymentMethodsData?.paymentMethods && paymentMethodsData.paymentMethods.length > 0) {
        const defaultMethod = paymentMethodsData.paymentMethods.find(pm => pm.isDefault);
        setSelectedPaymentMethodId(defaultMethod?.id || paymentMethodsData.paymentMethods[0].id);
      } else {
        setSelectedPaymentMethodId(null);
      }
    }
  }, [isOpen, paymentMethodsData]);



  const handlePayNow = async () => {
    if (!selectedPaymentMethodId) {
      setPaymentErrorMessage("Please select a payment method.");
      return;
    }
    if (!stripe || !elements) {
      setPaymentErrorMessage("Stripe.js has not loaded yet.");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentErrorMessage(null);

    try {
      const { data } = await createSubscriptionMutation({
        variables: {
          paymentMethodId: selectedPaymentMethodId,
          subscriptionPlanId: selectedPlan.id,
        },
      });

      const clientSecret = data?.createSubscription.clientSecret;

      if (!clientSecret) {
        throw new Error("Failed to get client secret from backend.");
      }

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        setPaymentErrorMessage(confirmError.message || "Payment failed.");
        toast.error(confirmError.message || "Payment failed.");
      } else if (paymentIntent?.status === "succeeded") {
        toast.success(`Successfully subscribed to ${streamerUserName}'s ${selectedPlan.name}!`);
        onOpenChange(false); // Close dialog on success
      } else {
        setPaymentErrorMessage("Payment failed: " + paymentIntent?.status);
        toast.error("Payment failed.");
      }
    } catch (err: any) {
      console.error("Error processing payment:", err);
      setPaymentErrorMessage(err.message || "An unexpected error occurred during payment.");
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const paymentMethods = paymentMethodsData?.paymentMethods || [];
  const isLoading = paymentMethodsLoading || createSubLoading || isProcessingPayment;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Complete Purchase</DialogTitle>
            <DialogDescription className="text-gray-400">
              Review your subscription and select a payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Product Details */}
            <div className="border-b border-gray-700 pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Product Name</span>
                <span className="font-semibold text-white">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Description</span>
                <span className="text-gray-400">Recurring charge, starting today. Cancel anytime.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Renew Every</span>
                <span className="text-white">1 month</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label className="text-white text-lg font-semibold">Payment Method</Label>
              {paymentMethodsLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                </div>
              ) : paymentMethodsError ? (
                <p className="text-red-500 text-sm">{paymentMethodsError.message}</p>
              ) : paymentMethods.length === 0 ? (
                <p className="text-gray-400">No payment methods found. Please add one.</p>
              ) : (
                <RadioGroup
                  value={selectedPaymentMethodId || undefined}
                  onValueChange={setSelectedPaymentMethodId}
                  className="space-y-2"
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md border cursor-pointer",
                        selectedPaymentMethodId === method.id ? "border-green-500 bg-green-900/20" : "border-gray-700 bg-gray-700 hover:bg-gray-600"
                      )}
                      onClick={() => setSelectedPaymentMethodId(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={`method-${method.id}`} />
                        <Label htmlFor={`method-${method.id}`} className="flex items-center space-x-2 cursor-pointer">
                          <CreditCard className="h-5 w-5 text-gray-300" />
                          <div>
                            <p className="font-medium text-white">{method.cardBrand.toUpperCase()} ending in {method.cardLast4}</p>
                            <p className="text-xs text-gray-400">Expires {method.cardExpMonth}/{method.cardExpYear}</p>
                          </div>
                                  </Label>
                                </div>
                              </div>
                            ))}                </RadioGroup>
              )}

              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 mt-4"
                onClick={() => setIsAddCardDialogOpen(true)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" /> Add a new payment method
              </Button>
            </div>

            {paymentErrorMessage && (
              <p className="text-red-500 text-sm mt-2">{paymentErrorMessage}</p>
            )}

            {/* Total and Pay Now */}
            <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-4">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-xl font-bold text-green-500">${selectedPlan.price.toFixed(2)}/month</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayNow}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading || !selectedPaymentMethodId}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddPaymentMethodDialog
        isOpen={isAddCardDialogOpen}
        onOpenChange={async (open) => {
          setIsAddCardDialogOpen(open);
          if (!open) {
            // Await refetch to ensure paymentMethodsData is up-to-date
            // This is important even with subscriptions to handle potential race conditions
            // or ensure the UI state for selection is aligned with the latest data.
            const { data: newPaymentMethodsData } = await refetchPaymentMethods(); 
            if (newPaymentMethodsData?.paymentMethods && newPaymentMethodsData.paymentMethods.length > 0) {
              const defaultMethod = newPaymentMethodsData.paymentMethods.find(pm => pm.isDefault);
              setSelectedPaymentMethodId(defaultMethod?.id || newPaymentMethodsData.paymentMethods[0].id);
            } else {
              setSelectedPaymentMethodId(null);
            }
          }
        }}
        refetchPaymentMethods={refetchPaymentMethods}
      />
    </>
  );
};