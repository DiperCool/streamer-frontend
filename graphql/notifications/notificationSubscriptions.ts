import { gql } from "@apollo/client"

export const NOTIFICATION_CREATED_SUBSCRIPTION = gql`
    subscription NotificationCreated {
        notificationCreated {
            id
            createdAt
            seen
            discriminator
            streamerId
            streamer { # Это поле доступно напрямую на NotificationDto
                id
                isLive
                userName
                avatar
            }
        }
    }
`

export const SUBSCRIBE_NOTIFICATION_CREATED = gql`
    subscription SubscribeNotificationCreated {
        subscribeNotificationCreated {
            id
            createdAt
            seen
            discriminator
            streamer { # Это поле доступно напрямую на NotificationDto
                id
                isLive
                userName
                avatar
            }
        }
    }
`