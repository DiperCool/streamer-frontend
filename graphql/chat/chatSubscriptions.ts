import { gql } from "@apollo/client"

export const CHAT_MESSAGE_CREATED_SUBSCRIPTION = gql`
    subscription ChatMessageCreated($chatId: UUID!) {
        chatMessageCreated(chatId: $chatId) {
            createdAt
            id
            isActive
            isDeleted
            message
            replyId
            senderId
            type
            sender {
                id
                userName
                avatar
            }
            reply {
                id
                isDeleted
                message
                sender {
                    id
                    userName
                }
            }
        }
    }
`

export const CHAT_MESSAGE_DELETED_SUBSCRIPTION = gql`
    subscription ChatMessageDeleted($chatId: UUID!) {
        chatMessageDeleted(chatId: $chatId) {
            createdAt
            id
            isActive
            isDeleted
            message
            replyId
            senderId
            type
            sender {
                id
                userName
                avatar
            }
            reply {
                id
                isDeleted
                message
                sender {
                    id
                    userName
                }
            }
        }
    }
`

export const CHAT_UPDATED_SUBSCRIPTION = gql`
    subscription ChatUpdated($chatId: UUID!) {
        chatUpdated(chatId: $chatId) {
            pinnedMessageId
            settingsId
            streamerId
            pinnedMessage {
                id
                createdAt
                messageId
                pinnedById
                message {
                    id
                    createdAt
                    isActive
                    isDeleted
                    message
                    type
                    sender {
                        id
                        userName
                        avatar
                    }
                    reply {
                        id
                        isDeleted
                        message
                        sender {
                            id
                            userName
                        }
                    }
                }
            }
            settings {
                id
                bannedWords
                followersOnly
                slowMode
                subscribersOnly
            }
        }
    }
`

export const USER_BANNED_SUBSCRIPTION = gql`
    subscription UserBanned($broadcasterId: String!, $userId: String!) {
        userBanned(broadcasterId: $broadcasterId, userId: $userId) {
            id
            userId
            bannedById
            reason
            bannedAt
            bannedUntil
            user {
                id
                userName
                avatar
            }
            bannedBy {
                id
                userName
                avatar
            }
        }
    }
`

export const USER_UNBANNED_SUBSCRIPTION = gql`
    subscription UserUnbanned($broadcasterId: String!, $userId: String!) {
        userUnbanned(broadcasterId: $broadcasterId, userId: $userId) {
            id
            userId
            bannedById
            reason
            bannedAt
            bannedUntil
            user {
                id
                userName
                avatar
            }
            bannedBy {
                id
                userName
                avatar
            }
        }
    }
`