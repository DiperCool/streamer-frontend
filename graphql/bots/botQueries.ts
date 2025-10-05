import { gql } from "@apollo/client"

export const GET_BOTS = gql`
    query GetBots(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $order: [BotDtoSortInput!]
        $search: String
        $where: BotDtoFilterInput
    ) {
        bots(
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
                state
                streamVideoUrl
                streamerId
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

export const GET_BOT_BY_ID = gql`
    query GetBotById($id: UUID!) {
        gBot(id: $id) {
            id
            state
            streamVideoUrl
            streamerId
            streamer {
                id
                userName
                avatar
            }
        }
    }
`