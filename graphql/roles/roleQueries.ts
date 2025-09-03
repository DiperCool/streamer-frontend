import { gql } from "@apollo/client"

export const GET_MY_ROLES = gql`
    query GetMyRoles(
        $after: String
        $before: String
        $first: Int
        $last: Int
        $order: [RoleDtoSortInput!]
        $where: RoleDtoFilterInput
    ) {
        myRoles(
            after: $after
            before: $before
            first: $first
            last: $last
            order: $order
            where: $where
        ) {
            nodes {
                id
                type
                streamerId
                broadcasterId
                streamer {
                    id
                    userName
                    avatar
                }
                broadcaster {
                    id
                    userName
                    avatar
                }
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

export const GET_ROLES = gql`
    query GetRoles(
        $after: String
        $before: String
        $broadcasterId: String!
        $first: Int
        $last: Int
        $order: [RoleDtoSortInput!]
        $roleType: RoleType!
        $where: RoleDtoFilterInput
    ) {
        roles(
            after: $after
            before: $before
            broadcasterId: $broadcasterId
            first: $first
            last: $last
            order: $order
            roleType: $roleType
            where: $where
        ) {
            nodes {
                id
                type
                streamerId
                broadcasterId
                streamer {
                    id
                    userName
                    avatar
                }
                broadcaster {
                    id
                    userName
                    avatar
                }
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

export const GET_MY_ROLE = gql`
    query GetMyRole($broadcasterId: String!) {
        myRole(broadcasterId: $broadcasterId) {
            id
            type
            streamerId
            broadcasterId
            permissions {
                isAll
                isChat
                isNone
                isRoles
                isStream
            }
            streamer {
                id
                userName
                avatar
            }
            broadcaster {
                id
                userName
                avatar
            }
        }
    }
`

export const GET_ROLE_BY_ID = gql`
    query GetRoleById($roleId: UUID!) {
        role(id: $roleId) {
            id
            type
            streamerId
            broadcasterId
            permissions {
                isAll
                isChat
                isNone
                isRoles
                isStream
            }
            streamer {
                id
                userName
                avatar
            }
            broadcaster {
                id
                userName
                avatar
            }
        }
    }
`