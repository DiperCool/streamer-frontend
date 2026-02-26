import { gql } from "@apollo/client";

export const MODERATION_ACTIONS = gql`
  query ModerationActions(
    $streamerId: String!
    $first: Int
    $after: String
    $where: ModeratorActionDtoFilterInput
    $order: [ModeratorActionDtoSortInput!]
  ) {
    moderationActivities(
      streamerId: $streamerId
      first: $first
      after: $after
      where: $where
      order: $order
    ) {
      edges {
        node {
          ... on BanActionDto {
            id
            name
            createdDate
            moderator {
              id
              userName
            }
            targetUser {
              id
              userName
            }
            bannedUntil
            reason
          }
          ... on UnbanActionDto {
            id
            name
            createdDate
            moderator {
              id
              userName
            }
            targetUser {
              id
              userName
            }
          }
          ... on ChatModeActionDto {
            id
            name
            createdDate
            moderator {
              id
              userName
            }
            newChatMode
          }
          ... on PinActionDto {
            id
            name
            createdDate
            moderator {
              id
              userName
            }
            chatMessage {
              id
              message
              sender {
                id
                userName
              }
            }
          }
          ... on UnpinActionDto {
            id
            name
            createdDate
            moderator {
              id
              userName
            }
            chatMessage {
              id
              message
              sender {
                id
                userName
              }
            }
          }
          ... on StreamNameActionDto {
            id
            name
            createdDate
            moderator {
              id
              userName
            }
            newStreamName
          }
          ... on StreamLanguageActionDto {
            id
            name
            createdDate
            moderator {
              id
              userName
            }
            newLanguage
          }
          ... on StreamCategoryActionDto {
            id
            name
            createdDate
            moderator {
              id
              userName
            }
            newCategory
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;