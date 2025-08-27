"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFinishAuthMutation, useGetMeQuery } from "@/graphql/__generated__/graphql";
import { Loader2 } from "lucide-react";

const usernameSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

type UsernameFormValues = z.infer<typeof usernameSchema>;

interface UsernameSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsernameSetupDialog: React.FC<UsernameSetupDialogProps> = ({ isOpen, onClose }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [finishAuthMutation, { loading: mutationLoading }] = useFinishAuthMutation();
  const { refetch: refetchMe } = useGetMeQuery(); // To refetch user data after successful setup

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      userName: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setErrorMessage(null);
    }
  }, [isOpen, reset]);

  const onSubmit = async (values: UsernameFormValues) => {
    setErrorMessage(null);
    try {
      await finishAuthMutation({
        variables: {
          input: {
            userName: values.userName,
          },
        },
      });
      await refetchMe(); // Refetch 'me' query to update finishedAuth status
      onClose(); // Close the dialog on success
    } catch (error: any) {
      const graphQLError = error.graphQLErrors?.[0]?.message;
      if (graphQLError && graphQLError.includes("username is already taken")) {
        setErrorMessage("This username is already taken. Please choose another one.");
        setError("userName", { type: "manual", message: "Username taken" });
      } else {
        setErrorMessage(graphQLError || "An unexpected error occurred. Please try again.");
      }
      console.error("Error setting username:", error);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Set Your Username</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Welcome to Streamer! Please choose a unique username to get started. This cannot be changed later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-white">Username</Label>
            <Input
              id="userName"
              type="text"
              {...register("userName")}
              placeholder="Your unique username"
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
            )}
            {errorMessage && !errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
          </div>
          <AlertDialogFooter>
            <Button
              type="submit"
              disabled={mutationLoading}
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              {mutationLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                "Save Username"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};