import { gql } from "@apollo/client"

export const READ_NOTIFICATION = gql`
    mutation ReadNotification($readNotification: ReadNotificationInput!) {
        readNotification(readNotification: $readNotification) {
            hasUnreadNotifications
        }
    }
`

export const EDIT_NOTIFICATION_SETTINGS = gql`
    mutation EditNotificationSettings($input: EditNotificationSettingsInput!) {
        editNotificationSettings(readNotification: $input) {
            id
        }
    }
`

export const READ_ALL_NOTIFICATIONS = gql`
    mutation ReadAllNotifications {
        readAllNotifications {
            result
        }
    }
`