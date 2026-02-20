import { gql } from '@apollo/client';

export const MySubscriptions = gql`
  query MySubscriptions(
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    mySubscriptions(
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
      edges {
        node {
          id
          title
          createdAt
          currentPeriodEnd
          status
          streamerId
          userId
          streamer {
            id
            userName
            avatar
          }
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

export const GetStreamerSubscriptionsStats = gql`
  query GetStreamerSubscriptionsStats($streamerId: String!) {
    streamerSubscriptionsStats(streamerId: $streamerId) {
      activeSubscriptionsCount
      futurePayoutAmount
    }
  }
`;

export const Subscriptions = gql`
  query Subscriptions(
    $streamerId: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [SubscriptionDtoSortInput!]
    $search: String
    $where: SubscriptionDtoFilterInput
  ) {
    subscriptions(
      streamerId: $streamerId
      first: $first
      after: $after
      last: $last
      before: $before
      order: $order
      search: $search
      where: $where
    ) {
      nodes {
        id
        title
        createdAt
        currentPeriodEnd
        status
        streamerId
        userId
        user {
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
