import { gql } from "@apollo/client"

export const CREATE_PAYMENT_INTENT = gql`
    mutation CreatePaymentIntent($paymentMethodId: String!, $subscriptionPlanId: UUID!) {
        createPaymentIntent(paymentMethodId: $paymentMethodId, subscriptionPlanId: $subscriptionPlanId) {
            clientSecret
        }
    }
`