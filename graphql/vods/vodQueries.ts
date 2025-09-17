import { gql } from "@apollo/client"

export const GET_VODS = gql`
    query GetVods(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $order: [VodDtoSortInput!]
        $streamerId: String!
        $where: VodDtoFilterInput
    ) {
        vods(
            after: $after
            before: $before
            first: $first
            last: $last
            order: $order
            streamerId: $streamerId
            where: $where
        ) {
            nodes {
                id
                title
                description
                preview
                source
                views
                createdAt
                type
                duration
                language
                streamer {
                    id
                    userName
                    avatar
                }
                category {
                    id
                    title
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

export const GET_VOD = gql`
    query GetVod($vodId: UUID!) {
        vod(vodId: $vodId) {
            id
            title
            description
            preview
            source
            views
            createdAt
            duration
            type
            language
            streamer {
                id
                userName
                avatar
            }
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

export const GET_VOD_SETTINGS = gql`
    query GetVodSettings {
        vodSettings {
            id
            vodEnabled
        }
    }
`