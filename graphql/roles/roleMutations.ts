import { gql } from "@apollo/client"

export const CREATE_ROLE = gql`
    mutation CreateRole($input: CreateRoleInput!) {
        createRole(input: $input) {
            id
        }
    }
`

export const REMOVE_ROLE = gql`
    mutation RemoveRole($input: RemoveRoleInput!) {
        removeRole(input: $input) {
            id
        }
    }
`