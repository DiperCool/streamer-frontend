import { gql } from '@apollo/client';

export const GET_MY_TRANSACTIONS = gql`
  query MyTransactions(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $order: [UserTransactionDtoSortInput!]
    $where: UserTransactionDtoFilterInput
  ) {
    myTransactions(
      after: $after
      before: $before
      first: $first
      last: $last
      order: $order
      where: $where
    ) {
      nodes {
        createdAt
        grossAmount
        id
        status
        streamerId
        stripeInvoiceUrl
        transactionType
        streamer {
          id
          userName
          avatar
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;
