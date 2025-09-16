import { gql } from "@apollo/client"

export const READ_NOTIFICATIONS = gql`
    mutation ReadNotifications {
        readNotifications {
            response
        }
    }
`