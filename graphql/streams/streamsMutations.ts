import { gql } from "@apollo/client"

export const UPDATE_STREAM_SETTINGS = gql`
    mutation UpdateStreamSettings($input: UpdateStreamSettingsInput!) {
        updateStreamSettings(input: $input) {
            id
        }
    }
`