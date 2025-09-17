import { gql } from "@apollo/client"

export const REMOVE_VOD = gql`
    mutation RemoveVod($request: RemoveVodInput!) {
        removeVod(request: $request) {
            id
        }
    }
`

export const UPDATE_VOD = gql`
    mutation UpdateVod($request: UpdateVodInput!) {
        updateVod(request: $request) {
            id
        }
    }
`

export const EDIT_VOD_SETTINGS = gql`
    mutation EditVodSettings($request: EditVodSettingsInput!) {
        editVodSettings(request: $request) {
            id
        }
    }
`