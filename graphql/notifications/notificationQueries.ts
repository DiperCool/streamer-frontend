import { gql } from "@apollo/client"

export const GET_NOTIFICATIONS = gql`
    query GetNotifications(
        $after: String
        $before: String
        $first: Int
        $last: Int
    ) {
        notifications(
            after: $after
            before: $before
            first: $first
            last: $last
        ) {
            nodes {
                id
                createdAt
                seen
                discriminator
                streamer { # Это поле доступно напрямую на NotificationDto
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
`

export const GET_NOTIFICATION_SETTINGS = gql`
    query GetNotificationSettings {
        notificationSettings {
            id
            streamerLive
            userFollowed
        }
    }
`