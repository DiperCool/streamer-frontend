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

export const ProfileSettings = () => {
    const { data: streamer, loading: streamerLoadig  } = useGetMeQuery();
    const { data: profile, refetch } = useGetProfileQuery({
        variables:{
            streamerId: streamer?.me.id
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
                            <p className="text-gray-400">{streamer?.me.userName}'s Kick Channel</p>
                        </div>
                    </div>
                    
                    {/* Social Media Links */}
                    {(streamerProfile.instagram || streamerProfile.youtube || streamerProfile.discord) && (
                        <div className="flex items-center space-x-4 mb-6">
                            {streamerProfile.instagram && (
                                <div className="flex items-center space-x-2 text-gray-300">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    <span className="text-sm">{streamerProfile.instagram}</span>
                                </div>
                            )}
                            
                            {streamerProfile.youtube && (
                                <div className="flex items-center space-x-2 text-gray-300">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                    <span className="text-sm">{streamerProfile.youtube}</span>
                                </div>
                            )}
                            
                            {streamerProfile.discord && (
                                <div className="flex items-center space-x-2 text-gray-300">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                                    </svg>
                                    <span className="text-sm">{streamerProfile.discord}</span>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <UpdateAvatar refetch={refetch}/>
                </CardContent>
            </Card>

            <UpdateChannelBanner refetch={refetch} profile={{...streamerProfile, streamerId: streamer.me.id}}/>

            <UpdateOfflineBanner refetch={refetch} profile={{...streamerProfile, streamerId: streamer.me.id}}/>
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

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            value={streamer?.me.email}
                            id="email"
                            readOnly={true}
                            type="email"
                            className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                        />
                    </div>

                   <UpdateBio refetch={refetch} profile={{...streamerProfile, streamerId: streamer.me.id}}/>
                </CardContent>
            </Card>

            <UpdateSocialMedia refetch={refetch} profile={{...streamerProfile, streamerId: streamer.me.id}}/>
        </div>
    )
}