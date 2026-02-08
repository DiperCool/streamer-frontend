import { gql } from "@apollo/client"

export const PAYMENT_METHOD_CREATED = gql`
  subscription PaymentMethodCreated {
    paymentMethodCreated {
      id
      cardBrand
      cardLast4
      cardExpMonth
      cardExpYear
      isDefault
    }
  }
`

export const PAYMENT_METHOD_DELETED = gql`
  subscription PaymentMethodDeleted {
    paymentMethodDeleted {
      paymentMethodId
      streamerId
    }
  }
`