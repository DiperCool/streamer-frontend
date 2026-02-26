import { gql } from "@apollo/client";

export const MODERATION_ACTIVITY_CREATED = gql`
  subscription ModerationActivityCreated($streamerId: String!) {
      moderationActivityCreated(streamerId: $streamerId) {
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
        chatMessageId
      }
      ... on UnpinActionDto {
        id
        name
        createdDate
        moderator {
          id
          userName
        }
        chatMessageId
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
`;
