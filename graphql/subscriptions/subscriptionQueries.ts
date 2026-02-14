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
