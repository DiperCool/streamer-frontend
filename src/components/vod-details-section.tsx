"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, Settings, Users, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { VodDto, StreamerDto, ProfileDto, useFollowStreamerMutation, useStreamerInteractionQuery, useUnfollowStreamerMutation } from "@/graphql/__generated__/graphql"
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
import { formatDistanceToNowStrict } from "date-fns"

interface VodDetailsSectionProps {
  vod: VodDto
  streamer: StreamerDto
  profile: ProfileDto
}

export function VodDetailsSection({ vod, streamer, profile }: VodDetailsSectionProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  const timeAgo = formatDistanceToNowStrict(new Date(vod.createdAt), { addSuffix: true });
  const avatarImage = streamer.avatar || "/placeholder-user.jpg";

  // Placeholder for tags, as VodDto doesn't have them yet
  const tags = ["Gaming", "Action", "FPS", "English"]; // Example tags

  return (
    <div className="bg-gray-900 text-white">
      <div className="flex items-start justify-between mb-4">
        {/* Left Section: Avatar, Name, Title, Description, Tags */}
        <div className="flex items-start space-x-4 flex-1">
          <Link href={`/${streamer.userName}`} passHref>
            <Avatar className="w-16 h-16 cursor-pointer">
              <AvatarImage src={getMinioUrl(avatarImage)} alt="Streamer Avatar" />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {streamer.userName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Link href={`/${streamer.userName}`} passHref>
                <h1 className="text-xl font-bold text-white hover:text-green-400 cursor-pointer">{streamer.userName}</h1>
              </Link>
              <CheckCircle className="w-4 h-4 text-green-500" /> {/* Verified badge */}
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">{vod.title || "Untitled VOD"}</h2>
            {vod.description && (
              <div className="text-gray-400 text-sm mb-2">
                <p className={showFullDescription ? "" : "line-clamp-2"}>
                  {vod.description}
                </p>
                {vod.description.length > 150 && ( // Simple check for description length
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-400 hover:text-green-500 p-0 h-auto mt-1"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? (
                      <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                    ) : (
                      <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
                    )}
                  </Button>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons and Stats */}
        <div className="flex flex-col items-end space-y-2 ml-4">
          <div className="flex items-center space-x-2">
            {!isAuthenticated && (
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => console.log("Login to follow")} // Placeholder for login action
              >
                Follow
              </Button>
            )}
            {isAuthenticated && (
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
            <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-white">
              Gift Subs
            </Button>
            <Button variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-white">
              Subscribe
            </Button>
          </div>
          <div className="flex items-center space-x-3 text-gray-400 text-sm mt-2">
            <span>{vod.views} views</span>
            <span>•</span>
            <span>{timeAgo}</span>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}