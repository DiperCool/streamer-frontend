import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Camera, Upload, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import { z } from "zod";
import {Textarea} from "@/components/ui/textarea";
import {
    useGetMeQuery,
    useGetProfileQuery,
    useGetStreamerQuery,
    useUpdateProfileMutation
} from "@/graphql/__generated__/graphql";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UpdateAvatar} from "@/app/settings/profile/updateAvatar";
import {getMinioUrl} from "@/utils/utils";
import Image from "next/image";
import {UpdateSocialMedia} from "@/app/settings/profile/updateSocialMedia";
import {UpdateChannelBanner} from "@/app/settings/profile/updateChannelBanner";
import {UpdateOfflineBanner} from "@/app/settings/profile/updateOfflineBanner";
import { UpdateBio } from "./updateBio";
import { SocialMediaLink } from "@/components/ui/social-media-link";
import {EmailSettings} from "@/app/settings/profile/emailSettings";

export const ProfileSettings = () => {
    const { data: streamer, loading: streamerLoadig, refetch: refetchMe } = useGetMeQuery();
    const { data: profile, refetch } = useGetProfileQuery({
        variables:{
            streamerId: streamer?.me.id ?? ""
        },
        skip: !streamer?.me.id
    })
    const streamerProfile = profile?.profile;
    if (streamerLoadig || !streamer?.me || !streamerProfile) return <div>Loading...</div>;
    const refetchProfile = ()=>{
        refetch()
    }
    return(
        <div>
            <h2 className="text-2xl font-semibold mb-6">Profile</h2>

            {/* Profile Preview */}
            <Card className="bg-gray-800 border-gray-700 mb-8">
                <CardHeader>
                    <CardTitle className="text-white">Profile Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-6">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={getMinioUrl(streamer?.me.avatar!)} alt="Profile" />
                            <AvatarFallback className="bg-blue-600 text-white">D</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold text-white">About {streamer.me.userName}</h3>
                                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                    <Users className="w-3 h-3 mr-1" />
                                    {streamer.me.followers} Followers
                                </Badge>
                            </div>

                            {/* Social Media Links */}
                            {(streamerProfile.instagram || streamerProfile.youtube || streamerProfile.discord) && (
                                <div className="flex items-center space-x-4 mb-2">
                                    {streamerProfile.instagram && (
                                        <SocialMediaLink
                                            platform="instagram"
                                            username={streamerProfile.instagram}
                                            href={`https://instagram.com/${streamerProfile.instagram}`}
                                        />
                                    )}

                                    {streamerProfile.youtube && (
                                        <SocialMediaLink
                                            platform="youtube"
                                            username={streamerProfile.youtube}
                                            href={`https://youtube.com/${streamerProfile.youtube}`}
                                        />
                                    )}

                                    {streamerProfile.discord && (
                                        <SocialMediaLink
                                            platform="discord"
                                            username={streamerProfile.discord}
                                            href={`https://discord.gg/${streamerProfile.discord}`}
                                        />
                                    )}
                                </div>
                            )}

                            <p className="text-gray-400">{streamer?.me.userName}{profile?.profile.bio}</p>
                        </div>
                    </div>

                    <UpdateAvatar refetch={refetchProfile} refetchMe={refetchMe} />
                </CardContent>
            </Card>


            <UpdateChannelBanner refetch={refetchProfile} profile={{...streamerProfile, streamerId: streamer.me.id}}/>

            <UpdateOfflineBanner refetch={refetchProfile} profile={{...streamerProfile, streamerId: streamer.me.id}}/>
            <Card className="bg-gray-800 border-gray-700 mb-8">
                <CardHeader>
                    <CardTitle className="text-white">Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-white">Username</Label>
                        <Input
                            id="username"
                            readOnly={true}
                            value={streamer?.me.userName}
                            className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                        />
                        <p className="text-sm text-gray-400">
                            You need to enable 2FA to update your username.{" "}
                            <button className="text-white underline hover:text-green-400">
                                Click here to setup 2FA.
                            </button>
                        </p>
                    </div>

                    <EmailSettings/>

                   <UpdateBio refetch={refetchProfile} profile={{...streamerProfile, streamerId: streamer.me.id}}/>
                </CardContent>
            </Card>

            <UpdateSocialMedia refetch={refetchProfile} profile={{...streamerProfile, streamerId: streamer.me.id}}/>
        </div>
    )
}