import { gql } from "@apollo/client"

export const GET_TAGS = gql`
    query GetTags(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $order: [TagDtoSortInput!]
        $where: TagDtoFilterInput
    ) {
        tags(
            after: $after
            before: $before
            first: $first
            last: $last
            order: $order
            where: $where
        ) {
            nodes {
                id
                title
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