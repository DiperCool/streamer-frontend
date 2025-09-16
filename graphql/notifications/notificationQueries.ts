import { gql } from "@apollo/client"

export const GET_NOTIFICATIONS = gql`
    query GetNotifications {
        notifications(order: [{ createdAt: DESC }]) { # Добавлена сортировка
            nodes {
                id
                createdAt
                seen
                discriminator
                ... on LiveStartedNotificationDto {
                    streamerId
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
`