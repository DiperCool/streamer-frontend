import { gql } from "@apollo/client"

export const CREATE_SUBSCRIPTION = gql`
    mutation CreateSubscription($paymentMethodId: UUID!, $subscriptionPlanId: UUID!) {
        createSubscription(paymentMethodId: $paymentMethodId, subscriptionPlanId: $subscriptionPlanId) {
            clientSecret
        }
    }
`