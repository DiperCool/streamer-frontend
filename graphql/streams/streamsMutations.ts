import { gql } from "@apollo/client"

export const UPDATE_STREAM_SETTINGS = gql`
    mutation UpdateStreamSettings {
        updateStreamSettings {
            id
        }
    }
`

export const RESET_STREAM_KEY = gql`
    mutation ResetStreamKey {
        resetStreamKey {
            id
        }
    }
`