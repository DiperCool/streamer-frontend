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

export const GET_MY_FOLLOWINGS = gql`
    query GetMyFollowings(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $order: [StreamerFollowerDtoSortInput!]
        $where: StreamerFollowerDtoFilterInput
    ) {
        myFollowings(
            after: $after
            before: $before
            first: $first
            last: $last
            order: $order
            where: $where
        ) {
            nodes {
                id
                userName
                avatar
                isLive
                currentStream { # Changed back to currentStream
                    id
                    title
                    category {
                        id
                        title
                    }
                    currentViewers
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

export const GET_MY_FOLLOWERS = gql`
    query GetMyFollowers(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $order: [FollowerDtoSortInput!]
        $where: FollowerDtoFilterInput
    ) {
        myFollowers(
            after: $after
            before: $before
            first: $first
            last: $last
            order: $order
            where: $where
        ) {
            nodes {
                followerStreamerId
                followedAt
                followerStreamer {
                    id
                    userName
                    avatar
                    isLive
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