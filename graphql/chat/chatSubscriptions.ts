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
                isDeleted # <--- Добавлено это поле
                message
                sender {
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