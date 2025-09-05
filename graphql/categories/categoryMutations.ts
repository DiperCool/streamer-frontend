import { gql } from "@apollo/client"

export const CREATE_CATEGORY = gql`
    mutation CreateCategory($input: CreateCategoryInput!) {
        createCategory(input: $input) {
            id
        }
    }
`

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($input: EditCategoryInput!) {
        updateCategory(input: $input) {
            id
        }
    }
`

export const REMOVE_CATEGORY = gql`
    mutation RemoveCategory($input: RemoveCategoryInput!) {
        removeCategory(input: $input) {
            id
        }
    }
`