import { gql } from "@apollo/client"

export const CREATE_BANNER = gql`
    mutation CreateBanner($banner: CreateBannerInput!) {
        createBanner(banner: $banner) {
            id
        }
    }
`

export const UPDATE_BANNER = gql`
    mutation UpdateBanner($banner: UpdateBannerInput!) {
        updateBanner(banner: $banner) {
            id
        }
    }
`

export const REMOVE_BANNER = gql`
    mutation RemoveBanner($banner: RemoveBannerInput!) {
        removeBanner(banner: $banner) {
            id
        }
    }
`