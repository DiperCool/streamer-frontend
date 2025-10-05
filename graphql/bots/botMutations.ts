import { gql } from "@apollo/client"

export const CREATE_BOT = gql`
    mutation CreateBot($input: CreateBotInput!) {
        createBot(input: $input) {
            id
        }
    }
`

export const EDIT_BOT = gql`
    mutation EditBot($input: EditBotInput!) {
        editBot(input: $input) {
            id
        }
    }
`

export const REMOVE_BOT = gql`
    mutation RemoveBot($input: RemoveBotInput!) {
        removeBot(input: $input) { # Исправлено с removeBote на removeBot
            id
        }
    }
`