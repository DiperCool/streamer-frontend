import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Long: { input: any; output: any; }
  UUID: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

export type GetEmailResponse = {
  __typename?: 'GetEmailResponse';
  email: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateAvatar: UpdateAvatarResponse;
  updateBio: UpdateBioResponse;
  updateChannelBanner: UpdateChannelBannerResponse;
  updateOfflineBanner: UpdateOfflineBannerResponse;
  updateProfile: UpdateProfileResponse;
  updateStreamSettings: UpdateStreamSettingsResponse;
  upload: UploadFileResponse;
};


export type MutationUpdateAvatarArgs = {
  input: UpdateAvatarInput;
};


export type MutationUpdateBioArgs = {
  input: UpdateBioInput;
};


export type MutationUpdateChannelBannerArgs = {
  input: UpdateChannelBannerInput;
};


export type MutationUpdateOfflineBannerArgs = {
  input: UpdateOfflineBannerInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUploadArgs = {
  input: UploadFileInput;
};

export type ProfileDto = {
  __typename?: 'ProfileDto';
  bio?: Maybe<Scalars['String']['output']>;
  channelBanner?: Maybe<Scalars['String']['output']>;
  discord?: Maybe<Scalars['String']['output']>;
  instagram?: Maybe<Scalars['String']['output']>;
  offlineStreamBanner?: Maybe<Scalars['String']['output']>;
  streamer: StreamerDto;
  streamerId: Scalars['String']['output'];
  youtube?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  currentStream: StreamDto;
  me: StreamerDto;
  myEmail: GetEmailResponse;
  profile: ProfileDto;
  streamSettings: StreamSettingsDto;
  streamer: StreamerDto;
};


export type QueryCurrentStreamArgs = {
  streamerId: Scalars['String']['input'];
};


export type QueryProfileArgs = {
  streamerId: Scalars['String']['input'];
};


export type QueryStreamerArgs = {
  userName: Scalars['String']['input'];
};

export type StreamDto = {
  __typename?: 'StreamDto';
  active: Scalars['Boolean']['output'];
  currentViewers: Scalars['Long']['output'];
  id: Scalars['UUID']['output'];
  sources: Array<StreamSourceDto>;
  streamer?: Maybe<StreamerDto>;
  streamerId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type StreamSettingsDto = {
  __typename?: 'StreamSettingsDto';
  id: Scalars['UUID']['output'];
  streamKey: Scalars['String']['output'];
  streamUrl: Scalars['String']['output'];
};

export type StreamSourceDto = {
  __typename?: 'StreamSourceDto';
  sourceType: StreamSourceType;
  streamId: Scalars['UUID']['output'];
  url: Scalars['String']['output'];
};

export enum StreamSourceType {
  Hls = 'HLS',
  WebRtc = 'WEB_RTC'
}

export type StreamerDto = {
  __typename?: 'StreamerDto';
  avatar?: Maybe<Scalars['String']['output']>;
  followers: Scalars['Long']['output'];
  id: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  streamerUpdated: StreamDto;
};


export type SubscriptionStreamerUpdatedArgs = {
  streamId: Scalars['UUID']['input'];
};

export type UpdateAvatarInput = {
  file: Scalars['String']['input'];
};

export type UpdateAvatarResponse = {
  __typename?: 'UpdateAvatarResponse';
  file: Scalars['String']['output'];
};

export type UpdateBioInput = {
  bio: Scalars['String']['input'];
};

export type UpdateBioResponse = {
  __typename?: 'UpdateBioResponse';
  id: Scalars['UUID']['output'];
};

export type UpdateChannelBannerInput = {
  channelBanner: Scalars['String']['input'];
};

export type UpdateChannelBannerResponse = {
  __typename?: 'UpdateChannelBannerResponse';
  id: Scalars['UUID']['output'];
};

export type UpdateOfflineBannerInput = {
  offlineBanner: Scalars['String']['input'];
};

export type UpdateOfflineBannerResponse = {
  __typename?: 'UpdateOfflineBannerResponse';
  id: Scalars['UUID']['output'];
};

export type UpdateProfileInput = {
  discord?: InputMaybe<Scalars['String']['input']>;
  instagram?: InputMaybe<Scalars['String']['input']>;
  youtube?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfileResponse = {
  __typename?: 'UpdateProfileResponse';
  id: Scalars['UUID']['output'];
};

export type UpdateStreamSettingsResponse = {
  __typename?: 'UpdateStreamSettingsResponse';
  id: Scalars['UUID']['output'];
};

export type UploadFileInput = {
  file: Scalars['Upload']['input'];
};

export type UploadFileResponse = {
  __typename?: 'UploadFileResponse';
  fileName: Scalars['String']['output'];
};

export type UploadFileMutationVariables = Exact<{
  input: UploadFileInput;
}>;


export type UploadFileMutation = { __typename?: 'Mutation', upload: { __typename?: 'UploadFileResponse', fileName: string } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'UpdateProfileResponse', id: any } };

export type UpdateBioMutationVariables = Exact<{
  input: UpdateBioInput;
}>;


export type UpdateBioMutation = { __typename?: 'Mutation', updateBio: { __typename?: 'UpdateBioResponse', id: any } };

export type UpdateChannelBannerMutationVariables = Exact<{
  input: UpdateChannelBannerInput;
}>;


export type UpdateChannelBannerMutation = { __typename?: 'Mutation', updateChannelBanner: { __typename?: 'UpdateChannelBannerResponse', id: any } };

export type UpdateOfflineBannerMutationVariables = Exact<{
  input: UpdateOfflineBannerInput;
}>;


export type UpdateOfflineBannerMutation = { __typename?: 'Mutation', updateOfflineBanner: { __typename?: 'UpdateOfflineBannerResponse', id: any } };

export type GetProfileQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type GetProfileQuery = { __typename?: 'Query', profile: { __typename?: 'ProfileDto', streamerId: string, bio?: string | null, channelBanner?: string | null, discord?: string | null, instagram?: string | null, offlineStreamBanner?: string | null, youtube?: string | null, streamer: { __typename?: 'StreamerDto', id: string, avatar?: string | null, userName: string, followers: any } } };

export type UpdateAvatarMutationVariables = Exact<{
  input: UpdateAvatarInput;
}>;


export type UpdateAvatarMutation = { __typename?: 'Mutation', updateAvatar: { __typename?: 'UpdateAvatarResponse', file: string } };

export type GetStreamerQueryVariables = Exact<{
  userName: Scalars['String']['input'];
}>;


export type GetStreamerQuery = { __typename?: 'Query', streamer: { __typename?: 'StreamerDto', id: string, avatar?: string | null, userName: string, followers: any } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'StreamerDto', id: string, avatar?: string | null, userName: string, followers: any } };

export type GetMyEmailQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEmailQuery = { __typename?: 'Query', myEmail: { __typename?: 'GetEmailResponse', email: string } };

export type UpdateStreamSettingsMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateStreamSettingsMutation = { __typename?: 'Mutation', updateStreamSettings: { __typename?: 'UpdateStreamSettingsResponse', id: any } };

export type GetCurrentStreamQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type GetCurrentStreamQuery = { __typename?: 'Query', currentStream: { __typename?: 'StreamDto', id: any, streamerId: string, active: boolean, title: string, currentViewers: any, streamer?: { __typename?: 'StreamerDto', id: string, userName: string, avatar?: string | null, followers: any } | null, sources: Array<{ __typename?: 'StreamSourceDto', streamId: any, url: string, sourceType: StreamSourceType }> } };

export type GetStreamSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStreamSettingsQuery = { __typename?: 'Query', streamSettings: { __typename?: 'StreamSettingsDto', id: any, streamKey: string, streamUrl: string } };

export type StreamerUpdatedSubscriptionVariables = Exact<{
  streamId: Scalars['UUID']['input'];
}>;


export type StreamerUpdatedSubscription = { __typename?: 'Subscription', streamerUpdated: { __typename?: 'StreamDto', id: any, active: boolean, title: string, currentViewers: any, streamer?: { __typename?: 'StreamerDto', id: string, userName: string, avatar?: string | null, followers: any } | null } };


export const UploadFileDocument = gql`
    mutation UploadFile($input: UploadFileInput!) {
  upload(input: $input) {
    fileName
  }
}
    `;
export type UploadFileMutationFn = Apollo.MutationFunction<UploadFileMutation, UploadFileMutationVariables>;

/**
 * __useUploadFileMutation__
 *
 * To run a mutation, you first call `useUploadFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileMutation, { data, loading, error }] = useUploadFileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileMutation, UploadFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(UploadFileDocument, options);
      }
export type UploadFileMutationHookResult = ReturnType<typeof useUploadFileMutation>;
export type UploadFileMutationResult = Apollo.MutationResult<UploadFileMutation>;
export type UploadFileMutationOptions = Apollo.BaseMutationOptions<UploadFileMutation, UploadFileMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
  }
}
    `;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const UpdateBioDocument = gql`
    mutation UpdateBio($input: UpdateBioInput!) {
  updateBio(input: $input) {
    id
  }
}
    `;
export type UpdateBioMutationFn = Apollo.MutationFunction<UpdateBioMutation, UpdateBioMutationVariables>;

/**
 * __useUpdateBioMutation__
 *
 * To run a mutation, you first call `useUpdateBioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBioMutation, { data, loading, error }] = useUpdateBioMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBioMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBioMutation, UpdateBioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBioMutation, UpdateBioMutationVariables>(UpdateBioDocument, options);
      }
export type UpdateBioMutationHookResult = ReturnType<typeof useUpdateBioMutation>;
export type UpdateBioMutationResult = Apollo.MutationResult<UpdateBioMutation>;
export type UpdateBioMutationOptions = Apollo.BaseMutationOptions<UpdateBioMutation, UpdateBioMutationVariables>;
export const UpdateChannelBannerDocument = gql`
    mutation UpdateChannelBanner($input: UpdateChannelBannerInput!) {
  updateChannelBanner(input: $input) {
    id
  }
}
    `;
export type UpdateChannelBannerMutationFn = Apollo.MutationFunction<UpdateChannelBannerMutation, UpdateChannelBannerMutationVariables>;

/**
 * __useUpdateChannelBannerMutation__
 *
 * To run a mutation, you first call `useUpdateChannelBannerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChannelBannerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChannelBannerMutation, { data, loading, error }] = useUpdateChannelBannerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateChannelBannerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChannelBannerMutation, UpdateChannelBannerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChannelBannerMutation, UpdateChannelBannerMutationVariables>(UpdateChannelBannerDocument, options);
      }
export type UpdateChannelBannerMutationHookResult = ReturnType<typeof useUpdateChannelBannerMutation>;
export type UpdateChannelBannerMutationResult = Apollo.MutationResult<UpdateChannelBannerMutation>;
export type UpdateChannelBannerMutationOptions = Apollo.BaseMutationOptions<UpdateChannelBannerMutation, UpdateChannelBannerMutationVariables>;
export const UpdateOfflineBannerDocument = gql`
    mutation UpdateOfflineBanner($input: UpdateOfflineBannerInput!) {
  updateOfflineBanner(input: $input) {
    id
  }
}
    `;
export type UpdateOfflineBannerMutationFn = Apollo.MutationFunction<UpdateOfflineBannerMutation, UpdateOfflineBannerMutationVariables>;

/**
 * __useUpdateOfflineBannerMutation__
 *
 * To run a mutation, you first call `useUpdateOfflineBannerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOfflineBannerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOfflineBannerMutation, { data, loading, error }] = useUpdateOfflineBannerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateOfflineBannerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOfflineBannerMutation, UpdateOfflineBannerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOfflineBannerMutation, UpdateOfflineBannerMutationVariables>(UpdateOfflineBannerDocument, options);
      }
export type UpdateOfflineBannerMutationHookResult = ReturnType<typeof useUpdateOfflineBannerMutation>;
export type UpdateOfflineBannerMutationResult = Apollo.MutationResult<UpdateOfflineBannerMutation>;
export type UpdateOfflineBannerMutationOptions = Apollo.BaseMutationOptions<UpdateOfflineBannerMutation, UpdateOfflineBannerMutationVariables>;
export const GetProfileDocument = gql`
    query GetProfile($streamerId: String!) {
  profile(streamerId: $streamerId) {
    streamerId
    bio
    channelBanner
    discord
    instagram
    offlineStreamBanner
    youtube
    streamer {
      id
      avatar
      userName
      followers
    }
  }
}
    `;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *      streamerId: // value for 'streamerId'
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables> & ({ variables: GetProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export function useGetProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileSuspenseQueryHookResult = ReturnType<typeof useGetProfileSuspenseQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const UpdateAvatarDocument = gql`
    mutation UpdateAvatar($input: UpdateAvatarInput!) {
  updateAvatar(input: $input) {
    file
  }
}
    `;
export type UpdateAvatarMutationFn = Apollo.MutationFunction<UpdateAvatarMutation, UpdateAvatarMutationVariables>;

/**
 * __useUpdateAvatarMutation__
 *
 * To run a mutation, you first call `useUpdateAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAvatarMutation, { data, loading, error }] = useUpdateAvatarMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAvatarMutation, UpdateAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAvatarMutation, UpdateAvatarMutationVariables>(UpdateAvatarDocument, options);
      }
export type UpdateAvatarMutationHookResult = ReturnType<typeof useUpdateAvatarMutation>;
export type UpdateAvatarMutationResult = Apollo.MutationResult<UpdateAvatarMutation>;
export type UpdateAvatarMutationOptions = Apollo.BaseMutationOptions<UpdateAvatarMutation, UpdateAvatarMutationVariables>;
export const GetStreamerDocument = gql`
    query GetStreamer($userName: String!) {
  streamer(userName: $userName) {
    id
    avatar
    userName
    followers
  }
}
    `;

/**
 * __useGetStreamerQuery__
 *
 * To run a query within a React component, call `useGetStreamerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStreamerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStreamerQuery({
 *   variables: {
 *      userName: // value for 'userName'
 *   },
 * });
 */
export function useGetStreamerQuery(baseOptions: Apollo.QueryHookOptions<GetStreamerQuery, GetStreamerQueryVariables> & ({ variables: GetStreamerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStreamerQuery, GetStreamerQueryVariables>(GetStreamerDocument, options);
      }
export function useGetStreamerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStreamerQuery, GetStreamerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStreamerQuery, GetStreamerQueryVariables>(GetStreamerDocument, options);
        }
export function useGetStreamerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStreamerQuery, GetStreamerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStreamerQuery, GetStreamerQueryVariables>(GetStreamerDocument, options);
        }
export type GetStreamerQueryHookResult = ReturnType<typeof useGetStreamerQuery>;
export type GetStreamerLazyQueryHookResult = ReturnType<typeof useGetStreamerLazyQuery>;
export type GetStreamerSuspenseQueryHookResult = ReturnType<typeof useGetStreamerSuspenseQuery>;
export type GetStreamerQueryResult = Apollo.QueryResult<GetStreamerQuery, GetStreamerQueryVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    avatar
    userName
    followers
  }
}
    `;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
      }
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeSuspenseQueryHookResult = ReturnType<typeof useGetMeSuspenseQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;
export const GetMyEmailDocument = gql`
    query GetMyEmail {
  myEmail {
    email
  }
}
    `;

/**
 * __useGetMyEmailQuery__
 *
 * To run a query within a React component, call `useGetMyEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyEmailQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyEmailQuery(baseOptions?: Apollo.QueryHookOptions<GetMyEmailQuery, GetMyEmailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyEmailQuery, GetMyEmailQueryVariables>(GetMyEmailDocument, options);
      }
export function useGetMyEmailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyEmailQuery, GetMyEmailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyEmailQuery, GetMyEmailQueryVariables>(GetMyEmailDocument, options);
        }
export function useGetMyEmailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyEmailQuery, GetMyEmailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyEmailQuery, GetMyEmailQueryVariables>(GetMyEmailDocument, options);
        }
export type GetMyEmailQueryHookResult = ReturnType<typeof useGetMyEmailQuery>;
export type GetMyEmailLazyQueryHookResult = ReturnType<typeof useGetMyEmailLazyQuery>;
export type GetMyEmailSuspenseQueryHookResult = ReturnType<typeof useGetMyEmailSuspenseQuery>;
export type GetMyEmailQueryResult = Apollo.QueryResult<GetMyEmailQuery, GetMyEmailQueryVariables>;
export const UpdateStreamSettingsDocument = gql`
    mutation UpdateStreamSettings {
  updateStreamSettings {
    id
  }
}
    `;
export type UpdateStreamSettingsMutationFn = Apollo.MutationFunction<UpdateStreamSettingsMutation, UpdateStreamSettingsMutationVariables>;

/**
 * __useUpdateStreamSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateStreamSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStreamSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStreamSettingsMutation, { data, loading, error }] = useUpdateStreamSettingsMutation({
 *   variables: {
 *   },
 * });
 */
export function useUpdateStreamSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStreamSettingsMutation, UpdateStreamSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStreamSettingsMutation, UpdateStreamSettingsMutationVariables>(UpdateStreamSettingsDocument, options);
      }
export type UpdateStreamSettingsMutationHookResult = ReturnType<typeof useUpdateStreamSettingsMutation>;
export type UpdateStreamSettingsMutationResult = Apollo.MutationResult<UpdateStreamSettingsMutation>;
export type UpdateStreamSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateStreamSettingsMutation, UpdateStreamSettingsMutationVariables>;
export const GetCurrentStreamDocument = gql`
    query GetCurrentStream($streamerId: String!) {
  currentStream(streamerId: $streamerId) {
    id
    streamerId
    active
    title
    currentViewers
    streamer {
      id
      userName
      avatar
      followers
    }
    sources {
      streamId
      url
      sourceType
    }
  }
}
    `;

/**
 * __useGetCurrentStreamQuery__
 *
 * To run a query within a React component, call `useGetCurrentStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentStreamQuery({
 *   variables: {
 *      streamerId: // value for 'streamerId'
 *   },
 * });
 */
export function useGetCurrentStreamQuery(baseOptions: Apollo.QueryHookOptions<GetCurrentStreamQuery, GetCurrentStreamQueryVariables> & ({ variables: GetCurrentStreamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentStreamQuery, GetCurrentStreamQueryVariables>(GetCurrentStreamDocument, options);
      }
export function useGetCurrentStreamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentStreamQuery, GetCurrentStreamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentStreamQuery, GetCurrentStreamQueryVariables>(GetCurrentStreamDocument, options);
        }
export function useGetCurrentStreamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentStreamQuery, GetCurrentStreamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentStreamQuery, GetCurrentStreamQueryVariables>(GetCurrentStreamDocument, options);
        }
export type GetCurrentStreamQueryHookResult = ReturnType<typeof useGetCurrentStreamQuery>;
export type GetCurrentStreamLazyQueryHookResult = ReturnType<typeof useGetCurrentStreamLazyQuery>;
export type GetCurrentStreamSuspenseQueryHookResult = ReturnType<typeof useGetCurrentStreamSuspenseQuery>;
export type GetCurrentStreamQueryResult = Apollo.QueryResult<GetCurrentStreamQuery, GetCurrentStreamQueryVariables>;
export const GetStreamSettingsDocument = gql`
    query GetStreamSettings {
  streamSettings {
    id
    streamKey
    streamUrl
  }
}
    `;

/**
 * __useGetStreamSettingsQuery__
 *
 * To run a query within a React component, call `useGetStreamSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStreamSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStreamSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStreamSettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetStreamSettingsQuery, GetStreamSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStreamSettingsQuery, GetStreamSettingsQueryVariables>(GetStreamSettingsDocument, options);
      }
export function useGetStreamSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStreamSettingsQuery, GetStreamSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStreamSettingsQuery, GetStreamSettingsQueryVariables>(GetStreamSettingsDocument, options);
        }
export function useGetStreamSettingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStreamSettingsQuery, GetStreamSettingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStreamSettingsQuery, GetStreamSettingsQueryVariables>(GetStreamSettingsDocument, options);
        }
export type GetStreamSettingsQueryHookResult = ReturnType<typeof useGetStreamSettingsQuery>;
export type GetStreamSettingsLazyQueryHookResult = ReturnType<typeof useGetStreamSettingsLazyQuery>;
export type GetStreamSettingsSuspenseQueryHookResult = ReturnType<typeof useGetStreamSettingsSuspenseQuery>;
export type GetStreamSettingsQueryResult = Apollo.QueryResult<GetStreamSettingsQuery, GetStreamSettingsQueryVariables>;
export const StreamerUpdatedDocument = gql`
    subscription StreamerUpdated($streamId: UUID!) {
  streamerUpdated(streamId: $streamId) {
    id
    active
    title
    currentViewers
    streamer {
      id
      userName
      avatar
      followers
    }
  }
}
    `;

/**
 * __useStreamerUpdatedSubscription__
 *
 * To run a query within a React component, call `useStreamerUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useStreamerUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStreamerUpdatedSubscription({
 *   variables: {
 *      streamId: // value for 'streamId'
 *   },
 * });
 */
export function useStreamerUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<StreamerUpdatedSubscription, StreamerUpdatedSubscriptionVariables> & ({ variables: StreamerUpdatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<StreamerUpdatedSubscription, StreamerUpdatedSubscriptionVariables>(StreamerUpdatedDocument, options);
      }
export type StreamerUpdatedSubscriptionHookResult = ReturnType<typeof useStreamerUpdatedSubscription>;
export type StreamerUpdatedSubscriptionResult = Apollo.SubscriptionResult<StreamerUpdatedSubscription>;