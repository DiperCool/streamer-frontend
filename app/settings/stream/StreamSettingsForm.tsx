"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useGetStreamSettingsQuery, useUpdateStreamSettingsMutation } from "@/graphql/__generated__/graphql"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const streamSettingsSchema = z.object({
  streamUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  streamKey: z.string().min(1, "Stream key cannot be empty"),
});

type StreamSettingsFormValues = z.infer<typeof streamSettingsSchema>;

export function StreamSettingsForm() {
  const [showStreamUrl, setShowStreamUrl] = useState(false)
  const [showStreamKey, setShowStreamKey] = useState(false)

  const { data, loading, error, refetch } = useGetStreamSettingsQuery();
  const [updateStreamSettings, { loading: updateLoading }] = useUpdateStreamSettingsMutation();

  const {
    register,
    reset,
    formState: { errors },
  } = useForm<StreamSettingsFormValues>({
    resolver: zodResolver(streamSettingsSchema),
    defaultValues: {
      streamUrl: "",
      streamKey: "",
    },
  });

  useEffect(() => {
    if (data?.streamSettings) {
      reset({
        streamUrl: data.streamSettings.streamUrl || "",
        streamKey: data.streamSettings.streamKey || "",
      });
    }
  }, [data, reset]);

  const handleResetStreamKey = async () => {
    try {
      await updateStreamSettings();
      refetch();
    } catch (err) {
      console.error("Failed to reset stream key:", err);
      // Optionally show a toast notification for error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading stream settings: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Stream URL and Key</h2>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Stream URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              id="stream-url"
              type={showStreamUrl ? "text" : "password"}
              {...register("streamUrl")}
              readOnly // Make input read-only
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500 pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-white"
              onClick={() => setShowStreamUrl(!showStreamUrl)}
              type="button"
            >
              {showStreamUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.streamUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.streamUrl.message}</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Stream Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex items-center">
            <Input
              id="stream-key"
              type={showStreamKey ? "text" : "password"}
              {...register("streamKey")}
              readOnly // Make input read-only
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500 pr-10 flex-grow"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-white"
              onClick={() => setShowStreamKey(!showStreamKey)}
              type="button"
            >
              {showStreamKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              className="ml-2 border-gray-600 text-gray-300 hover:bg-green-600 hover:text-white"
              onClick={handleResetStreamKey}
              disabled={updateLoading} // Use updateLoading for the button's disabled state
              type="button"
            >
              {updateLoading ? "Resetting..." : "Reset"}
            </Button>
          </div>
          {errors.streamKey && (
            <p className="text-red-500 text-sm mt-1">{errors.streamKey.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}