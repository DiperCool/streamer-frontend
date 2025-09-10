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

export const GET_CATEGORY_BY_SLUG = gql`
    query GetCategoryBySlug($slug: String!) {
        categoryBySlug(slug: $slug) {
            id
            title
            slug
            image
            watchers
            
        }
    }
`

export const GET_TOP_CATEGORIES = gql`
    query GetTopCategories {
        topCategories {
            id
            title
            slug
            image
            watchers
        }
    }
`