import { gql } from "@apollo/client"

export const GET_MY_SYSTEM_ROLE = gql`
    query GetMySystemRole {
        mySystemRole {
            roleType
            streamerId
            streamer {
                id
                userName
                avatar
                followers
                isLive
            }
        }
    }
`