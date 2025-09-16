import { gql } from "@apollo/client"

export const GET_NOTIFICATIONS = gql`
    query GetNotifications {
        notifications {
            nodes {
                id
                createdAt
                seen
                discriminator
                ... on LiveStartedNotificationDto {
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