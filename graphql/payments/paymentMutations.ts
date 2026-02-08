import { gql } from "@apollo/client"

export const CREATE_SETUP_INTENT = gql`
    mutation CreateSetupIntent {
        createSetupIntent {
            clientSecret
        }
    }
`

export const MAKE_PAYMENT_METHOD_DEFAULT = gql`
    mutation MakePaymentMethodDefault($paymentMethodId: UUID!) {
        makePaymentMethodDefault(paymentMethodId: $paymentMethodId) {
            id
        }
    }
`

export const REMOVE_PAYMENT_METHOD = gql`
    mutation RemovePaymentMethod($paymentMethodId: UUID!) {
        removePaymentMethod(paymentMethodId: $paymentMethodId) {
            id
        }
    }
`