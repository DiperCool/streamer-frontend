import { gql } from "@apollo/client"

export const GET_STREAMER = gql`
    query GetStreamer($userName: String!) {
        streamer(userName: $userName) {
            id
            avatar
            userName
            followers
            isLive
        }
    }
`
export const GET_ME = gql`
    query GetMe {
        me{
            id
            avatar
            userName
            followers
            isLive
        }
    }
`
export const GET_EMAIL = gql`
    query GetMyEmail {
        myEmail{
            email
        }
    }
`

export const GET_STREAMER_INTERACTION = gql`
    query StreamerInteraction($streamerId: String!) {
        streamerInteraction(streamerId: $streamerId) {
            followed
            followedAt
        }
    }
`