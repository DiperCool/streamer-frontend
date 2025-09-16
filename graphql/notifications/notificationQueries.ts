import { gql } from "@apollo/client"

export const GET_NOTIFICATIONS = gql`
    query GetNotifications {
        notifications {
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
    }
`