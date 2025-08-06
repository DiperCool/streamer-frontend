import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {FC, useEffect} from "react";
import {ProfileDto, useGetProfileQuery, useUpdateProfileMutation} from "@/graphql/__generated__/graphql";
import z from "zod";
export const profileSchema = z.object({
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    discord: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;
interface UpdateSocialMediaProps {
    profile: ProfileDto
    refetch: () => void;
}
export const UpdateSocialMedia: FC<UpdateSocialMediaProps> = ({ refetch, profile }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            instagram: profile.instagram ?? "",
            youtube: profile.youtube ?? "",
            discord: profile.discord ?? "",
        },
    });

    const [updateProfile, { loading}] = useUpdateProfileMutation();

    const onSubmit = async (values: ProfileForm) => {
        await updateProfile({
            variables: {
                input: {
                    instagram: values.instagram,
                    youtube: values.youtube,
                    discord: values.discord,
                },
            },
        });
        await refetch();
    };
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-white">Instagram</Label>
                    <Input
                        id="instagram"
                        type="text"
                        {...register("instagram")}

                        placeholder="https://instagram.com/yourprofile"
                        className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="youtube" className="text-white">YouTube</Label>
                    <Input
                        id="youtube"
                        type="text"
                        {...register("youtube")}

                        placeholder="https://youtube.com/yourchannel"
                        className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="discord" className="text-white">Discord</Label>
                    <Input
                        id="discord"
                        {...register("discord")}

                        type="text"
                        placeholder="https://discord.gg/yourserver"
                        className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button onClick={()=>{
                        reset()
                    }} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            handleSubmit(onSubmit)();
                        }}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
