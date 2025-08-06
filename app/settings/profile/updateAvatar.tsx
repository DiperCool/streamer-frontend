import {Button} from "@/components/ui/button";
import {Camera} from "lucide-react";
import FileUploadButton from "@/components/ui/fileUploadButton";
import {ProfileDto, useUpdateAvatarMutation} from "@/graphql/__generated__/graphql";
import {FC} from "react";
interface UpdateBioProps {
    refetch: () => void;
}
export const UpdateAvatar: FC<UpdateBioProps> = ({ refetch }) => {

    const [updateAvatarMutation] = useUpdateAvatarMutation();
    const updateAvatar =  (file: string) => {
         updateAvatarMutation({
            variables: {
                input:{
                    file: file,
                }
            }
        }).then(()=>{
            refetch()
         })
    }
    return(
        <FileUploadButton onUpload={updateAvatar}>
            <Camera className="w-4 h-4 mr-2" />
            Edit Avatar
        </FileUploadButton>
    )
}