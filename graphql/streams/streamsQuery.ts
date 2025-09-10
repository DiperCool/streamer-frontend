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
            started # Добавлено новое поле
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

export const GET_STREAMS = gql`
    query GetStreams(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $order: [StreamDtoSortInput!]
        $categoryId: UUID
        $languages: [String!]
        $tag: UUID
        $where: StreamDtoFilterInput
    ) {
        streams(
            after: $after
            before: $before
            first: $first
            last: $last
            order: $order
            categoryId: $categoryId
            languages: $languages
            tag: $tag
            where: $where
        ) {
            nodes {
                id
                title
                preview
                currentViewers
                language
                started
                streamer {
                    id
                    userName
                    avatar
                    isLive
                }
                category {
                    id
                    title
                    image
                }
                tags {
                    id
                    title
                }
            }
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
        }
    }
`

export const GET_TOP_STREAMS = gql`
    query GetTopStreams {
        topStreams {
            id
            title
            preview
            currentViewers
            language
            started
            active
            streamer {
                id
                userName
                avatar
                isLive
            }
            sources {
                streamId
                url
                sourceType
            }
            category {
                id
                title
                image
            }
            tags {
                id
                title
            }
        }
    }
`