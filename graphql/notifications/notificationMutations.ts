import { gql } from "@apollo/client"

export const READ_NOTIFICATIONS = gql`
    mutation ReadNotifications {
        readNotifications {
            response
        }
    }
`

export const READ_NOTIFICATION = gql`
    mutation ReadNotification($readNotification: ReadNotificationInput!) {
        readNotification(readNotification: $readNotification) {
            hasUnreadNotifications
        }
    }
`

export const EDIT_NOTIFICATION_SETTINGS = gql`
    mutation EditNotificationSettings($readNotification: EditNotificationSettingsInput!) {
        editNotificationSettings(readNotification: $readNotification) {
            id
        }
    }
`