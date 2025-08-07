"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SocialMediaLink } from "@/components/ui/social-media-link"
import { BadgeCheck } from "lucide-react"
import { ProfileDto, StreamerDto } from "@/graphql/__generated__/graphql"

interface StreamerAboutSectionProps {
  streamer: StreamerDto
  profile: ProfileDto
}

export function StreamerAboutSection({ streamer, profile }: StreamerAboutSectionProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-white">About {streamer.userName}</h2>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs flex items-center">
              <BadgeCheck className="w-3 h-3 mr-1" />
              {streamer.followers} Followers
            </Badge>
          </div>
          {(profile.instagram || profile.youtube || profile.discord) && (
            <div className="flex items-center space-x-4">
              {profile.instagram && (
                <SocialMediaLink
                  platform="instagram"
                  username={profile.instagram}
                  href={`https://instagram.com/${profile.instagram}`}
                />
              )}
              {profile.youtube && (
                <SocialMediaLink
                  platform="youtube"
                  username={profile.youtube}
                  href={`https://youtube.com/${profile.youtube}`}
                />
              )}
              {profile.discord && (
                <SocialMediaLink
                  platform="discord"
                  username={profile.discord}
                  href={`https://discord.gg/${profile.discord}`}
                />
              )}
            </div>
          )}
        </div>
        <p className="text-gray-400">{profile.bio}</p>
      </CardContent>
    </Card>
  )
}