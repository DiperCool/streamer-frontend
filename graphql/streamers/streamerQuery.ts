import { gql } from "@apollo/client"
export const GET_STREAMER = gql`
    query GetStreamer($userName: String!) {
        streamer(userName: $userName) {
            id
            avatar
            email
            userName
            followers
        }
    }
`
export const GET_ME = gql`
    query GetMe {
        me{
            id
            avatar
            email
            userName
            followers
        }
    }
`