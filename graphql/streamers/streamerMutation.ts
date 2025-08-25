import { gql } from "@apollo/client"

export const UPDATE_AVATAR = gql`
    mutation UpdateAvatar($input: UpdateAvatarInput!) {
        updateAvatar(input: $input) {
            file
        }
    }
`

export const FOLLOW_STREAMER = gql`
    mutation FollowStreamer($streamerId: String!) {
        followStreamer(streamerId: $streamerId) {
            followed
            followedAt
        }
    }
`

export const UNFOLLOW_STREAMER = gql`
    mutation UnfollowStreamer($streamerId: String!) {
        unfollowStreamer(streamerId: $streamerId) {
            followed
            followedAt
        }
    }
`