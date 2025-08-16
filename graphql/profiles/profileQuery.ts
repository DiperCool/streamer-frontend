import { gql } from "@apollo/client"

export const GET_PROFILE = gql`
    query GetProfile($streamerId: String!) {
        profile(streamerId: $streamerId) {
            streamerId
            bio
            channelBanner
            discord
            instagram
            offlineStreamBanner
            youtube
            streamer {
                id
                avatar
                userName
                followers
            }
        }
    }
`
