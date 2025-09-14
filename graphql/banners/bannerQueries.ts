import { gql } from "@apollo/client"

export const GET_BANNERS = gql`
    query GetBanners($streamerId: String!) {
        banners(streamerId: $streamerId) {
            id
            title
            description
            image
            url
        }
    }
`