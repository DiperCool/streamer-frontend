import { gql } from "@apollo/client"

export const NOTIFICATION_CREATED_SUBSCRIPTION = gql`
    subscription NotificationCreated {
        notificationCreated {
            id
            createdAt
            seen
            discriminator
            ... on LiveStartedNotificationDto {
                streamer {
                    id
                    isLive
                    userName
                    avatar
                }
            }
            ... on UserFollowedNotificationDto {
                follower {
                    id
                    userName
                    avatar
                }
                followedStreamer {
                    id
                    userName
                    avatar
                }
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
            ... on LiveStartedNotificationDto {
                streamer {
                    id
                    isLive
                    userName
                    avatar
                }
            }
            ... on UserFollowedNotificationDto {
                follower {
                    id
                    userName
                    avatar
                }
                followedStreamer {
                    id
                    userName
                    avatar
                }
            }
        }
    }
`