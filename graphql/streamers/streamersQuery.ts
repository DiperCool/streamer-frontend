import { gql } from "@apollo/client"

export const GET_STREAMERS = gql`
    query GetStreamers(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $order: [StreamerDtoSortInput!]
        $search: String
        $where: StreamerDtoFilterInput
    ) {
        streamers(
            after: $after
            before: $before
            first: $first
            last: $last
            order: $order
            search: $search
            where: $where
        ) {
            nodes {
                id
                userName
                avatar
                followers
                isLive
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