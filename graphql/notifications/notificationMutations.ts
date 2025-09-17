import { gql } from "@apollo/client"

export const READ_NOTIFICATION = gql`
    mutation ReadNotification($readNotification: ReadNotificationInput!) {
        readNotification(readNotification: $readNotification) {
            hasUnreadNotifications
        }
    }
`

export const EDIT_NOTIFICATION_SETTINGS = gql`
    mutation EditNotificationSettings($id: UUID!, $input: EditNotificationSettingsInput!) {
        editNotificationSettings(id: $id, input: $input) {
            id
        }
    }
`