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

export const ADMIN_TRANSACTIONS = gql`
  query AdminTransactions(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [TransactionDtoSortInput!]
    $where: TransactionDtoFilterInput
    $fromDate: DateTime
    $toDate: DateTime
  ) {
    adminTransactions(
      first: $first
      after: $after
      last: $last
      before: $before
      order: $order
      where: $where
      fromDate: $fromDate
      toDate: $toDate
    ) {
      nodes {
        createdAt
        grossAmount
        id
        platformFee
        status
        streamerId
        streamerNet
        stripeInvoiceUrl
        transactionType
        userId
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

export const ADMIN_TRANSACTION_STATISTICS = gql`
  query AdminTransactionStatistics($fromDate: DateTime!, $toDate: DateTime!) {
    adminTransactionStatistics(fromDate: $fromDate, toDate: $toDate) {
      successfulPayoutsCount
      totalGrossVolume
      totalPaidOut
      totalPlatformNet
      transactionsCount
    }
  }
`;
