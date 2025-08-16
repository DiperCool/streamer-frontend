import { gql } from "@apollo/client"

export const GET_CURRENT_STREAM = gql`
    query GetCurrentStream($streamerId: String!) {
        currentStream(streamerId: $streamerId) {
            id
            active
            title
            currentViewers
            streamer {
                id
                userName
                avatar
                followers
            }
            sources {
                url
                sourceType
            }
        }
    }
`

export const GET_STREAM_SETTINGS = gql`
    query GetStreamSettings {
        streamSettings {
            id
            streamKey
            streamUrl
        }
    }
`