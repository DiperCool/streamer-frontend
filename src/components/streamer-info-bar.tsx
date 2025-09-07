"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, Settings, ExternalLink, Users, CheckCircle } from "lucide-react"
import { ProfileDto, StreamerDto, StreamDto, StreamInfoDto, useFollowStreamerMutation, useStreamerInteractionQuery, useUnfollowStreamerMutation } from "@/graphql/__generated__/graphql"
import { getMinioUrl } from "@/utils/utils"
import { useAuth0 } from "@auth0/auth0-react"
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
} from "@/components/ui/alert-dialog"

interface StreamerInfoBarProps {
  streamer: StreamerDto
  profile: ProfileDto
  currentStream?: StreamDto | null
  streamInfo?: StreamInfoDto | null
  isCurrentUserProfile: boolean
  isLive: boolean;
  onTogglePlayerMaximize: () => void;
}

export function StreamerInfoBar({ streamer, profile, currentStream, streamInfo, isCurrentUserProfile, isLive, onTogglePlayerMaximize }: StreamerInfoBarProps) {
  const avatarImage = streamer.avatar || "/placeholder-user.jpg";
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

  const { data: streamerInteractionData, loading: interactionLoading, refetch: refetchInteraction } = useStreamerInteractionQuery({
    variables: { streamerId: streamer.id },
    skip: !isAuthenticated || authLoading || !streamer.id,
  });

  const [followStreamer, { loading: followLoading }] = useFollowStreamerMutation();
  const [unfollowStreamer, { loading: unfollowLoading }] = useUnfollowStreamerMutation();

  const isFollowing = streamerInteractionData?.streamerInteraction?.followed;
  const actionLoading = followLoading || unfollowLoading || interactionLoading;

  const handleFollow = async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated. Cannot follow.");
      return;
    }
    await followStreamer({ variables: { input: { streamerId: streamer.id } } });
    refetchInteraction();
  };

  const handleUnfollow = async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated. Cannot unfollow.");
      return;
    }
    await unfollowStreamer({ variables: { input: { streamerId: streamer.id } } });
    refetchInteraction();
    setShowUnfollowDialog(false);
  };

  const displayTitle = currentStream?.title;
  const displayLanguage = currentStream?.language;
  const displayTags = currentStream?.tags;

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-white">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1 cursor-pointer" onClick={onTogglePlayerMaximize}>
          <div className="relative flex-shrink-0">
            <Avatar className="w-20 h-20 border-2 border-green-500">
              <AvatarImage src={getMinioUrl(avatarImage)} alt="Streamer Avatar" />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {streamer.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isLive && (
              <Badge className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                LIVE
              </Badge>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white">{streamer.userName}</h1>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>

            {displayTitle && (
              <p className="text-lg font-normal text-white uppercase mt-1">{displayTitle}</p>
            )}

            <p className="text-gray-400">{streamer.followers} followers</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 mt-4 md:mt-0">
          {!isCurrentUserProfile && isAuthenticated && (
            <>
              {isFollowing ? (
                <AlertDialog open={showUnfollowDialog} onOpenChange={setShowUnfollowDialog}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="bg-gray-800 hover:bg-gray-700 text-white"
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Loading..." : "Following"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Are you sure you want to unfollow?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This action cannot be undone. You will stop receiving updates from {streamer.userName}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnfollow}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={unfollowLoading}
                      >
                        {unfollowLoading ? "Unfollowing..." : "Unfollow"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleFollow}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Loading..." : "Follow"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isLive && (
        <div className="flex items-center flex-wrap gap-2 mt-2">
          {streamInfo?.category?.title && (
            <Badge variant="secondary" className="bg-gray-700 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
              {streamInfo.category.title}
            </Badge>
          )}
          {displayLanguage && (
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
              {displayLanguage}
            </Badge>
          )}
          {displayTags && displayTags.length > 0 && (
            displayTags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                {tag.title}
              </Badge>
            ))
          )}
        </div>
      )}
    </div>
  )
}