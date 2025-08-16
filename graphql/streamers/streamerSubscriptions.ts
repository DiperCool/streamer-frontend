import { gql } from "@apollo/client"

export const STREAMER_UPDATED_SUBSCRIPTION = gql`
    subscription StreamerUpdated($streamerId: String!) {
        streamerUpdated(streamerId: $streamerId) {
            id
            avatar
            userName
            followers
            isLive
        }
    }
`