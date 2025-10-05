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
  useGetBotByIdQuery,
  useEditBotMutation,
  BotState,
  GetBotsDocument,
  SortEnumType,
} from "@/graphql/__generated__/graphql";
import { toast } from "sonner";
import { useApolloClient } from "@apollo/client"; // Импортируем useApolloClient

const editBotSchema = z.object({
  id: z.string().uuid("Invalid bot ID"),
  streamVideoUrl: z.string().url("Invalid URL format").min(1, "Stream video URL is required"),
  state: z.nativeEnum(BotState, {
    errorMap: () => ({ message: "Please select a bot state" }),
  }),
});

type EditBotFormValues = z.infer<typeof editBotSchema>;

interface EditBotDialogProps {
  botId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetchBots: () => void;
}

export const EditBotDialog: React.FC<EditBotDialogProps> = ({
  botId,
  isOpen,
  onOpenChange,
  refetchBots,
}) => {
  const client = useApolloClient(); // Инициализируем Apollo Client
  const { data: botData, loading: botLoading, error: botError, refetch: refetchBotById } = useGetBotByIdQuery({
    variables: { id: botId },
    skip: !isOpen || !botId,
  });

  const [editBotMutation, { loading: editLoading }] = useEditBotMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isDirty, isValid },
  } = useForm<EditBotFormValues>({
    resolver: zodResolver(editBotSchema),
    defaultValues: {
      id: botId,
      streamVideoUrl: "",
      state: BotState.Stopped,
    },
  });

  useEffect(() => {
    if (isOpen && botId) {
      refetchBotById();
    }
  }, [isOpen, botId, refetchBotById]);

  useEffect(() => {
    if (isOpen && botData?.gBot) {
      const bot = botData.gBot;
      reset({
        id: bot.id,
        streamVideoUrl: bot.streamVideoUrl,
        state: bot.state,
      });
    } else if (!isOpen) {
      reset();
      clearErrors();
    }
  }, [isOpen, reset, botData, clearErrors]);

  const onSubmit = async (values: EditBotFormValues) => {
    try {
      await editBotMutation({
        variables: {
          input: {
            id: values.id,
            streamVideoUrl: values.streamVideoUrl,
            state: values.state,
          },
        },
      });
      refetchBots(); // Обновляем список ботов
      onOpenChange(false);
      toast.success("Bot updated successfully!");
    } catch (error: any) {
      console.error("Error updating bot:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to update bot. Please try again.";
      toast.error(errorMessage);
    }
  };

  const isLoading = botLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isLoading ? "Loading Bot..." : botError ? "Error Loading Bot" : `Edit Bot: ${botData?.gBot?.streamer?.userName || "..."}`}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isLoading ? "Fetching bot details." : botError ? botError.message : "Update the details for this bot."}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : botError ? (
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} className="bg-gray-700 hover:bg-gray-600 text-white">
              Close
            </Button>
          </DialogFooter>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
                value={watch("state")}
                onValueChange={(value: BotState) => setValue("state", value, { shouldDirty: true })}
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
                disabled={editLoading || !isDirty || !isValid}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {editLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};