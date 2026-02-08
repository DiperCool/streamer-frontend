import { gql } from "@apollo/client"

export const BECOME_PARTNER = gql`
    mutation BecomePartner($streamerId: String!) {
        becomePartner(streamerId: $streamerId) {
            id
        }
    }
`

export const GENERATE_ONBOARDING_LINK = gql`
    mutation GenerateOnboardingLink($streamerId: String!) {
        generateOnboardingLink(streamerId: $streamerId) {
            onboardingLink
        }
    }
`