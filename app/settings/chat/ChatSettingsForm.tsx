"use client"

import React, { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  useGetChatSettingsQuery,
  useUpdateChatSettingsMutation,
} from "@/graphql/__generated__/graphql"

const chatSettingsSchema = z.object({
  slowMode: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().min(0, "Slow mode must be 0 or greater").nullable().optional()
  ),
  followersOnly: z.boolean(),
  subscribersOnly: z.boolean(),
  bannedWords: z.string().optional(),
});

type ChatSettingsFormValues = z.infer<typeof chatSettingsSchema>;

export function ChatSettingsForm() {
  const { data, loading, error, refetch } = useGetChatSettingsQuery();
  const [updateChatSettings, { loading: updateLoading }] = useUpdateChatSettingsMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ChatSettingsFormValues>({
    resolver: zodResolver(chatSettingsSchema),
    defaultValues: {
      slowMode: null,
      followersOnly: false,
      subscribersOnly: false,
      bannedWords: "",
    },
  });

  useEffect(() => {
    if (data?.chatSettings) {
      reset({
        slowMode: data.chatSettings.slowMode,
        followersOnly: data.chatSettings.followersOnly,
        subscribersOnly: data.chatSettings.subscribersOnly,
        bannedWords: data.chatSettings.bannedWords.join(", "),
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: ChatSettingsFormValues) => {
    if (!data?.chatSettings.id) return;

    try {
      await updateChatSettings({
        variables: {
          request: {
            id: data.chatSettings.id,
            slowMode: values.slowMode,
            followersOnly: values.followersOnly,
            subscribersOnly: values.subscribersOnly,
            bannedWords: values.bannedWords ? values.bannedWords.split(",").map(word => word.trim()).filter(Boolean) : [],
          },
        },
      });
      refetch();
    } catch (err) {
      console.error("Failed to update chat settings:", err);
    }
  };

  const handleCancel = () => {
    if (data?.chatSettings) {
      reset({
        slowMode: data.chatSettings.slowMode,
        followersOnly: data.chatSettings.followersOnly,
        subscribersOnly: data.chatSettings.subscribersOnly,
        bannedWords: data.chatSettings.bannedWords.join(", "),
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
    return <div className="text-red-500">Error loading chat settings: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Chat Settings</h2>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Chat Moderation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Slow Mode */}
          <div className="space-y-1">
            <Label htmlFor="slowMode" className="text-white">Slow Mode (seconds)</Label>
            <p className="text-sm text-gray-400"> {/* Убран mb-2 */}
              Limit how frequently users can send messages. Set to 0 to disable.
            </p>
            <Input
              id="slowMode"
              type="number"
              {...register("slowMode")}
              placeholder="0 for off"
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
            />
            {errors.slowMode && (
              <p className="text-red-500 text-sm mt-1">{errors.slowMode.message}</p>
            )}
          </div>

          {/* Followers Only */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1"> {/* Добавлен space-y-1 */}
              <Label htmlFor="followersOnly" className="text-white">Followers Only Chat</Label>
              <p className="text-sm text-gray-400">
                Only followers can send messages in chat.
              </p>
            </div>
            <Switch
              id="followersOnly"
              checked={watch("followersOnly")}
              onCheckedChange={(checked) => setValue("followersOnly", checked, { shouldDirty: true })}
              className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
            />
          </div>

          {/* Subscribers Only */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1"> {/* Добавлен space-y-1 */}
              <Label htmlFor="subscribersOnly" className="text-white">Subscribers Only Chat</Label>
              <p className="text-sm text-gray-400">
                Only subscribers can send messages in chat.
              </p>
            </div>
            <Switch
              id="subscribersOnly"
              checked={watch("subscribersOnly")}
              onCheckedChange={(checked) => setValue("subscribersOnly", checked, { shouldDirty: true })}
              className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
            />
          </div>

          {/* Banned Words */}
          <div className="space-y-1">
            <Label htmlFor="bannedWords" className="text-white">Banned Words (comma-separated)</Label>
            <p className="text-sm text-gray-400"> {/* Убран mb-2 */}
              Messages containing these words will be blocked. Separate words with commas.
            </p>
            <Textarea
              id="bannedWords"
              {...register("bannedWords", {
                onChange: () => {
                  if (!isDirty) {
                    setValue("bannedWords", watch("bannedWords"), { shouldDirty: true });
                  }
                }
              })}
              placeholder="word1, word2, word3"
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500 min-h-[100px]"
            />
            {errors.bannedWords && (
              <p className="text-red-500 text-sm mt-1">{errors.bannedWords.message}</p>
            )}
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