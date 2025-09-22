import { gql } from "@apollo/client"

export const GET_ANALYTICS_DIAGRAM = gql`
    query GetAnalyticsDiagram($param: GetAnalyticsDiagramInput!) {
        analyticsDiagram(param: $param) {
            title
            value
        }
    }
`

export const GET_OVERVIEW_ANALYTICS = gql`
    query GetOverviewAnalytics($param: GetOverviewAnalyticsInput!) {
        overviewAnalytics(param: $param) {
            days
            items {
                type
                value
            }
        }
    }
`