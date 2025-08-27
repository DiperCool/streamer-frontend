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
                streamer {
                    id
                    userName
                    avatar
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