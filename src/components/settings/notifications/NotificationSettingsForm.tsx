"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetNotificationSettingsQuery,
  useEditNotificationSettingsMutation,
} from "@/graphql/__generated__/graphql";
import { toast } from "sonner";

const notificationSettingsSchema = z.object({
  streamerLive: z.boolean(),
  userFollowed: z.boolean(),
});

type NotificationSettingsFormValues = z.infer<typeof notificationSettingsSchema>;

export function NotificationSettingsForm() {
  const { data, loading, error, refetch } = useGetNotificationSettingsQuery();
  const [editNotificationSettings, { loading: updateLoading }] = useEditNotificationSettingsMutation();

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      streamerLive: true,
      userFollowed: true,
    },
  });

  useEffect(() => {
    if (data?.notificationSettings) {
      reset({
        streamerLive: data.notificationSettings.streamerLive,
        userFollowed: data.notificationSettings.userFollowed,
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: NotificationSettingsFormValues) => {
    if (!data?.notificationSettings.id) return; // ID все еще нужен для refetch, но не для самой мутации

    try {
      await editNotificationSettings({
        variables: {
          input: { // Этот объект 'input' будет сопоставлен с аргументом 'readNotification' в вашей схеме
            streamerLive: values.streamerLive,
            userFollowed: values.userFollowed,
          },
        },
      });
      refetch();
      toast.success("Notification settings updated successfully!");
    } catch (err: any) {
      console.error("Failed to update notification settings:", err);
      const errorMessage = err.graphQLErrors?.[0]?.message || "Failed to update settings. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (data?.notificationSettings) {
      reset({
        streamerLive: data.notificationSettings.streamerLive,
        userFollowed: data.notificationSettings.userFollowed,
      });
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
    return <div className="text-red-500">Error loading notification settings: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Streamer Live Notifications */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="streamerLive" className="text-white">Streamer Goes Live</Label>
              <p className="text-sm text-gray-400">
                Receive notifications when a streamer you follow goes live.
              </p>
            </div>
            <Switch
              id="streamerLive"
              checked={watch("streamerLive")}
              onCheckedChange={(checked) => setValue("streamerLive", checked, { shouldDirty: true })}
              className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
            />
          </div>

          {/* User Followed Notifications */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="userFollowed" className="text-white">New Follower</Label>
              <p className="text-sm text-gray-400">
                Receive notifications when a new user follows your channel.
              </p>
            </div>
            <Switch
              id="userFollowed"
              checked={watch("userFollowed")}
              onCheckedChange={(checked) => setValue("userFollowed", checked, { shouldDirty: true })}
              className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={!isDirty || updateLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={!isDirty || updateLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {updateLoading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}