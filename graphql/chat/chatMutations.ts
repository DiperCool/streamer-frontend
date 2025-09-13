import { gql } from "@apollo/client"

export const CREATE_MESSAGE = gql`
    mutation CreateMessage($request: CreateMessageInput!) {
        createMessage(request: $request) {
            messageId
        }
    }
`

export const DELETE_MESSAGE = gql`
    mutation DeleteMessage($request: DeleteMessageInput!) {
        deleteMessage(request: $request) {
            id
        }
    }
`

export const PIN_MESSAGE = gql`
    mutation PinMessage($pinMessage: PinMessageInput!) {
        pinMessage(pinMessage: $pinMessage) {
            id
        }
    }
`

export const UNPIN_MESSAGE = gql`
    mutation UnpinMessage($request: UnpinMessageInput!) {
        unpinMessage(request: $request) {
            messageId
        }
    }
`

export const UPDATE_CHAT_SETTINGS = gql`
    mutation UpdateChatSettings($request: UpdateChatSettingsInput!) {
        updateChatSettings(request: $request) {
            id
        }
    }
`

export const BAN_USER = gql`
    mutation BanUser($request: BanUserInput!) {
        banUser(request: $request) {
            id
        }
    }
`