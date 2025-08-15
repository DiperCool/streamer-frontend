import { gql } from "@apollo/client"

export const STREAMER_UPDATED_SUBSCRIPTION = gql`
    subscription StreamerUpdated($streamId: UUID!) {
        streamerUpdated(streamId: $streamId) {
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
        }
    }
`