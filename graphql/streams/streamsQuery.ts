import { gql } from "@apollo/client"

export const GET_CURRENT_STREAM = gql`
    query GetCurrentStream($streamerId: String!) {
        currentStream(streamerId: $streamerId) {
            id
            streamerId
            active
            title
            currentViewers
            language
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

export const GET_STREAM_SETTINGS = gql`
    query GetStreamSettings {
        streamSettings {
            id
            streamKey
            streamUrl
        }
    }
`

export const GET_STREAM_INFO = gql`
    query GetStreamInfo($streamerId: String!) {
        streamInfo(streamerId: $streamerId) {
            id
            streamerId
            title
            language
            categoryId
            category {
                id
                title
            }
            tags {
                id
                title
            }
        }
    }
`