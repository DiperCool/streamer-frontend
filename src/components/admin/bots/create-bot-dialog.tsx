"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  useCreateBotMutation,
  BotState,
  useGetStreamersQuery,
  SortEnumType,
} from "@/graphql/__generated__/graphql";
import { toast } from "sonner";
import { StreamerSelectInput } from "@/src/components/ui/streamer-select-input"; // Предполагаем, что этот компонент существует

const createBotSchema = z.object({
  streamerUserName: z.string().min(1, "Streamer username is required"),
  streamerId: z.string().min(1, "Streamer ID is required").nullable().refine(val => val !== null, {
    message: "Please select a streamer from the list",
  }),
  streamVideoUrl: z.string().url("Invalid URL format").min(1, "Stream video URL is required"),
  state: z.nativeEnum(BotState, {
    errorMap: () => ({ message: "Please select a bot state" }),
  }),
});

type CreateBotFormValues = z.infer<typeof createBotSchema>;

interface CreateBotDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetchBots: () => void;
}

export const CreateBotDialog: React.FC<CreateBotDialogProps> = ({
  isOpen,
  onOpenChange,
  refetchBots,
}) => {
  const [createBotMutation, { loading: createLoading }] = useCreateBotMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<CreateBotFormValues>({
    resolver: zodResolver(createBotSchema),
    defaultValues: {
      streamerUserName: "",
      streamerId: null,
      streamVideoUrl: "",
      state: BotState.Stopped, // Default to STOPPED
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      clearErrors();
    }
  }, [isOpen, reset, clearErrors]);

  const onSubmit = async (values: CreateBotFormValues) => {
    if (!values.streamerId) {
      setError("streamerId", { type: "manual", message: "Please select a streamer from the list" });
      toast.error("Please select a streamer from the list.");
      return;
    }

    try {
      await createBotMutation({
        variables: {
          input: {
            streamerId: values.streamerId,
            streamVideoUrl: values.streamVideoUrl,
            state: values.state,
          },
        },
      });
      refetchBots();
      onOpenChange(false);
      toast.success("Bot created successfully!");
    } catch (error: any) {
      console.error("Error creating bot:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to create bot. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Bot</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure a new bot for a streamer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="streamerUserName" className="text-right text-white">
              Streamer
            </Label>
            <div className="col-span-3">
              <StreamerSelectInput
                value={watch("streamerUserName")}
                onValueChange={(username, id) => {
                  setValue("streamerUserName", username, { shouldDirty: true });
                  setValue("streamerId", id, { shouldDirty: true, shouldValidate: true });
                  if (id) {
                    clearErrors("streamerUserName");
                    clearErrors("streamerId");
                  } else {
                    setError("streamerId", { type: "manual", message: "Please select a streamer from the list" });
                  }
                }}
                error={errors.streamerUserName?.message || errors.streamerId?.message}
              />
              {errors.streamerId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.streamerId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamVideoUrl" className="text-white">Stream Video URL</Label>
            <Input
              id="streamVideoUrl"
              type="url"
              {...register("streamVideoUrl")}
              placeholder="https://example.com/video.m3u8"
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
            />
            {errors.streamVideoUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.streamVideoUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-white">Bot State</Label>
            <Select
              onValueChange={(value: BotState) => setValue("state", value, { shouldDirty: true })}
              defaultValue={watch("state")}
            >
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus:border-green-500">
                <SelectValue placeholder="Select bot state" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {Object.values(BotState).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state.charAt(0).toUpperCase() + state.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={createLoading || !isValid}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {createLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Create Bot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};