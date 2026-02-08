"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, CreditCard, Trash2, CheckCircle } from "lucide-react";
import {
  useGetPaymentMethodsQuery,
  useMakePaymentMethodDefaultMutation,
  useRemovePaymentMethodMutation,
} from "@/graphql/__generated__/graphql";
import { toast } from "sonner";
import { AddPaymentMethodDialog } from "@/src/components/settings/payment-methods/AddPaymentMethodDialog";
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
import { cn } from "@/lib/utils";

export function PaymentMethodsForm() {
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [paymentMethodToRemove, setPaymentMethodToRemove] = useState<string | null>(null);

  const { data, loading, error, refetch } = useGetPaymentMethodsQuery();
  const [makeDefaultMutation, { loading: makeDefaultLoading }] = useMakePaymentMethodDefaultMutation();
  const [removePaymentMethodMutation, { loading: removeLoading }] = useRemovePaymentMethodMutation();

  const paymentMethods = data?.paymentMethods || [];

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await makeDefaultMutation({
        variables: { paymentMethodId },
      });
      refetch();
      toast.success("Default payment method updated!");
    } catch (err: any) {
      console.error("Failed to set default payment method:", err);
      const errorMessage = err.graphQLErrors?.[0]?.message || "Failed to set default. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleRemovePaymentMethod = async () => {
    if (!paymentMethodToRemove) return;
    try {
      await removePaymentMethodMutation({
        variables: { paymentMethodId: paymentMethodToRemove },
      });
      refetch();
      toast.success("Payment method removed successfully!");
      setPaymentMethodToRemove(null);
    } catch (err: any) {
      console.error("Failed to remove payment method:", err);
      const errorMessage = err.graphQLErrors?.[0]?.message || "Failed to remove. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading payment methods: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Your Payment Methods</CardTitle>
          <Button
            onClick={() => setIsAddCardDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Card
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No payment methods added yet.</p>
          ) : (
            <div className="grid gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-md border",
                    method.isDefault ? "border-green-500 bg-green-900/20" : "border-gray-700 bg-gray-700"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-6 w-6 text-gray-300" />
                    <div>
                      <p className="font-semibold text-white">
                        {method.cardBrand.toUpperCase()} ending in {method.cardLast4}
                      </p>
                      <p className="text-sm text-gray-400">
                        Expires {method.cardExpMonth}/{method.cardExpYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="text-green-400 flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" /> Default
                      </span>
                    )}
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        disabled={makeDefaultLoading}
                        className="border-gray-600 text-gray-300 hover:bg-green-600 hover:text-white"
                      >
                        {makeDefaultLoading ? "Setting..." : "Set as Default"}
                      </Button>
                    )}
                    <AlertDialog open={paymentMethodToRemove === method.id} onOpenChange={(open) => {
                        if (!open) setPaymentMethodToRemove(null);
                    }}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => setPaymentMethodToRemove(method.id)}
                          disabled={removeLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Are you sure you want to remove this payment method?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            This action cannot be undone. Your card ending in{" "}
                            <span className="font-semibold text-white">{method.cardLast4}</span>{" "}
                            will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleRemovePaymentMethod}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={removeLoading}
                          >
                            {removeLoading ? "Removing..." : "Remove"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddPaymentMethodDialog
        isOpen={isAddCardDialogOpen}
        onOpenChange={setIsAddCardDialogOpen}
        refetchPaymentMethods={refetch}
      />
    </div>
  );
}