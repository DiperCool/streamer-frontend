import { gql } from "@apollo/client"

export const UPDATE_PROFILE = gql`
    mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
            id
        }
    }
`

export const UPDATE_BIO = gql`
    mutation UpdateBio($input: UpdateBioInput!) {
        updateBio(input: $input) {
            id
        }
    }
`
export const UPDATE_CHANNEL_BANNER = gql`
    mutation UpdateChannelBanner($input: UpdateChannelBannerInput!) {
        updateChannelBanner(input: $input) {
            id
        }
    }
`
export const UPDATE_OFFLINE_BANNER = gql`
    mutation UpdateOfflineBanner($input: UpdateOfflineBannerInput!) {
        updateOfflineBanner(input: $input) {
            id
        }
    }
`