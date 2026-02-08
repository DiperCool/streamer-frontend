import { gql } from "@apollo/client"

export const GET_PAYMENT_METHODS = gql`
    query GetPaymentMethods {
        paymentMethods {
            id
            cardBrand
            cardLast4
            cardExpMonth
            cardExpYear
            isDefault
        }
    }
`