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
import { useBanUserMutation } from "@/graphql/__generated__/graphql";
import { useDashboard } from "@/src/contexts/DashboardContext";
import { toast } from "sonner";
import { DateTime } from "luxon";

interface BanUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userIdToBan: string;
  userNameToBan: string;
  refetchStreamerInteraction: () => Promise<any>; // Добавлено
}

export const BanUserDialog: React.FC<BanUserDialogProps> = ({
  isOpen,
  onOpenChange,
  userIdToBan,
  userNameToBan,
  refetchStreamerInteraction, // Деструктурируем
}) => {
  const { activeStreamer } = useDashboard();
  const streamerId = activeStreamer?.id ?? "";

  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("1h"); // Default to 1 hour
  const [banUserMutation, { loading: banLoading }] = useBanUserMutation();

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setDuration("1h");
    }
  }, [isOpen]);

  const handleBan = async () => {
    if (!streamerId || !userIdToBan) {
      toast.error("Missing streamer or user ID for banning.");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for the ban.");
      return;
    }

    try {
      const now = DateTime.now();
      let banUntil: DateTime;

      switch (duration) {
        case "1h":
          banUntil = now.plus({ hours: 1 });
          break;
        case "1d":
          banUntil = now.plus({ days: 1 });
          break;
        case "1w":
          banUntil = now.plus({ weeks: 1 });
          break;
        case "forever":
          banUntil = now.plus({ years: 100 }); // Effectively permanent
          break;
        default:
          toast.error("Invalid ban duration selected.");
          return;
      }

      await banUserMutation({
        variables: {
          request: {
            userId: userIdToBan,
            broadcasterId: streamerId,
            reason: reason.trim(),
            banUntil: banUntil.toISO()!,
          },
        },
      });
      toast.success(`${userNameToBan} has been banned.`);
      await refetchStreamerInteraction(); // Используем переданную функцию refetch
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error banning user:", error);
      const errorMessage = error.graphQLErrors?.[0]?.message || "Failed to ban user. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Ban {userNameToBan}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Permanently or temporarily prevent this user from chatting in your channel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white">Reason</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Spamming, harassment"
              className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-white">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus:border-green-500">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
                <SelectItem value="1w">1 Week</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            disabled={banLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBan}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={banLoading}
          >
            {banLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Ban User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};