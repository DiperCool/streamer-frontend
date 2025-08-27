import { gql } from "@apollo/client"

export const UPDATE_AVATAR = gql`
    mutation UpdateAvatar($input: UpdateAvatarInput!) {
        updateAvatar(input: $input) {
            file
        }
    }
`

export const FOLLOW_STREAMER = gql`
    mutation FollowStreamer($input: FollowInput!) {
        follow(follow: $input) {
            id
        }
    }
`

export const UNFOLLOW_STREAMER = gql`
    mutation UnfollowStreamer($input: UnfollowInput!) {
        unfollow(unfollow: $input) {
            id
        }
    }
`

export const FINISH_AUTH = gql`
    mutation FinishAuth($input: FinishAuthInput!) {
        finishAuth(input: $input) {
            id
        }
    }
`