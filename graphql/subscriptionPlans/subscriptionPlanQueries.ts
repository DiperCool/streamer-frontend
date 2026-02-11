import { gql } from "@apollo/client"

export const GET_SUBSCRIPTION_PLANS_BY_STREAMER_ID = gql`
    query GetSubscriptionPlansByStreamerId($streamerId: String!) {
        subscriptionPlansByStreamerId(streamerId: $streamerId) {
            id
            name
            price
            streamerId
        }
    }
`