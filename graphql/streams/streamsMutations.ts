import { gql } from "@apollo/client"

export const UPDATE_STREAM_SETTINGS = gql`
    mutation UpdateStreamSettings {
        updateStreamSettings {
            id
        }
    }
`

export const UPDATE_STREAM_INFO = gql`
    mutation UpdateStreamInfo($streamInfo: UpdateStreamInfoInput!) {
        updateStreamInfo(streamInfo: $streamInfo) {
            id
        }
    }
`