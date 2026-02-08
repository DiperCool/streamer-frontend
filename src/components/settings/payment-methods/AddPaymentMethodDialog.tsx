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
import { Loader2 } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCreateSetupIntentMutation } from "@/graphql/__generated__/graphql";
import { toast } from "sonner";
import { useAuth0 } from "@auth0/auth0-react";

interface AddPaymentMethodDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetchPaymentMethods: () => void;
}

export const AddPaymentMethodDialog: React.FC<AddPaymentMethodDialogProps> = ({
  isOpen,
  onOpenChange,
  refetchPaymentMethods,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { getAccessTokenSilently } = useAuth0();

  const [createSetupIntentMutation, { loading: createSetupIntentLoading }] = useCreateSetupIntentMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Card details not entered.");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create a SetupIntent on your backend
      const { data } = await createSetupIntentMutation();
      const clientSecret = data?.createSetupIntent.clientSecret;

      if (!clientSecret) {
        throw new Error("Failed to get client secret from backend.");
      }

      // 2. Confirm the SetupIntent with Stripe.js
      const { setupIntent, error } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        setErrorMessage(error.message || "An unknown error occurred.");
        toast.error(error.message || "Failed to add card.");
      } else if (setupIntent?.status === "succeeded") {
        toast.success("Payment method added successfully!");
        refetchPaymentMethods();
        onOpenChange(false);
      } else {
        setErrorMessage("Setup failed: " + setupIntent?.status);
        toast.error("Failed to add card.");
      }
    } catch (err: any) {
      console.error("Error adding payment method:", err);
      setErrorMessage(err.message || "An unexpected error occurred.");
      toast.error(err.message || "Failed to add card. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#E5E7EB', // gray-200
        '::placeholder': {
          color: '#9CA3AF', // gray-400
        },
      },
      invalid: {
        color: '#EF4444', // red-500
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Payment Method</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your card details to add a new payment method.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="card-element" className="text-white">Card Details</Label>
            <div className="p-3 border border-gray-600 rounded-md bg-gray-700">
              <CardElement id="card-element" options={cardElementOptions} />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!stripe || !elements || isProcessing || createSetupIntentLoading}
            >
              {isProcessing || createSetupIntentLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Add Card"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};