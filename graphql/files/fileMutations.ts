import { gql } from "@apollo/client"

export const UPLOAD_FILE = gql`
    mutation UploadFile($input: UploadFileInput!) {
        upload(input: $input) {
            fileName
        }
    }
`