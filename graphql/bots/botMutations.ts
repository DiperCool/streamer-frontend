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
        removeBote(input: $input) { # Обратите внимание: в схеме опечатка 'removeBote' вместо 'removeBot'
            id
        }
    }
`