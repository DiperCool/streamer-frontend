import { gql } from "@apollo/client"

export const GET_CHAT = gql`
    query GetChat($streamerId: String!) {
        chat(streamerId: $streamerId) {
            id
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

export const GET_CHAT_MESSAGES = gql`
    query GetChatMessages(
        $after: String
        $before: String
        $chatId: UUID!
        $first: Int
        $last: Int
        $order: [ChatMessageDtoSortInput!]
        $where: ChatMessageDtoFilterInput
    ) {
        chatMessages(
            after: $after
            before: $before
            chatId: $chatId
            first: $first
            last: $last
            order: $order
            where: $where
        ) {
            nodes {
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
                        userName
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

export const GET_CHAT_SETTINGS = gql`
    query GetChatSettings {
        chatSettings {
            id
            bannedWords
            followersOnly
            slowMode
            subscribersOnly
        }
    }
`

export const GET_CHAT_MESSAGES_HISTORY = gql`
    query GetChatMessagesHistory(
        $chatId: UUID!
        $order: [ChatMessageDtoSortInput!]
        $startFrom: DateTime!
        $where: ChatMessageDtoFilterInput
    ) {
        chatMessagesHistory(
            chatId: $chatId
            order: $order
            startFrom: $startFrom
            where: $where
        ) {
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