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
  useGetVodSettingsQuery,
  useEditVodSettingsMutation,
} from "@/graphql/__generated__/graphql";
import { toast } from "sonner";

const vodSettingsSchema = z.object({
  vodEnabled: z.boolean(),
});

type VodSettingsFormValues = z.infer<typeof vodSettingsSchema>;

export function VodSettingsForm() {
  const { data, loading, error, refetch } = useGetVodSettingsQuery();
  const [editVodSettings, { loading: updateLoading }] = useEditVodSettingsMutation();

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<VodSettingsFormValues>({
    resolver: zodResolver(vodSettingsSchema),
    defaultValues: {
      vodEnabled: false,
    },
  });

  useEffect(() => {
    if (data?.vodSettings) {
      reset({
        vodEnabled: data.vodSettings.vodEnabled,
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: VodSettingsFormValues) => {
    try {
      await editVodSettings({
        variables: {
          request: {
            vodEnabled: values.vodEnabled,
          },
        },
      });
      refetch();
      toast.success("VOD settings updated successfully!");
    } catch (err: any) {
      console.error("Failed to update VOD settings:", err);
      const errorMessage = err.graphQLErrors?.[0]?.message || "Failed to update settings. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    if (data?.vodSettings) {
      reset({
        vodEnabled: data.vodSettings.vodEnabled,
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
    return <div className="text-red-500">Error loading VOD settings: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">VOD Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* VOD Enabled Switch */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="vodEnabled" className="text-white">Enable VODs</Label>
              <p className="text-sm text-gray-400">
                Allow your past broadcasts to be saved and viewed as VODs.
              </p>
            </div>
            <Switch
              id="vodEnabled"
              checked={watch("vodEnabled")}
              onCheckedChange={(checked) => setValue("vodEnabled", checked, { shouldDirty: true })}
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