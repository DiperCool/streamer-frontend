import { gql } from "@apollo/client"

export const BECOME_PARTNER = gql`
    mutation BecomePartner {
        becomePartner {
            id
        }
    }
`

export const GENERATE_ONBOARDING_LINK = gql`
    mutation GenerateOnboardingLink {
        generateOnboardingLink {
            onboardingLink
        }
    }
`