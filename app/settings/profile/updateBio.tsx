import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {FC, useEffect} from "react";
import {
    ProfileDto,
    useGetProfileQuery,
    useUpdateBioMutation,
    useUpdateProfileMutation
} from "@/graphql/__generated__/graphql";
import z from "zod";
import {Textarea} from "@/components/ui/textarea";
export const profileSchema = z.object({
    bio: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;
interface UpdateBioProps {
    profile: ProfileDto
    refetch: () => void;
}
export const UpdateBio: FC<UpdateBioProps> = ({ profile, refetch }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            bio: profile.bio ?? ""
        },
    });

    const [updateProfile, { loading}] = useUpdateBioMutation();

    const onSubmit = async (values: ProfileForm) => {
        await updateProfile({
            variables: {
                input: {
                   bio: values.bio ?? ""
                },
            },
        });
        refetch()
    };
    return (
        <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">Bio</Label>
            <Textarea
                {...register("bio")}
                id="bio"
                placeholder="Tell us about yourself..."
                className="bg-gray-700 border-gray-600 text-white focus:border-green-500 min-h-[120px]"
            />
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
        </div>
    )
}
