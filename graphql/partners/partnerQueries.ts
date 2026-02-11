import { gql } from "@apollo/client"

export const GET_PARTNER = gql`
    query GetPartner($streamerId: String!) {
        partner(streamerId: $streamerId) {
            id
            streamerId
            stripeAccountId
            stripeOnboardingStatus
        }
    }
`
