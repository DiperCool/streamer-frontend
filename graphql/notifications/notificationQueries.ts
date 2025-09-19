import { gql } from "@apollo/client"

export const GET_NOTIFICATIONS = gql`
    query GetNotifications {
        notifications {
            nodes {
                id
                createdAt
                seen
                discriminator
                streamer {
                    id
                    isLive
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