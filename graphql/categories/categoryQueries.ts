import { gql } from "@apollo/client"

export const GET_CATEGORIES = gql`
    query GetCategories(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $order: [CategoryDtoSortInput!]
        $search: String
        $where: CategoryDtoFilterInput
    ) {
        categories(
            after: $after
            before: $before
            first: $first
            last: $last
            order: $order
            search: $search
            where: $where
        ) {
            nodes {
                id
                title
                slug
                image
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

export const GET_CATEGORY_BY_ID = gql`
    query GetCategoryById($id: UUID!) {
        category(id: $id) {
            id
            title
            slug
            image
        }
    }
`