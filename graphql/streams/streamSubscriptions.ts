import { gql } from "@apollo/client"

export const STREAM_UPDATED_SUBSCRIPTION = gql`
    subscription StreamUpdated($streamId: UUID!) {
        streamUpdated(streamId: $streamId) {
            id
            active
            title
            currentViewers
            language
            streamer {
                id
                userName
                avatar
                followers
            }
            category {
                id
                title
                slug
                image
            }
            tags {
                id
                title
            }
        }
    }
`
export const WATCH_STREAM = gql`
    subscription WatchStream($streamId: UUID!) {
        watchStream(streamId: $streamId) {
            streamId
        }
    }
`

export const SUBSCRIBE_WATCH_STREAM = gql`
    subscription SubscribeWatchStream($streamId: UUID!) {
        subscribeWatchStream(streamId: $streamId) {
            streamId
        }
    }
`