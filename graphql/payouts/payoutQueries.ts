import { gql } from '@apollo/client';

export const Payouts = gql`
  query Payouts(
    $streamerId: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [PayoutDtoSortInput!]
    $where: PayoutDtoFilterInput
  ) {
    payouts(
      streamerId: $streamerId
      first: $first
      after: $after
      last: $last
      before: $before
      order: $order
      where: $where
    ) {
      nodes {
        id
        amount
        arrivalDate
        createdAt
        currency
        failureMessage
        status
        streamerId
        stripePayoutId
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

export const AdminPayouts = gql`
  query AdminPayouts(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [PayoutDtoSortInput!]
    $where: PayoutDtoFilterInput
    $fromDate: DateTime
    $toDate: DateTime
  ) {
    adminPayouts(
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
        id
        amount
        arrivalDate
        createdAt
        currency
        failureMessage
        status
        streamerId
        stripePayoutId
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
