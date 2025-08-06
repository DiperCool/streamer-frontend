import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Camera, Upload, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {FC, useEffect, useState} from "react";
import {getMinioUrl} from "@/utils/utils";
import {
    ProfileDto,
    useUpdateAvatarMutation,
    useUpdateChannelBannerMutation,
    useUpdateOfflineBannerMutation
} from "@/graphql/__generated__/graphql";
import Image from "next/image";
import FileUploadButton from "@/components/ui/fileUploadButton";

interface UpdateOfflineBannerProps {
    profile: ProfileDto
    refetch: () => void;
}
export const UpdateOfflineBanner: FC<UpdateOfflineBannerProps> = ({ refetch, profile }) => {
    const [offlineBanner, setOfflineBanner] = useState(profile.offlineStreamBanner);
    const [updateOfflineBanner] = useUpdateOfflineBannerMutation();
    useEffect(() => {
        setOfflineBanner(profile.offlineStreamBanner)
    }, [profile]);
    const updateChannelBannerFunc =  (file: string) => {
        updateOfflineBanner({
            variables: {
                input:{
                    offlineBanner: file
                }
            }
        }).then(()=>{
            refetch()
        })
    }
    return(
        <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
                <CardTitle className="text-white">Offline Banner</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <div className="relative w-full h-32 md:h-40 lg:h-48 rounded overflow-hidden mb-4"> {/* Отступ снизу у картинки */}
                        <Image
                            src={getMinioUrl(offlineBanner!)}
                            alt="banner"
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                    <FileUploadButton onUpload={updateChannelBannerFunc}>
                        <Upload className="w-4 h-4 mr-2" />
                        Update Banner Image
                    </FileUploadButton>
                </div>
                <p className="text-sm text-gray-400">
                    Minimum image size: 1200×134px and less than 4MB
                </p>
            </CardContent>
        </Card>
    )
}