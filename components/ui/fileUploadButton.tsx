import React, { useRef } from "react";
import { useUploadFileMutation } from "@/graphql/__generated__/graphql";
import { Button } from "@/components/ui/button";
import {useAuth0} from "@auth0/auth0-react";

interface FileUploadButtonProps {
    accept?: string;
    onUpload: (url: string) => void;
    children?: React.ReactNode;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
                                                               accept,
                                                               onUpload,
                                                               children,
                                                           }) => {
    const [uploadFile, { loading }] = useUploadFileMutation();
    const { getAccessTokenSilently } = useAuth0();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => inputRef.current?.click();

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const token = await getAccessTokenSilently();

        const file = files[0];

        const formData = new FormData();
        formData.append("operations", JSON.stringify({
            query: `
            mutation UploadFile($input: UploadFileInput!) {
                upload(input: $input) {
                    fileName
                }
            }
        `,
            variables: {
                input: {
                    file: null
                }
            }
        }));
        formData.append("map", JSON.stringify({
            "0": ["variables.input.file"]
        }));
        formData.append("0", file);

        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URI!, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'GraphQL-preflight': '1'
            },
            body: formData
        });

        const result = await response.json();
        const fileName = result?.data?.upload?.fileName;

        if (fileName) {
            onUpload(fileName);
        }

        e.target.value = "";
    };

    return (
        <>
            <Button
                onClick={handleClick}
                disabled={loading}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
                {loading ? "Loading..." : children}
            </Button>
            <input
                ref={inputRef}
                type="file"
                hidden
                accept={accept}
                onChange={handleChange}
            />
        </>
    );
};

export default FileUploadButton;
