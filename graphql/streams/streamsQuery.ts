import { gql } from "@apollo/client"

export const GET_CURRENT_STREAM = gql`
    query GetCurrentStream($streamerId: String!) {
        currentStream(streamerId: $streamerId) {
            id
            streamerId
            active
            title
            currentViewers
            streamer {
                id
                isLive
                userName
                avatar
                followers
            }
            sources {
                streamId
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