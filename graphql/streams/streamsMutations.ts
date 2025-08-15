import { gql } from "@apollo/client"

export const UPDATE_STREAM_SETTINGS = gql`
    mutation UpdateStreamSettings {
        updateStreamSettings {
            id
        }
    }
`