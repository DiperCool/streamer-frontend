// import { gql } from "@apollo/client"
//
// export const STREAM_UPDATED_SUBSCRIPTION = gql`
//     subscription StreamUpdated($streamId: UUID!) {
//         streamUpdated(streamId: $streamId) {
//             id
//             active
//             title
//             currentViewers
//             streamer {
//                 id
//                 userName
//                 avatar
//                 followers
//             }
//         }
//     }
// `