import { gql } from "@apollo/client"

export const SEARCH_QUERY = gql`
    query Search($search: String!) {
        search(search: $search) {
            title
            slug
            image
            resultType
        }
    }
`