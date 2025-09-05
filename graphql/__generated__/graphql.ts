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
  DateTime: { input: string; output: string; }
  Long: { input: number; output: number; }
  UUID: { input: string; output: string; }
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

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A connection to a list of items. */
export type CategoriesConnection = {
  __typename?: 'CategoriesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<CategoriesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<CategoryDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type CategoriesEdge = {
  __typename?: 'CategoriesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: CategoryDto;
};

export type CategoryDto = {
  __typename?: 'CategoryDto';
  id: Scalars['UUID']['output'];
  image: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CategoryDtoFilterInput = {
  and?: InputMaybe<Array<CategoryDtoFilterInput>>;
  id?: InputMaybe<UuidOperationFilterInput>;
  image?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CategoryDtoFilterInput>>;
  slug?: InputMaybe<StringOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
};

export type CategoryDtoSortInput = {
  id?: InputMaybe<SortEnumType>;
  image?: InputMaybe<SortEnumType>;
  slug?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
};

export type ChatDto = {
  __typename?: 'ChatDto';
  id: Scalars['UUID']['output'];
  pinnedMessage?: Maybe<PinnedChatMessageDto>;
  pinnedMessageId?: Maybe<Scalars['UUID']['output']>;
  settings?: Maybe<ChatSettingsDto>;
  settingsId: Scalars['UUID']['output'];
  streamerId: Scalars['String']['output'];
};

export type ChatMessageDto = {
  __typename?: 'ChatMessageDto';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  isActive: Scalars['Boolean']['output'];
  isDeleted: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  reply?: Maybe<ChatMessageDto>;
  replyId?: Maybe<Scalars['UUID']['output']>;
  sender?: Maybe<StreamerDto>;
  senderId: Scalars['String']['output'];
  type: ChatMessageType;
};

export type ChatMessageDtoFilterInput = {
  and?: InputMaybe<Array<ChatMessageDtoFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isDeleted?: InputMaybe<BooleanOperationFilterInput>;
  message?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ChatMessageDtoFilterInput>>;
  replyId?: InputMaybe<UuidOperationFilterInput>;
  senderId?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<ChatMessageTypeOperationFilterInput>;
};

export type ChatMessageDtoSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isDeleted?: InputMaybe<SortEnumType>;
  message?: InputMaybe<SortEnumType>;
  replyId?: InputMaybe<SortEnumType>;
  senderId?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

export enum ChatMessageType {
  UserMessage = 'USER_MESSAGE'
}

export type ChatMessageTypeOperationFilterInput = {
  eq?: InputMaybe<ChatMessageType>;
  in?: InputMaybe<Array<ChatMessageType>>;
  neq?: InputMaybe<ChatMessageType>;
  nin?: InputMaybe<Array<ChatMessageType>>;
};

/** A connection to a list of items. */
export type ChatMessagesConnection = {
  __typename?: 'ChatMessagesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ChatMessagesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<ChatMessageDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ChatMessagesEdge = {
  __typename?: 'ChatMessagesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: ChatMessageDto;
};

export type ChatSettingsDto = {
  __typename?: 'ChatSettingsDto';
  bannedWords: Array<Scalars['String']['output']>;
  followersOnly: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  slowMode?: Maybe<Scalars['Int']['output']>;
  subscribersOnly: Scalars['Boolean']['output'];
};

export type CreateCategoryInput = {
  image: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateCategoryResponse = {
  __typename?: 'CreateCategoryResponse';
  id: Scalars['UUID']['output'];
};

export type CreateMessageInput = {
  chatId: Scalars['UUID']['input'];
  message: Scalars['String']['input'];
  replyMessageId?: InputMaybe<Scalars['UUID']['input']>;
};

export type CreateMessageResponse = {
  __typename?: 'CreateMessageResponse';
  messageId: Scalars['UUID']['output'];
};

export type CreateRoleInput = {
  broadcasterId: Scalars['String']['input'];
  permissions: PermissionsFlagsInput;
  roleType: RoleType;
  streamerId: Scalars['String']['input'];
};

export type CreateRoleResponse = {
  __typename?: 'CreateRoleResponse';
  id: Scalars['UUID']['output'];
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DeleteMessageInput = {
  messageId: Scalars['UUID']['input'];
};

export type DeleteMessageResponse = {
  __typename?: 'DeleteMessageResponse';
  id: Scalars['UUID']['output'];
};

export type EditCategoryInput = {
  id: Scalars['UUID']['input'];
  image: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type EditCategoryResponse = {
  __typename?: 'EditCategoryResponse';
  id: Scalars['UUID']['output'];
};

export type EditRoleInput = {
  permissions: PermissionsFlagsInput;
  roleId: Scalars['UUID']['input'];
};

export type EditRoleResponse = {
  __typename?: 'EditRoleResponse';
  id: Scalars['UUID']['output'];
};

export type FinishAuthInput = {
  userName: Scalars['String']['input'];
};

export type FinishAuthResponse = {
  __typename?: 'FinishAuthResponse';
  id: Scalars['String']['output'];
};

export type FollowInput = {
  streamerId: Scalars['String']['input'];
};

export type FollowResponse = {
  __typename?: 'FollowResponse';
  id: Scalars['UUID']['output'];
};

export type GetEmailResponse = {
  __typename?: 'GetEmailResponse';
  email: Scalars['String']['output'];
};

export type LongOperationFilterInput = {
  eq?: InputMaybe<Scalars['Long']['input']>;
  gt?: InputMaybe<Scalars['Long']['input']>;
  gte?: InputMaybe<Scalars['Long']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  lt?: InputMaybe<Scalars['Long']['input']>;
  lte?: InputMaybe<Scalars['Long']['input']>;
  neq?: InputMaybe<Scalars['Long']['input']>;
  ngt?: InputMaybe<Scalars['Long']['input']>;
  ngte?: InputMaybe<Scalars['Long']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  nlt?: InputMaybe<Scalars['Long']['input']>;
  nlte?: InputMaybe<Scalars['Long']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: CreateCategoryResponse;
  createMessage: CreateMessageResponse;
  createRole: CreateRoleResponse;
  deleteMessage: DeleteMessageResponse;
  editRole: EditRoleResponse;
  finishAuth: FinishAuthResponse;
  follow: FollowResponse;
  pinMessage: PinMessageResponse;
  removeCategory: RemoveCategoryResponse;
  removeRole: RemoveRoleResponse;
  unfollow: UnfollowResponse;
  unpinMessage: UnpinMessageResponse;
  updateAvatar: UpdateAvatarResponse;
  updateBio: UpdateBioResponse;
  updateCategory: EditCategoryResponse;
  updateChannelBanner: UpdateChannelBannerResponse;
  updateChatSettings: UpdateChatSettingsResponse;
  updateOfflineBanner: UpdateOfflineBannerResponse;
  updateProfile: UpdateProfileResponse;
  updateStreamSettings: UpdateStreamSettingsResponse;
  upload: UploadFileResponse;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateMessageArgs = {
  request: CreateMessageInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationDeleteMessageArgs = {
  request: DeleteMessageInput;
};


export type MutationEditRoleArgs = {
  input: EditRoleInput;
};


export type MutationFinishAuthArgs = {
  input: FinishAuthInput;
};


export type MutationFollowArgs = {
  follow: FollowInput;
};


export type MutationPinMessageArgs = {
  pinMessage: PinMessageInput;
};


export type MutationRemoveCategoryArgs = {
  input: RemoveCategoryInput;
};


export type MutationRemoveRoleArgs = {
  input: RemoveRoleInput;
};


export type MutationUnfollowArgs = {
  unfollow: UnfollowInput;
};


export type MutationUnpinMessageArgs = {
  request: UnpinMessageInput;
};


export type MutationUpdateAvatarArgs = {
  input: UpdateAvatarInput;
};


export type MutationUpdateBioArgs = {
  input: UpdateBioInput;
};


export type MutationUpdateCategoryArgs = {
  input: EditCategoryInput;
};


export type MutationUpdateChannelBannerArgs = {
  input: UpdateChannelBannerInput;
};


export type MutationUpdateChatSettingsArgs = {
  request: UpdateChatSettingsInput;
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

/** A connection to a list of items. */
export type MyRolesConnection = {
  __typename?: 'MyRolesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MyRolesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<RoleDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MyRolesEdge = {
  __typename?: 'MyRolesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: RoleDto;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PermissionsFlags = {
  __typename?: 'PermissionsFlags';
  isAll: Scalars['Boolean']['output'];
  isChat: Scalars['Boolean']['output'];
  isNone: Scalars['Boolean']['output'];
  isRoles: Scalars['Boolean']['output'];
  isStream: Scalars['Boolean']['output'];
};

export type PermissionsFlagsInput = {
  isAll?: InputMaybe<Scalars['Boolean']['input']>;
  isChat?: InputMaybe<Scalars['Boolean']['input']>;
  isNone?: InputMaybe<Scalars['Boolean']['input']>;
  isRoles?: InputMaybe<Scalars['Boolean']['input']>;
  isStream?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PermissionsOperationFilterInput = {
  eq?: InputMaybe<PermissionsFlagsInput>;
  in?: InputMaybe<Array<PermissionsFlagsInput>>;
  neq?: InputMaybe<PermissionsFlagsInput>;
  nin?: InputMaybe<Array<PermissionsFlagsInput>>;
};

export type PinMessageInput = {
  messageId: Scalars['UUID']['input'];
};

export type PinMessageResponse = {
  __typename?: 'PinMessageResponse';
  id: Scalars['UUID']['output'];
};

export type PinnedChatMessageDto = {
  __typename?: 'PinnedChatMessageDto';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  message?: Maybe<ChatMessageDto>;
  messageId: Scalars['UUID']['output'];
  pinnedBy?: Maybe<StreamerDto>;
  pinnedById: Scalars['String']['output'];
};

export type ProfileDto = {
  __typename?: 'ProfileDto';
  bio?: Maybe<Scalars['String']['output']>;
  channelBanner?: Maybe<Scalars['String']['output']>;
  discord?: Maybe<Scalars['String']['output']>;
  instagram?: Maybe<Scalars['String']['output']>;
  offlineStreamBanner?: Maybe<Scalars['String']['output']>;
  streamer?: Maybe<StreamerDto>;
  streamerId: Scalars['String']['output'];
  youtube?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  categories?: Maybe<CategoriesConnection>;
  category: CategoryDto;
  chat: ChatDto;
  chatMessages?: Maybe<ChatMessagesConnection>;
  chatMessagesHistory: Array<ChatMessageDto>;
  chatSettings: ChatSettingsDto;
  currentStream: StreamDto;
  me: StreamerMeDto;
  myEmail: GetEmailResponse;
  myRole: RoleDto;
  myRoles?: Maybe<MyRolesConnection>;
  mySystemRole: SystemRoleDto;
  profile: ProfileDto;
  role: RoleDto;
  roles?: Maybe<RolesConnection>;
  streamSettings: StreamSettingsDto;
  streamer: StreamerDto;
  streamerInteraction: StreamerInteractionDto;
  streamers?: Maybe<StreamersConnection>;
  vod: VodDto;
  vods?: Maybe<VodsConnection>;
};


export type QueryCategoriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<CategoryDtoSortInput>>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<CategoryDtoFilterInput>;
};


export type QueryCategoryArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryChatArgs = {
  streamerId: Scalars['String']['input'];
};


export type QueryChatMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chatId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ChatMessageDtoSortInput>>;
  where?: InputMaybe<ChatMessageDtoFilterInput>;
};


export type QueryChatMessagesHistoryArgs = {
  chatId: Scalars['UUID']['input'];
  order?: InputMaybe<Array<ChatMessageDtoSortInput>>;
  startFrom: Scalars['DateTime']['input'];
  where?: InputMaybe<ChatMessageDtoFilterInput>;
};


export type QueryCurrentStreamArgs = {
  streamerId: Scalars['String']['input'];
};


export type QueryMyRoleArgs = {
  broadcasterId: Scalars['String']['input'];
};


export type QueryMyRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<RoleDtoSortInput>>;
  where?: InputMaybe<RoleDtoFilterInput>;
};


export type QueryProfileArgs = {
  streamerId: Scalars['String']['input'];
};


export type QueryRoleArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  broadcasterId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<RoleDtoSortInput>>;
  roleType: RoleType;
  where?: InputMaybe<RoleDtoFilterInput>;
};


export type QueryStreamerArgs = {
  userName: Scalars['String']['input'];
};


export type QueryStreamerInteractionArgs = {
  streamerId: Scalars['String']['input'];
};


export type QueryStreamersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<StreamerDtoSortInput>>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<StreamerDtoFilterInput>;
};


export type QueryVodArgs = {
  vodId: Scalars['UUID']['input'];
};


export type QueryVodsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<VodDtoSortInput>>;
  streamerId: Scalars['String']['input'];
  where?: InputMaybe<VodDtoFilterInput>;
};

export type RemoveCategoryInput = {
  id: Scalars['UUID']['input'];
};

export type RemoveCategoryResponse = {
  __typename?: 'RemoveCategoryResponse';
  id: Scalars['UUID']['output'];
};

export type RemoveRoleInput = {
  roleId: Scalars['UUID']['input'];
};

export type RemoveRoleResponse = {
  __typename?: 'RemoveRoleResponse';
  id: Scalars['UUID']['output'];
};

export type RoleDto = {
  __typename?: 'RoleDto';
  broadcaster?: Maybe<StreamerDto>;
  broadcasterId: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  permissions: PermissionsFlags;
  streamer?: Maybe<StreamerDto>;
  streamerId: Scalars['String']['output'];
  type: RoleType;
};

export type RoleDtoFilterInput = {
  and?: InputMaybe<Array<RoleDtoFilterInput>>;
  broadcasterId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<RoleDtoFilterInput>>;
  permissions?: InputMaybe<PermissionsOperationFilterInput>;
  streamerId?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<RoleTypeOperationFilterInput>;
};

export type RoleDtoSortInput = {
  broadcasterId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  permissions?: InputMaybe<SortEnumType>;
  streamerId?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

export enum RoleType {
  Administrator = 'ADMINISTRATOR',
  Broadcaster = 'BROADCASTER'
}

export type RoleTypeOperationFilterInput = {
  eq?: InputMaybe<RoleType>;
  in?: InputMaybe<Array<RoleType>>;
  neq?: InputMaybe<RoleType>;
  nin?: InputMaybe<Array<RoleType>>;
};

/** A connection to a list of items. */
export type RolesConnection = {
  __typename?: 'RolesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<RolesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<RoleDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type RolesEdge = {
  __typename?: 'RolesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: RoleDto;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

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

export type StreamWatcher = {
  __typename?: 'StreamWatcher';
  streamId: Scalars['UUID']['output'];
};

export type StreamerDto = {
  __typename?: 'StreamerDto';
  avatar?: Maybe<Scalars['String']['output']>;
  followers: Scalars['Long']['output'];
  id: Scalars['String']['output'];
  isLive: Scalars['Boolean']['output'];
  userName?: Maybe<Scalars['String']['output']>;
};

export type StreamerDtoFilterInput = {
  and?: InputMaybe<Array<StreamerDtoFilterInput>>;
  avatar?: InputMaybe<StringOperationFilterInput>;
  followers?: InputMaybe<LongOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isLive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<StreamerDtoFilterInput>>;
  userName?: InputMaybe<StringOperationFilterInput>;
};

export type StreamerDtoSortInput = {
  avatar?: InputMaybe<SortEnumType>;
  followers?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isLive?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
};

export type StreamerInteractionDto = {
  __typename?: 'StreamerInteractionDto';
  followed: Scalars['Boolean']['output'];
  followedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type StreamerMeDto = {
  __typename?: 'StreamerMeDto';
  avatar?: Maybe<Scalars['String']['output']>;
  finishedAuth: Scalars['Boolean']['output'];
  followers: Scalars['Long']['output'];
  id: Scalars['String']['output'];
  isLive: Scalars['Boolean']['output'];
  userName?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type StreamersConnection = {
  __typename?: 'StreamersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<StreamersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<StreamerDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type StreamersEdge = {
  __typename?: 'StreamersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: StreamerDto;
};

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  chatMessageCreated: ChatMessageDto;
  chatMessageDeleted: ChatMessageDto;
  chatUpdated: ChatDto;
  streamUpdated: StreamDto;
  streamerUpdated: StreamerDto;
  subscribeWatchStream: Array<StreamWatcher>;
  watchStream: StreamWatcher;
};


export type SubscriptionChatMessageCreatedArgs = {
  chatId: Scalars['UUID']['input'];
};


export type SubscriptionChatMessageDeletedArgs = {
  chatId: Scalars['UUID']['input'];
};


export type SubscriptionChatUpdatedArgs = {
  chatId: Scalars['UUID']['input'];
};


export type SubscriptionStreamUpdatedArgs = {
  streamId: Scalars['UUID']['input'];
};


export type SubscriptionStreamerUpdatedArgs = {
  streamerId: Scalars['String']['input'];
};


export type SubscriptionSubscribeWatchStreamArgs = {
  streamId: Scalars['UUID']['input'];
};


export type SubscriptionWatchStreamArgs = {
  streamId: Scalars['UUID']['input'];
};

export type SystemRoleDto = {
  __typename?: 'SystemRoleDto';
  roleType: SystemRoleType;
  streamer?: Maybe<StreamerDto>;
  streamerId: Scalars['String']['output'];
};

export enum SystemRoleType {
  Administrator = 'ADMINISTRATOR'
}

export type UnfollowInput = {
  streamerId: Scalars['String']['input'];
};

export type UnfollowResponse = {
  __typename?: 'UnfollowResponse';
  id: Scalars['UUID']['output'];
};

export type UnpinMessageInput = {
  chatId: Scalars['UUID']['input'];
};

export type UnpinMessageResponse = {
  __typename?: 'UnpinMessageResponse';
  messageId: Scalars['UUID']['output'];
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

export type UpdateChatSettingsInput = {
  bannedWords: Array<Scalars['String']['input']>;
  followersOnly: Scalars['Boolean']['input'];
  id: Scalars['UUID']['input'];
  slowMode?: InputMaybe<Scalars['Int']['input']>;
  subscribersOnly: Scalars['Boolean']['input'];
};

export type UpdateChatSettingsResponse = {
  __typename?: 'UpdateChatSettingsResponse';
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

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  gt?: InputMaybe<Scalars['UUID']['input']>;
  gte?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  lt?: InputMaybe<Scalars['UUID']['input']>;
  lte?: InputMaybe<Scalars['UUID']['input']>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
  ngt?: InputMaybe<Scalars['UUID']['input']>;
  ngte?: InputMaybe<Scalars['UUID']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  nlt?: InputMaybe<Scalars['UUID']['input']>;
  nlte?: InputMaybe<Scalars['UUID']['input']>;
};

export type VodDto = {
  __typename?: 'VodDto';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  duration: Scalars['Long']['output'];
  id: Scalars['UUID']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  streamer?: Maybe<StreamerDto>;
  streamerId: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  views: Scalars['Long']['output'];
};

export type VodDtoFilterInput = {
  and?: InputMaybe<Array<VodDtoFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  duration?: InputMaybe<LongOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<VodDtoFilterInput>>;
  preview?: InputMaybe<StringOperationFilterInput>;
  source?: InputMaybe<StringOperationFilterInput>;
  streamerId?: InputMaybe<StringOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  views?: InputMaybe<LongOperationFilterInput>;
};

export type VodDtoSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  duration?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  preview?: InputMaybe<SortEnumType>;
  source?: InputMaybe<SortEnumType>;
  streamerId?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
  views?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type VodsConnection = {
  __typename?: 'VodsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<VodsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<VodDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type VodsEdge = {
  __typename?: 'VodsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: VodDto;
};

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'CreateCategoryResponse', id: string } };

export type UpdateCategoryMutationVariables = Exact<{
  input: EditCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'EditCategoryResponse', id: string } };

export type RemoveCategoryMutationVariables = Exact<{
  input: RemoveCategoryInput;
}>;


export type RemoveCategoryMutation = { __typename?: 'Mutation', removeCategory: { __typename?: 'RemoveCategoryResponse', id: string } };

export type GetCategoriesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<CategoryDtoSortInput> | CategoryDtoSortInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<CategoryDtoFilterInput>;
}>;


export type GetCategoriesQuery = { __typename?: 'Query', categories?: { __typename?: 'CategoriesConnection', nodes?: Array<{ __typename?: 'CategoryDto', id: string, title: string, slug: string, image: string }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetCategoryByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCategoryByIdQuery = { __typename?: 'Query', category: { __typename?: 'CategoryDto', id: string, title: string, slug: string, image: string } };

export type CreateMessageMutationVariables = Exact<{
  request: CreateMessageInput;
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'CreateMessageResponse', messageId: string } };

export type DeleteMessageMutationVariables = Exact<{
  request: DeleteMessageInput;
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', deleteMessage: { __typename?: 'DeleteMessageResponse', id: string } };

export type PinMessageMutationVariables = Exact<{
  pinMessage: PinMessageInput;
}>;


export type PinMessageMutation = { __typename?: 'Mutation', pinMessage: { __typename?: 'PinMessageResponse', id: string } };

export type UnpinMessageMutationVariables = Exact<{
  request: UnpinMessageInput;
}>;


export type UnpinMessageMutation = { __typename?: 'Mutation', unpinMessage: { __typename?: 'UnpinMessageResponse', messageId: string } };

export type UpdateChatSettingsMutationVariables = Exact<{
  request: UpdateChatSettingsInput;
}>;


export type UpdateChatSettingsMutation = { __typename?: 'Mutation', updateChatSettings: { __typename?: 'UpdateChatSettingsResponse', id: string } };

export type GetChatQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type GetChatQuery = { __typename?: 'Query', chat: { __typename?: 'ChatDto', id: string, pinnedMessageId?: string | null, settingsId: string, streamerId: string, pinnedMessage?: { __typename?: 'PinnedChatMessageDto', id: string, createdAt: string, messageId: string, pinnedById: string, message?: { __typename?: 'ChatMessageDto', id: string, createdAt: string, isActive: boolean, isDeleted: boolean, message: string, type: ChatMessageType, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, reply?: { __typename?: 'ChatMessageDto', id: string, isDeleted: boolean, message: string, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null } | null } | null } | null } | null, settings?: { __typename?: 'ChatSettingsDto', id: string, bannedWords: Array<string>, followersOnly: boolean, slowMode?: number | null, subscribersOnly: boolean } | null } };

export type GetChatMessagesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  chatId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ChatMessageDtoSortInput> | ChatMessageDtoSortInput>;
  where?: InputMaybe<ChatMessageDtoFilterInput>;
}>;


export type GetChatMessagesQuery = { __typename?: 'Query', chatMessages?: { __typename?: 'ChatMessagesConnection', nodes?: Array<{ __typename?: 'ChatMessageDto', id: string, createdAt: string, isActive: boolean, isDeleted: boolean, message: string, type: ChatMessageType, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, reply?: { __typename?: 'ChatMessageDto', id: string, isDeleted: boolean, message: string, sender?: { __typename?: 'StreamerDto', userName?: string | null } | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetChatSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatSettingsQuery = { __typename?: 'Query', chatSettings: { __typename?: 'ChatSettingsDto', id: string, bannedWords: Array<string>, followersOnly: boolean, slowMode?: number | null, subscribersOnly: boolean } };

export type GetChatMessagesHistoryQueryVariables = Exact<{
  chatId: Scalars['UUID']['input'];
  order?: InputMaybe<Array<ChatMessageDtoSortInput> | ChatMessageDtoSortInput>;
  startFrom: Scalars['DateTime']['input'];
  where?: InputMaybe<ChatMessageDtoFilterInput>;
}>;


export type GetChatMessagesHistoryQuery = { __typename?: 'Query', chatMessagesHistory: Array<{ __typename?: 'ChatMessageDto', createdAt: string, id: string, isActive: boolean, isDeleted: boolean, message: string, replyId?: string | null, senderId: string, type: ChatMessageType, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, reply?: { __typename?: 'ChatMessageDto', id: string, isDeleted: boolean, message: string, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null } | null } | null }> };

export type ChatMessageCreatedSubscriptionVariables = Exact<{
  chatId: Scalars['UUID']['input'];
}>;


export type ChatMessageCreatedSubscription = { __typename?: 'Subscription', chatMessageCreated: { __typename?: 'ChatMessageDto', createdAt: string, id: string, isActive: boolean, isDeleted: boolean, message: string, replyId?: string | null, senderId: string, type: ChatMessageType, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, reply?: { __typename?: 'ChatMessageDto', id: string, isDeleted: boolean, message: string, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null } | null } | null } };

export type ChatMessageDeletedSubscriptionVariables = Exact<{
  chatId: Scalars['UUID']['input'];
}>;


export type ChatMessageDeletedSubscription = { __typename?: 'Subscription', chatMessageDeleted: { __typename?: 'ChatMessageDto', createdAt: string, id: string, isActive: boolean, isDeleted: boolean, message: string, replyId?: string | null, senderId: string, type: ChatMessageType, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, reply?: { __typename?: 'ChatMessageDto', id: string, isDeleted: boolean, message: string, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null } | null } | null } };

export type ChatUpdatedSubscriptionVariables = Exact<{
  chatId: Scalars['UUID']['input'];
}>;


export type ChatUpdatedSubscription = { __typename?: 'Subscription', chatUpdated: { __typename?: 'ChatDto', pinnedMessageId?: string | null, settingsId: string, streamerId: string, pinnedMessage?: { __typename?: 'PinnedChatMessageDto', id: string, createdAt: string, messageId: string, pinnedById: string, message?: { __typename?: 'ChatMessageDto', id: string, createdAt: string, isActive: boolean, isDeleted: boolean, message: string, type: ChatMessageType, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, reply?: { __typename?: 'ChatMessageDto', id: string, isDeleted: boolean, message: string, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null } | null } | null } | null } | null, settings?: { __typename?: 'ChatSettingsDto', id: string, bannedWords: Array<string>, followersOnly: boolean, slowMode?: number | null, subscribersOnly: boolean } | null } };

export type UploadFileMutationVariables = Exact<{
  input: UploadFileInput;
}>;


export type UploadFileMutation = { __typename?: 'Mutation', upload: { __typename?: 'UploadFileResponse', fileName: string } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'UpdateProfileResponse', id: string } };

export type UpdateBioMutationVariables = Exact<{
  input: UpdateBioInput;
}>;


export type UpdateBioMutation = { __typename?: 'Mutation', updateBio: { __typename?: 'UpdateBioResponse', id: string } };

export type UpdateChannelBannerMutationVariables = Exact<{
  input: UpdateChannelBannerInput;
}>;


export type UpdateChannelBannerMutation = { __typename?: 'Mutation', updateChannelBanner: { __typename?: 'UpdateChannelBannerResponse', id: string } };

export type UpdateOfflineBannerMutationVariables = Exact<{
  input: UpdateOfflineBannerInput;
}>;


export type UpdateOfflineBannerMutation = { __typename?: 'Mutation', updateOfflineBanner: { __typename?: 'UpdateOfflineBannerResponse', id: string } };

export type GetProfileQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type GetProfileQuery = { __typename?: 'Query', profile: { __typename?: 'ProfileDto', streamerId: string, bio?: string | null, channelBanner?: string | null, discord?: string | null, instagram?: string | null, offlineStreamBanner?: string | null, youtube?: string | null, streamer?: { __typename?: 'StreamerDto', id: string, avatar?: string | null, userName?: string | null, followers: number, isLive: boolean } | null } };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'CreateRoleResponse', id: string } };

export type RemoveRoleMutationVariables = Exact<{
  input: RemoveRoleInput;
}>;


export type RemoveRoleMutation = { __typename?: 'Mutation', removeRole: { __typename?: 'RemoveRoleResponse', id: string } };

export type EditRoleMutationVariables = Exact<{
  input: EditRoleInput;
}>;


export type EditRoleMutation = { __typename?: 'Mutation', editRole: { __typename?: 'EditRoleResponse', id: string } };

export type GetMyRolesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<RoleDtoSortInput> | RoleDtoSortInput>;
  where?: InputMaybe<RoleDtoFilterInput>;
}>;


export type GetMyRolesQuery = { __typename?: 'Query', myRoles?: { __typename?: 'MyRolesConnection', nodes?: Array<{ __typename?: 'RoleDto', id: string, type: RoleType, streamerId: string, broadcasterId: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, broadcaster?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetRolesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  broadcasterId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<RoleDtoSortInput> | RoleDtoSortInput>;
  roleType: RoleType;
  where?: InputMaybe<RoleDtoFilterInput>;
}>;


export type GetRolesQuery = { __typename?: 'Query', roles?: { __typename?: 'RolesConnection', nodes?: Array<{ __typename?: 'RoleDto', id: string, type: RoleType, streamerId: string, broadcasterId: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, broadcaster?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetMyRoleQueryVariables = Exact<{
  broadcasterId: Scalars['String']['input'];
}>;


export type GetMyRoleQuery = { __typename?: 'Query', myRole: { __typename?: 'RoleDto', id: string, type: RoleType, streamerId: string, broadcasterId: string, permissions: { __typename?: 'PermissionsFlags', isAll: boolean, isChat: boolean, isNone: boolean, isRoles: boolean, isStream: boolean }, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, broadcaster?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null } };

export type GetRoleByIdQueryVariables = Exact<{
  roleId: Scalars['UUID']['input'];
}>;


export type GetRoleByIdQuery = { __typename?: 'Query', role: { __typename?: 'RoleDto', id: string, type: RoleType, streamerId: string, broadcasterId: string, permissions: { __typename?: 'PermissionsFlags', isAll: boolean, isChat: boolean, isNone: boolean, isRoles: boolean, isStream: boolean }, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, broadcaster?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null } };

export type UpdateAvatarMutationVariables = Exact<{
  input: UpdateAvatarInput;
}>;


export type UpdateAvatarMutation = { __typename?: 'Mutation', updateAvatar: { __typename?: 'UpdateAvatarResponse', file: string } };

export type FollowStreamerMutationVariables = Exact<{
  input: FollowInput;
}>;


export type FollowStreamerMutation = { __typename?: 'Mutation', follow: { __typename?: 'FollowResponse', id: string } };

export type UnfollowStreamerMutationVariables = Exact<{
  input: UnfollowInput;
}>;


export type UnfollowStreamerMutation = { __typename?: 'Mutation', unfollow: { __typename?: 'UnfollowResponse', id: string } };

export type FinishAuthMutationVariables = Exact<{
  input: FinishAuthInput;
}>;


export type FinishAuthMutation = { __typename?: 'Mutation', finishAuth: { __typename?: 'FinishAuthResponse', id: string } };

export type GetStreamerQueryVariables = Exact<{
  userName: Scalars['String']['input'];
}>;


export type GetStreamerQuery = { __typename?: 'Query', streamer: { __typename?: 'StreamerDto', id: string, avatar?: string | null, userName?: string | null, followers: number, isLive: boolean } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'StreamerMeDto', id: string, avatar?: string | null, userName?: string | null, followers: number, isLive: boolean, finishedAuth: boolean } };

export type GetMyEmailQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEmailQuery = { __typename?: 'Query', myEmail: { __typename?: 'GetEmailResponse', email: string } };

export type StreamerInteractionQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type StreamerInteractionQuery = { __typename?: 'Query', streamerInteraction: { __typename?: 'StreamerInteractionDto', followed: boolean, followedAt?: string | null } };

export type StreamerUpdatedSubscriptionVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type StreamerUpdatedSubscription = { __typename?: 'Subscription', streamerUpdated: { __typename?: 'StreamerDto', id: string, avatar?: string | null, userName?: string | null, followers: number, isLive: boolean } };

export type GetStreamersQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<StreamerDtoSortInput> | StreamerDtoSortInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<StreamerDtoFilterInput>;
}>;


export type GetStreamersQuery = { __typename?: 'Query', streamers?: { __typename?: 'StreamersConnection', nodes?: Array<{ __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null, followers: number, isLive: boolean }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type StreamUpdatedSubscriptionVariables = Exact<{
  streamId: Scalars['UUID']['input'];
}>;


export type StreamUpdatedSubscription = { __typename?: 'Subscription', streamUpdated: { __typename?: 'StreamDto', id: string, active: boolean, title: string, currentViewers: number, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null, followers: number } | null } };

export type WatchStreamSubscriptionVariables = Exact<{
  streamId: Scalars['UUID']['input'];
}>;


export type WatchStreamSubscription = { __typename?: 'Subscription', watchStream: { __typename?: 'StreamWatcher', streamId: string } };

export type SubscribeWatchStreamSubscriptionVariables = Exact<{
  streamId: Scalars['UUID']['input'];
}>;


export type SubscribeWatchStreamSubscription = { __typename?: 'Subscription', subscribeWatchStream: Array<{ __typename?: 'StreamWatcher', streamId: string }> };

export type UpdateStreamSettingsMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateStreamSettingsMutation = { __typename?: 'Mutation', updateStreamSettings: { __typename?: 'UpdateStreamSettingsResponse', id: string } };

export type GetCurrentStreamQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type GetCurrentStreamQuery = { __typename?: 'Query', currentStream: { __typename?: 'StreamDto', id: string, streamerId: string, active: boolean, title: string, currentViewers: number, streamer?: { __typename?: 'StreamerDto', id: string, isLive: boolean, userName?: string | null, avatar?: string | null, followers: number } | null, sources: Array<{ __typename?: 'StreamSourceDto', streamId: string, url: string, sourceType: StreamSourceType }> } };

export type GetStreamSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStreamSettingsQuery = { __typename?: 'Query', streamSettings: { __typename?: 'StreamSettingsDto', id: string, streamKey: string, streamUrl: string } };

export type GetMySystemRoleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySystemRoleQuery = { __typename?: 'Query', mySystemRole: { __typename?: 'SystemRoleDto', roleType: SystemRoleType, streamerId: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null, followers: number, isLive: boolean } | null } };

export type GetVodsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<VodDtoSortInput> | VodDtoSortInput>;
  streamerId: Scalars['String']['input'];
  where?: InputMaybe<VodDtoFilterInput>;
}>;


export type GetVodsQuery = { __typename?: 'Query', vods?: { __typename?: 'VodsConnection', nodes?: Array<{ __typename?: 'VodDto', id: string, title?: string | null, description?: string | null, preview?: string | null, source?: string | null, views: number, createdAt: string, duration: number, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetVodQueryVariables = Exact<{
  vodId: Scalars['UUID']['input'];
}>;


export type GetVodQuery = { __typename?: 'Query', vod: { __typename?: 'VodDto', id: string, title?: string | null, description?: string | null, preview?: string | null, source?: string | null, views: number, createdAt: string, duration: number, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null } };


export const CreateCategoryDocument = gql`
    mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($input: EditCategoryInput!) {
  updateCategory(input: $input) {
    id
  }
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
      }
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const RemoveCategoryDocument = gql`
    mutation RemoveCategory($input: RemoveCategoryInput!) {
  removeCategory(input: $input) {
    id
  }
}
    `;
export type RemoveCategoryMutationFn = Apollo.MutationFunction<RemoveCategoryMutation, RemoveCategoryMutationVariables>;

/**
 * __useRemoveCategoryMutation__
 *
 * To run a mutation, you first call `useRemoveCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCategoryMutation, { data, loading, error }] = useRemoveCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveCategoryMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCategoryMutation, RemoveCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveCategoryMutation, RemoveCategoryMutationVariables>(RemoveCategoryDocument, options);
      }
export type RemoveCategoryMutationHookResult = ReturnType<typeof useRemoveCategoryMutation>;
export type RemoveCategoryMutationResult = Apollo.MutationResult<RemoveCategoryMutation>;
export type RemoveCategoryMutationOptions = Apollo.BaseMutationOptions<RemoveCategoryMutation, RemoveCategoryMutationVariables>;
export const GetCategoriesDocument = gql`
    query GetCategories($after: String, $before: String, $first: Int, $last: Int, $order: [CategoryDtoSortInput!], $search: String, $where: CategoryDtoFilterInput) {
  categories(
    after: $after
    before: $before
    first: $first
    last: $last
    order: $order
    search: $search
    where: $where
  ) {
    nodes {
      id
      title
      slug
      image
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      order: // value for 'order'
 *      search: // value for 'search'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
      }
export function useGetCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export function useGetCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetCategoriesSuspenseQuery>;
export type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetCategoryByIdDocument = gql`
    query GetCategoryById($id: UUID!) {
  category(id: $id) {
    id
    title
    slug
    image
  }
}
    `;

/**
 * __useGetCategoryByIdQuery__
 *
 * To run a query within a React component, call `useGetCategoryByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCategoryByIdQuery(baseOptions: Apollo.QueryHookOptions<GetCategoryByIdQuery, GetCategoryByIdQueryVariables> & ({ variables: GetCategoryByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoryByIdQuery, GetCategoryByIdQueryVariables>(GetCategoryByIdDocument, options);
      }
export function useGetCategoryByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoryByIdQuery, GetCategoryByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoryByIdQuery, GetCategoryByIdQueryVariables>(GetCategoryByIdDocument, options);
        }
export function useGetCategoryByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoryByIdQuery, GetCategoryByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCategoryByIdQuery, GetCategoryByIdQueryVariables>(GetCategoryByIdDocument, options);
        }
export type GetCategoryByIdQueryHookResult = ReturnType<typeof useGetCategoryByIdQuery>;
export type GetCategoryByIdLazyQueryHookResult = ReturnType<typeof useGetCategoryByIdLazyQuery>;
export type GetCategoryByIdSuspenseQueryHookResult = ReturnType<typeof useGetCategoryByIdSuspenseQuery>;
export type GetCategoryByIdQueryResult = Apollo.QueryResult<GetCategoryByIdQuery, GetCategoryByIdQueryVariables>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($request: CreateMessageInput!) {
  createMessage(request: $request) {
    messageId
  }
}
    `;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($request: DeleteMessageInput!) {
  deleteMessage(request: $request) {
    id
  }
}
    `;
export type DeleteMessageMutationFn = Apollo.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useDeleteMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, options);
      }
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const PinMessageDocument = gql`
    mutation PinMessage($pinMessage: PinMessageInput!) {
  pinMessage(pinMessage: $pinMessage) {
    id
  }
}
    `;
export type PinMessageMutationFn = Apollo.MutationFunction<PinMessageMutation, PinMessageMutationVariables>;

/**
 * __usePinMessageMutation__
 *
 * To run a mutation, you first call `usePinMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinMessageMutation, { data, loading, error }] = usePinMessageMutation({
 *   variables: {
 *      pinMessage: // value for 'pinMessage'
 *   },
 * });
 */
export function usePinMessageMutation(baseOptions?: Apollo.MutationHookOptions<PinMessageMutation, PinMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PinMessageMutation, PinMessageMutationVariables>(PinMessageDocument, options);
      }
export type PinMessageMutationHookResult = ReturnType<typeof usePinMessageMutation>;
export type PinMessageMutationResult = Apollo.MutationResult<PinMessageMutation>;
export type PinMessageMutationOptions = Apollo.BaseMutationOptions<PinMessageMutation, PinMessageMutationVariables>;
export const UnpinMessageDocument = gql`
    mutation UnpinMessage($request: UnpinMessageInput!) {
  unpinMessage(request: $request) {
    messageId
  }
}
    `;
export type UnpinMessageMutationFn = Apollo.MutationFunction<UnpinMessageMutation, UnpinMessageMutationVariables>;

/**
 * __useUnpinMessageMutation__
 *
 * To run a mutation, you first call `useUnpinMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpinMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpinMessageMutation, { data, loading, error }] = useUnpinMessageMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUnpinMessageMutation(baseOptions?: Apollo.MutationHookOptions<UnpinMessageMutation, UnpinMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpinMessageMutation, UnpinMessageMutationVariables>(UnpinMessageDocument, options);
      }
export type UnpinMessageMutationHookResult = ReturnType<typeof useUnpinMessageMutation>;
export type UnpinMessageMutationResult = Apollo.MutationResult<UnpinMessageMutation>;
export type UnpinMessageMutationOptions = Apollo.BaseMutationOptions<UnpinMessageMutation, UnpinMessageMutationVariables>;
export const UpdateChatSettingsDocument = gql`
    mutation UpdateChatSettings($request: UpdateChatSettingsInput!) {
  updateChatSettings(request: $request) {
    id
  }
}
    `;
export type UpdateChatSettingsMutationFn = Apollo.MutationFunction<UpdateChatSettingsMutation, UpdateChatSettingsMutationVariables>;

/**
 * __useUpdateChatSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateChatSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChatSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChatSettingsMutation, { data, loading, error }] = useUpdateChatSettingsMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUpdateChatSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChatSettingsMutation, UpdateChatSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChatSettingsMutation, UpdateChatSettingsMutationVariables>(UpdateChatSettingsDocument, options);
      }
export type UpdateChatSettingsMutationHookResult = ReturnType<typeof useUpdateChatSettingsMutation>;
export type UpdateChatSettingsMutationResult = Apollo.MutationResult<UpdateChatSettingsMutation>;
export type UpdateChatSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateChatSettingsMutation, UpdateChatSettingsMutationVariables>;
export const GetChatDocument = gql`
    query GetChat($streamerId: String!) {
  chat(streamerId: $streamerId) {
    id
    pinnedMessageId
    settingsId
    streamerId
    pinnedMessage {
      id
      createdAt
      messageId
      pinnedById
      message {
        id
        createdAt
        isActive
        isDeleted
        message
        type
        sender {
          id
          userName
          avatar
        }
        reply {
          id
          isDeleted
          message
          sender {
            id
            userName
          }
        }
      }
    }
    settings {
      id
      bannedWords
      followersOnly
      slowMode
      subscribersOnly
    }
  }
}
    `;

/**
 * __useGetChatQuery__
 *
 * To run a query within a React component, call `useGetChatQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatQuery({
 *   variables: {
 *      streamerId: // value for 'streamerId'
 *   },
 * });
 */
export function useGetChatQuery(baseOptions: Apollo.QueryHookOptions<GetChatQuery, GetChatQueryVariables> & ({ variables: GetChatQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatQuery, GetChatQueryVariables>(GetChatDocument, options);
      }
export function useGetChatLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatQuery, GetChatQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatQuery, GetChatQueryVariables>(GetChatDocument, options);
        }
export function useGetChatSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChatQuery, GetChatQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChatQuery, GetChatQueryVariables>(GetChatDocument, options);
        }
export type GetChatQueryHookResult = ReturnType<typeof useGetChatQuery>;
export type GetChatLazyQueryHookResult = ReturnType<typeof useGetChatLazyQuery>;
export type GetChatSuspenseQueryHookResult = ReturnType<typeof useGetChatSuspenseQuery>;
export type GetChatQueryResult = Apollo.QueryResult<GetChatQuery, GetChatQueryVariables>;
export const GetChatMessagesDocument = gql`
    query GetChatMessages($after: String, $before: String, $chatId: UUID!, $first: Int, $last: Int, $order: [ChatMessageDtoSortInput!], $where: ChatMessageDtoFilterInput) {
  chatMessages(
    after: $after
    before: $before
    chatId: $chatId
    first: $first
    last: $last
    order: $order
    where: $where
  ) {
    nodes {
      id
      createdAt
      isActive
      isDeleted
      message
      type
      sender {
        id
        userName
        avatar
      }
      reply {
        id
        isDeleted
        message
        sender {
          userName
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useGetChatMessagesQuery__
 *
 * To run a query within a React component, call `useGetChatMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatMessagesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      chatId: // value for 'chatId'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      order: // value for 'order'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetChatMessagesQuery(baseOptions: Apollo.QueryHookOptions<GetChatMessagesQuery, GetChatMessagesQueryVariables> & ({ variables: GetChatMessagesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatMessagesQuery, GetChatMessagesQueryVariables>(GetChatMessagesDocument, options);
      }
export function useGetChatMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatMessagesQuery, GetChatMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatMessagesQuery, GetChatMessagesQueryVariables>(GetChatMessagesDocument, options);
        }
export function useGetChatMessagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChatMessagesQuery, GetChatMessagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChatMessagesQuery, GetChatMessagesQueryVariables>(GetChatMessagesDocument, options);
        }
export type GetChatMessagesQueryHookResult = ReturnType<typeof useGetChatMessagesQuery>;
export type GetChatMessagesLazyQueryHookResult = ReturnType<typeof useGetChatMessagesLazyQuery>;
export type GetChatMessagesSuspenseQueryHookResult = ReturnType<typeof useGetChatMessagesSuspenseQuery>;
export type GetChatMessagesQueryResult = Apollo.QueryResult<GetChatMessagesQuery, GetChatMessagesQueryVariables>;
export const GetChatSettingsDocument = gql`
    query GetChatSettings {
  chatSettings {
    id
    bannedWords
    followersOnly
    slowMode
    subscribersOnly
  }
}
    `;

/**
 * __useGetChatSettingsQuery__
 *
 * To run a query within a React component, call `useGetChatSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetChatSettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetChatSettingsQuery, GetChatSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatSettingsQuery, GetChatSettingsQueryVariables>(GetChatSettingsDocument, options);
      }
export function useGetChatSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatSettingsQuery, GetChatSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatSettingsQuery, GetChatSettingsQueryVariables>(GetChatSettingsDocument, options);
        }
export function useGetChatSettingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChatSettingsQuery, GetChatSettingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChatSettingsQuery, GetChatSettingsQueryVariables>(GetChatSettingsDocument, options);
        }
export type GetChatSettingsQueryHookResult = ReturnType<typeof useGetChatSettingsQuery>;
export type GetChatSettingsLazyQueryHookResult = ReturnType<typeof useGetChatSettingsLazyQuery>;
export type GetChatSettingsSuspenseQueryHookResult = ReturnType<typeof useGetChatSettingsSuspenseQuery>;
export type GetChatSettingsQueryResult = Apollo.QueryResult<GetChatSettingsQuery, GetChatSettingsQueryVariables>;
export const GetChatMessagesHistoryDocument = gql`
    query GetChatMessagesHistory($chatId: UUID!, $order: [ChatMessageDtoSortInput!], $startFrom: DateTime!, $where: ChatMessageDtoFilterInput) {
  chatMessagesHistory(
    chatId: $chatId
    order: $order
    startFrom: $startFrom
    where: $where
  ) {
    createdAt
    id
    isActive
    isDeleted
    message
    replyId
    senderId
    type
    sender {
      id
      userName
      avatar
    }
    reply {
      id
      isDeleted
      message
      sender {
        id
        userName
      }
    }
  }
}
    `;

/**
 * __useGetChatMessagesHistoryQuery__
 *
 * To run a query within a React component, call `useGetChatMessagesHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatMessagesHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatMessagesHistoryQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      order: // value for 'order'
 *      startFrom: // value for 'startFrom'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetChatMessagesHistoryQuery(baseOptions: Apollo.QueryHookOptions<GetChatMessagesHistoryQuery, GetChatMessagesHistoryQueryVariables> & ({ variables: GetChatMessagesHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatMessagesHistoryQuery, GetChatMessagesHistoryQueryVariables>(GetChatMessagesHistoryDocument, options);
      }
export function useGetChatMessagesHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatMessagesHistoryQuery, GetChatMessagesHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatMessagesHistoryQuery, GetChatMessagesHistoryQueryVariables>(GetChatMessagesHistoryDocument, options);
        }
export function useGetChatMessagesHistorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChatMessagesHistoryQuery, GetChatMessagesHistoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChatMessagesHistoryQuery, GetChatMessagesHistoryQueryVariables>(GetChatMessagesHistoryDocument, options);
        }
export type GetChatMessagesHistoryQueryHookResult = ReturnType<typeof useGetChatMessagesHistoryQuery>;
export type GetChatMessagesHistoryLazyQueryHookResult = ReturnType<typeof useGetChatMessagesHistoryLazyQuery>;
export type GetChatMessagesHistorySuspenseQueryHookResult = ReturnType<typeof useGetChatMessagesHistorySuspenseQuery>;
export type GetChatMessagesHistoryQueryResult = Apollo.QueryResult<GetChatMessagesHistoryQuery, GetChatMessagesHistoryQueryVariables>;
export const ChatMessageCreatedDocument = gql`
    subscription ChatMessageCreated($chatId: UUID!) {
  chatMessageCreated(chatId: $chatId) {
    createdAt
    id
    isActive
    isDeleted
    message
    replyId
    senderId
    type
    sender {
      id
      userName
      avatar
    }
    reply {
      id
      isDeleted
      message
      sender {
        id
        userName
      }
    }
  }
}
    `;

/**
 * __useChatMessageCreatedSubscription__
 *
 * To run a query within a React component, call `useChatMessageCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatMessageCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatMessageCreatedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatMessageCreatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatMessageCreatedSubscription, ChatMessageCreatedSubscriptionVariables> & ({ variables: ChatMessageCreatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatMessageCreatedSubscription, ChatMessageCreatedSubscriptionVariables>(ChatMessageCreatedDocument, options);
      }
export type ChatMessageCreatedSubscriptionHookResult = ReturnType<typeof useChatMessageCreatedSubscription>;
export type ChatMessageCreatedSubscriptionResult = Apollo.SubscriptionResult<ChatMessageCreatedSubscription>;
export const ChatMessageDeletedDocument = gql`
    subscription ChatMessageDeleted($chatId: UUID!) {
  chatMessageDeleted(chatId: $chatId) {
    createdAt
    id
    isActive
    isDeleted
    message
    replyId
    senderId
    type
    sender {
      id
      userName
      avatar
    }
    reply {
      id
      isDeleted
      message
      sender {
        id
        userName
      }
    }
  }
}
    `;

/**
 * __useChatMessageDeletedSubscription__
 *
 * To run a query within a React component, call `useChatMessageDeletedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatMessageDeletedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatMessageDeletedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatMessageDeletedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatMessageDeletedSubscription, ChatMessageDeletedSubscriptionVariables> & ({ variables: ChatMessageDeletedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatMessageDeletedSubscription, ChatMessageDeletedSubscriptionVariables>(ChatMessageDeletedDocument, options);
      }
export type ChatMessageDeletedSubscriptionHookResult = ReturnType<typeof useChatMessageDeletedSubscription>;
export type ChatMessageDeletedSubscriptionResult = Apollo.SubscriptionResult<ChatMessageDeletedSubscription>;
export const ChatUpdatedDocument = gql`
    subscription ChatUpdated($chatId: UUID!) {
  chatUpdated(chatId: $chatId) {
    pinnedMessageId
    settingsId
    streamerId
    pinnedMessage {
      id
      createdAt
      messageId
      pinnedById
      message {
        id
        createdAt
        isActive
        isDeleted
        message
        type
        sender {
          id
          userName
          avatar
        }
        reply {
          id
          isDeleted
          message
          sender {
            id
            userName
          }
        }
      }
    }
    settings {
      id
      bannedWords
      followersOnly
      slowMode
      subscribersOnly
    }
  }
}
    `;

/**
 * __useChatUpdatedSubscription__
 *
 * To run a query within a React component, call `useChatUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatUpdatedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChatUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatUpdatedSubscription, ChatUpdatedSubscriptionVariables> & ({ variables: ChatUpdatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ChatUpdatedSubscription, ChatUpdatedSubscriptionVariables>(ChatUpdatedDocument, options);
      }
export type ChatUpdatedSubscriptionHookResult = ReturnType<typeof useChatUpdatedSubscription>;
export type ChatUpdatedSubscriptionResult = Apollo.SubscriptionResult<ChatUpdatedSubscription>;
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
      isLive
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
export const CreateRoleDocument = gql`
    mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    id
  }
}
    `;
export type CreateRoleMutationFn = Apollo.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoleMutation, { data, loading, error }] = useCreateRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRoleMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = Apollo.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = Apollo.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const RemoveRoleDocument = gql`
    mutation RemoveRole($input: RemoveRoleInput!) {
  removeRole(input: $input) {
    id
  }
}
    `;
export type RemoveRoleMutationFn = Apollo.MutationFunction<RemoveRoleMutation, RemoveRoleMutationVariables>;

/**
 * __useRemoveRoleMutation__
 *
 * To run a mutation, you first call `useRemoveRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeRoleMutation, { data, loading, error }] = useRemoveRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveRoleMutation(baseOptions?: Apollo.MutationHookOptions<RemoveRoleMutation, RemoveRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveRoleMutation, RemoveRoleMutationVariables>(RemoveRoleDocument, options);
      }
export type RemoveRoleMutationHookResult = ReturnType<typeof useRemoveRoleMutation>;
export type RemoveRoleMutationResult = Apollo.MutationResult<RemoveRoleMutation>;
export type RemoveRoleMutationOptions = Apollo.BaseMutationOptions<RemoveRoleMutation, RemoveRoleMutationVariables>;
export const EditRoleDocument = gql`
    mutation EditRole($input: EditRoleInput!) {
  editRole(input: $input) {
    id
  }
}
    `;
export type EditRoleMutationFn = Apollo.MutationFunction<EditRoleMutation, EditRoleMutationVariables>;

/**
 * __useEditRoleMutation__
 *
 * To run a mutation, you first call `useEditRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editRoleMutation, { data, loading, error }] = useEditRoleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditRoleMutation(baseOptions?: Apollo.MutationHookOptions<EditRoleMutation, EditRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditRoleMutation, EditRoleMutationVariables>(EditRoleDocument, options);
      }
export type EditRoleMutationHookResult = ReturnType<typeof useEditRoleMutation>;
export type EditRoleMutationResult = Apollo.MutationResult<EditRoleMutation>;
export type EditRoleMutationOptions = Apollo.BaseMutationOptions<EditRoleMutation, EditRoleMutationVariables>;
export const GetMyRolesDocument = gql`
    query GetMyRoles($after: String, $before: String, $first: Int, $last: Int, $order: [RoleDtoSortInput!], $where: RoleDtoFilterInput) {
  myRoles(
    after: $after
    before: $before
    first: $first
    last: $last
    order: $order
    where: $where
  ) {
    nodes {
      id
      type
      streamerId
      broadcasterId
      streamer {
        id
        userName
        avatar
      }
      broadcaster {
        id
        userName
        avatar
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useGetMyRolesQuery__
 *
 * To run a query within a React component, call `useGetMyRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyRolesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      order: // value for 'order'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMyRolesQuery(baseOptions?: Apollo.QueryHookOptions<GetMyRolesQuery, GetMyRolesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyRolesQuery, GetMyRolesQueryVariables>(GetMyRolesDocument, options);
      }
export function useGetMyRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyRolesQuery, GetMyRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyRolesQuery, GetMyRolesQueryVariables>(GetMyRolesDocument, options);
        }
export function useGetMyRolesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyRolesQuery, GetMyRolesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyRolesQuery, GetMyRolesQueryVariables>(GetMyRolesDocument, options);
        }
export type GetMyRolesQueryHookResult = ReturnType<typeof useGetMyRolesQuery>;
export type GetMyRolesLazyQueryHookResult = ReturnType<typeof useGetMyRolesLazyQuery>;
export type GetMyRolesSuspenseQueryHookResult = ReturnType<typeof useGetMyRolesSuspenseQuery>;
export type GetMyRolesQueryResult = Apollo.QueryResult<GetMyRolesQuery, GetMyRolesQueryVariables>;
export const GetRolesDocument = gql`
    query GetRoles($after: String, $before: String, $broadcasterId: String!, $first: Int, $last: Int, $order: [RoleDtoSortInput!], $roleType: RoleType!, $where: RoleDtoFilterInput) {
  roles(
    after: $after
    before: $before
    broadcasterId: $broadcasterId
    first: $first
    last: $last
    order: $order
    roleType: $roleType
    where: $where
  ) {
    nodes {
      id
      type
      streamerId
      broadcasterId
      streamer {
        id
        userName
        avatar
      }
      broadcaster {
        id
        userName
        avatar
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useGetRolesQuery__
 *
 * To run a query within a React component, call `useGetRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      broadcasterId: // value for 'broadcasterId'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      order: // value for 'order'
 *      roleType: // value for 'roleType'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetRolesQuery(baseOptions: Apollo.QueryHookOptions<GetRolesQuery, GetRolesQueryVariables> & ({ variables: GetRolesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
      }
export function useGetRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
export function useGetRolesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
export type GetRolesQueryHookResult = ReturnType<typeof useGetRolesQuery>;
export type GetRolesLazyQueryHookResult = ReturnType<typeof useGetRolesLazyQuery>;
export type GetRolesSuspenseQueryHookResult = ReturnType<typeof useGetRolesSuspenseQuery>;
export type GetRolesQueryResult = Apollo.QueryResult<GetRolesQuery, GetRolesQueryVariables>;
export const GetMyRoleDocument = gql`
    query GetMyRole($broadcasterId: String!) {
  myRole(broadcasterId: $broadcasterId) {
    id
    type
    streamerId
    broadcasterId
    permissions {
      isAll
      isChat
      isNone
      isRoles
      isStream
    }
    streamer {
      id
      userName
      avatar
    }
    broadcaster {
      id
      userName
      avatar
    }
  }
}
    `;

/**
 * __useGetMyRoleQuery__
 *
 * To run a query within a React component, call `useGetMyRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyRoleQuery({
 *   variables: {
 *      broadcasterId: // value for 'broadcasterId'
 *   },
 * });
 */
export function useGetMyRoleQuery(baseOptions: Apollo.QueryHookOptions<GetMyRoleQuery, GetMyRoleQueryVariables> & ({ variables: GetMyRoleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyRoleQuery, GetMyRoleQueryVariables>(GetMyRoleDocument, options);
      }
export function useGetMyRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyRoleQuery, GetMyRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyRoleQuery, GetMyRoleQueryVariables>(GetMyRoleDocument, options);
        }
export function useGetMyRoleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyRoleQuery, GetMyRoleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyRoleQuery, GetMyRoleQueryVariables>(GetMyRoleDocument, options);
        }
export type GetMyRoleQueryHookResult = ReturnType<typeof useGetMyRoleQuery>;
export type GetMyRoleLazyQueryHookResult = ReturnType<typeof useGetMyRoleLazyQuery>;
export type GetMyRoleSuspenseQueryHookResult = ReturnType<typeof useGetMyRoleSuspenseQuery>;
export type GetMyRoleQueryResult = Apollo.QueryResult<GetMyRoleQuery, GetMyRoleQueryVariables>;
export const GetRoleByIdDocument = gql`
    query GetRoleById($roleId: UUID!) {
  role(id: $roleId) {
    id
    type
    streamerId
    broadcasterId
    permissions {
      isAll
      isChat
      isNone
      isRoles
      isStream
    }
    streamer {
      id
      userName
      avatar
    }
    broadcaster {
      id
      userName
      avatar
    }
  }
}
    `;

/**
 * __useGetRoleByIdQuery__
 *
 * To run a query within a React component, call `useGetRoleByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoleByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoleByIdQuery({
 *   variables: {
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useGetRoleByIdQuery(baseOptions: Apollo.QueryHookOptions<GetRoleByIdQuery, GetRoleByIdQueryVariables> & ({ variables: GetRoleByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoleByIdQuery, GetRoleByIdQueryVariables>(GetRoleByIdDocument, options);
      }
export function useGetRoleByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoleByIdQuery, GetRoleByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoleByIdQuery, GetRoleByIdQueryVariables>(GetRoleByIdDocument, options);
        }
export function useGetRoleByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRoleByIdQuery, GetRoleByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRoleByIdQuery, GetRoleByIdQueryVariables>(GetRoleByIdDocument, options);
        }
export type GetRoleByIdQueryHookResult = ReturnType<typeof useGetRoleByIdQuery>;
export type GetRoleByIdLazyQueryHookResult = ReturnType<typeof useGetRoleByIdLazyQuery>;
export type GetRoleByIdSuspenseQueryHookResult = ReturnType<typeof useGetRoleByIdSuspenseQuery>;
export type GetRoleByIdQueryResult = Apollo.QueryResult<GetRoleByIdQuery, GetRoleByIdQueryVariables>;
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
export const FollowStreamerDocument = gql`
    mutation FollowStreamer($input: FollowInput!) {
  follow(follow: $input) {
    id
  }
}
    `;
export type FollowStreamerMutationFn = Apollo.MutationFunction<FollowStreamerMutation, FollowStreamerMutationVariables>;

/**
 * __useFollowStreamerMutation__
 *
 * To run a mutation, you first call `useFollowStreamerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowStreamerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followStreamerMutation, { data, loading, error }] = useFollowStreamerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFollowStreamerMutation(baseOptions?: Apollo.MutationHookOptions<FollowStreamerMutation, FollowStreamerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FollowStreamerMutation, FollowStreamerMutationVariables>(FollowStreamerDocument, options);
      }
export type FollowStreamerMutationHookResult = ReturnType<typeof useFollowStreamerMutation>;
export type FollowStreamerMutationResult = Apollo.MutationResult<FollowStreamerMutation>;
export type FollowStreamerMutationOptions = Apollo.BaseMutationOptions<FollowStreamerMutation, FollowStreamerMutationVariables>;
export const UnfollowStreamerDocument = gql`
    mutation UnfollowStreamer($input: UnfollowInput!) {
  unfollow(unfollow: $input) {
    id
  }
}
    `;
export type UnfollowStreamerMutationFn = Apollo.MutationFunction<UnfollowStreamerMutation, UnfollowStreamerMutationVariables>;

/**
 * __useUnfollowStreamerMutation__
 *
 * To run a mutation, you first call `useUnfollowStreamerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowStreamerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowStreamerMutation, { data, loading, error }] = useUnfollowStreamerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnfollowStreamerMutation(baseOptions?: Apollo.MutationHookOptions<UnfollowStreamerMutation, UnfollowStreamerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnfollowStreamerMutation, UnfollowStreamerMutationVariables>(UnfollowStreamerDocument, options);
      }
export type UnfollowStreamerMutationHookResult = ReturnType<typeof useUnfollowStreamerMutation>;
export type UnfollowStreamerMutationResult = Apollo.MutationResult<UnfollowStreamerMutation>;
export type UnfollowStreamerMutationOptions = Apollo.BaseMutationOptions<UnfollowStreamerMutation, UnfollowStreamerMutationVariables>;
export const FinishAuthDocument = gql`
    mutation FinishAuth($input: FinishAuthInput!) {
  finishAuth(input: $input) {
    id
  }
}
    `;
export type FinishAuthMutationFn = Apollo.MutationFunction<FinishAuthMutation, FinishAuthMutationVariables>;

/**
 * __useFinishAuthMutation__
 *
 * To run a mutation, you first call `useFinishAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFinishAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [finishAuthMutation, { data, loading, error }] = useFinishAuthMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFinishAuthMutation(baseOptions?: Apollo.MutationHookOptions<FinishAuthMutation, FinishAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FinishAuthMutation, FinishAuthMutationVariables>(FinishAuthDocument, options);
      }
export type FinishAuthMutationHookResult = ReturnType<typeof useFinishAuthMutation>;
export type FinishAuthMutationResult = Apollo.MutationResult<FinishAuthMutation>;
export type FinishAuthMutationOptions = Apollo.BaseMutationOptions<FinishAuthMutation, FinishAuthMutationVariables>;
export const GetStreamerDocument = gql`
    query GetStreamer($userName: String!) {
  streamer(userName: $userName) {
    id
    avatar
    userName
    followers
    isLive
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
    isLive
    finishedAuth
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
export const StreamerInteractionDocument = gql`
    query StreamerInteraction($streamerId: String!) {
  streamerInteraction(streamerId: $streamerId) {
    followed
    followedAt
  }
}
    `;

/**
 * __useStreamerInteractionQuery__
 *
 * To run a query within a React component, call `useStreamerInteractionQuery` and pass it any options that fit your needs.
 * When your component renders, `useStreamerInteractionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStreamerInteractionQuery({
 *   variables: {
 *      streamerId: // value for 'streamerId'
 *   },
 * });
 */
export function useStreamerInteractionQuery(baseOptions: Apollo.QueryHookOptions<StreamerInteractionQuery, StreamerInteractionQueryVariables> & ({ variables: StreamerInteractionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StreamerInteractionQuery, StreamerInteractionQueryVariables>(StreamerInteractionDocument, options);
      }
export function useStreamerInteractionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StreamerInteractionQuery, StreamerInteractionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StreamerInteractionQuery, StreamerInteractionQueryVariables>(StreamerInteractionDocument, options);
        }
export function useStreamerInteractionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StreamerInteractionQuery, StreamerInteractionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StreamerInteractionQuery, StreamerInteractionQueryVariables>(StreamerInteractionDocument, options);
        }
export type StreamerInteractionQueryHookResult = ReturnType<typeof useStreamerInteractionQuery>;
export type StreamerInteractionLazyQueryHookResult = ReturnType<typeof useStreamerInteractionLazyQuery>;
export type StreamerInteractionSuspenseQueryHookResult = ReturnType<typeof useStreamerInteractionSuspenseQuery>;
export type StreamerInteractionQueryResult = Apollo.QueryResult<StreamerInteractionQuery, StreamerInteractionQueryVariables>;
export const StreamerUpdatedDocument = gql`
    subscription StreamerUpdated($streamerId: String!) {
  streamerUpdated(streamerId: $streamerId) {
    id
    avatar
    userName
    followers
    isLive
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
 *      streamerId: // value for 'streamerId'
 *   },
 * });
 */
export function useStreamerUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<StreamerUpdatedSubscription, StreamerUpdatedSubscriptionVariables> & ({ variables: StreamerUpdatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<StreamerUpdatedSubscription, StreamerUpdatedSubscriptionVariables>(StreamerUpdatedDocument, options);
      }
export type StreamerUpdatedSubscriptionHookResult = ReturnType<typeof useStreamerUpdatedSubscription>;
export type StreamerUpdatedSubscriptionResult = Apollo.SubscriptionResult<StreamerUpdatedSubscription>;
export const GetStreamersDocument = gql`
    query GetStreamers($after: String, $before: String, $first: Int, $last: Int, $order: [StreamerDtoSortInput!], $search: String, $where: StreamerDtoFilterInput) {
  streamers(
    after: $after
    before: $before
    first: $first
    last: $last
    order: $order
    search: $search
    where: $where
  ) {
    nodes {
      id
      userName
      avatar
      followers
      isLive
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useGetStreamersQuery__
 *
 * To run a query within a React component, call `useGetStreamersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStreamersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStreamersQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      order: // value for 'order'
 *      search: // value for 'search'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetStreamersQuery(baseOptions?: Apollo.QueryHookOptions<GetStreamersQuery, GetStreamersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStreamersQuery, GetStreamersQueryVariables>(GetStreamersDocument, options);
      }
export function useGetStreamersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStreamersQuery, GetStreamersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStreamersQuery, GetStreamersQueryVariables>(GetStreamersDocument, options);
        }
export function useGetStreamersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStreamersQuery, GetStreamersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStreamersQuery, GetStreamersQueryVariables>(GetStreamersDocument, options);
        }
export type GetStreamersQueryHookResult = ReturnType<typeof useGetStreamersQuery>;
export type GetStreamersLazyQueryHookResult = ReturnType<typeof useGetStreamersLazyQuery>;
export type GetStreamersSuspenseQueryHookResult = ReturnType<typeof useGetStreamersSuspenseQuery>;
export type GetStreamersQueryResult = Apollo.QueryResult<GetStreamersQuery, GetStreamersQueryVariables>;
export const StreamUpdatedDocument = gql`
    subscription StreamUpdated($streamId: UUID!) {
  streamUpdated(streamId: $streamId) {
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
 * __useStreamUpdatedSubscription__
 *
 * To run a query within a React component, call `useStreamUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useStreamUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStreamUpdatedSubscription({
 *   variables: {
 *      streamId: // value for 'streamId'
 *   },
 * });
 */
export function useStreamUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<StreamUpdatedSubscription, StreamUpdatedSubscriptionVariables> & ({ variables: StreamUpdatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<StreamUpdatedSubscription, StreamUpdatedSubscriptionVariables>(StreamUpdatedDocument, options);
      }
export type StreamUpdatedSubscriptionHookResult = ReturnType<typeof useStreamUpdatedSubscription>;
export type StreamUpdatedSubscriptionResult = Apollo.SubscriptionResult<StreamUpdatedSubscription>;
export const WatchStreamDocument = gql`
    subscription WatchStream($streamId: UUID!) {
  watchStream(streamId: $streamId) {
    streamId
  }
}
    `;

/**
 * __useWatchStreamSubscription__
 *
 * To run a query within a React component, call `useWatchStreamSubscription` and pass it any options that fit your needs.
 * When your component renders, `useWatchStreamSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWatchStreamSubscription({
 *   variables: {
 *      streamId: // value for 'streamId'
 *   },
 * });
 */
export function useWatchStreamSubscription(baseOptions: Apollo.SubscriptionHookOptions<WatchStreamSubscription, WatchStreamSubscriptionVariables> & ({ variables: WatchStreamSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<WatchStreamSubscription, WatchStreamSubscriptionVariables>(WatchStreamDocument, options);
      }
export type WatchStreamSubscriptionHookResult = ReturnType<typeof useWatchStreamSubscription>;
export type WatchStreamSubscriptionResult = Apollo.SubscriptionResult<WatchStreamSubscription>;
export const SubscribeWatchStreamDocument = gql`
    subscription SubscribeWatchStream($streamId: UUID!) {
  subscribeWatchStream(streamId: $streamId) {
    streamId
  }
}
    `;

/**
 * __useSubscribeWatchStreamSubscription__
 *
 * To run a query within a React component, call `useSubscribeWatchStreamSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeWatchStreamSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeWatchStreamSubscription({
 *   variables: {
 *      streamId: // value for 'streamId'
 *   },
 * });
 */
export function useSubscribeWatchStreamSubscription(baseOptions: Apollo.SubscriptionHookOptions<SubscribeWatchStreamSubscription, SubscribeWatchStreamSubscriptionVariables> & ({ variables: SubscribeWatchStreamSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeWatchStreamSubscription, SubscribeWatchStreamSubscriptionVariables>(SubscribeWatchStreamDocument, options);
      }
export type SubscribeWatchStreamSubscriptionHookResult = ReturnType<typeof useSubscribeWatchStreamSubscription>;
export type SubscribeWatchStreamSubscriptionResult = Apollo.SubscriptionResult<SubscribeWatchStreamSubscription>;
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
      isLive
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
export const GetMySystemRoleDocument = gql`
    query GetMySystemRole {
  mySystemRole {
    roleType
    streamerId
    streamer {
      id
      userName
      avatar
      followers
      isLive
    }
  }
}
    `;

/**
 * __useGetMySystemRoleQuery__
 *
 * To run a query within a React component, call `useGetMySystemRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMySystemRoleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMySystemRoleQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMySystemRoleQuery(baseOptions?: Apollo.QueryHookOptions<GetMySystemRoleQuery, GetMySystemRoleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMySystemRoleQuery, GetMySystemRoleQueryVariables>(GetMySystemRoleDocument, options);
      }
export function useGetMySystemRoleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMySystemRoleQuery, GetMySystemRoleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMySystemRoleQuery, GetMySystemRoleQueryVariables>(GetMySystemRoleDocument, options);
        }
export function useGetMySystemRoleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMySystemRoleQuery, GetMySystemRoleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMySystemRoleQuery, GetMySystemRoleQueryVariables>(GetMySystemRoleDocument, options);
        }
export type GetMySystemRoleQueryHookResult = ReturnType<typeof useGetMySystemRoleQuery>;
export type GetMySystemRoleLazyQueryHookResult = ReturnType<typeof useGetMySystemRoleLazyQuery>;
export type GetMySystemRoleSuspenseQueryHookResult = ReturnType<typeof useGetMySystemRoleSuspenseQuery>;
export type GetMySystemRoleQueryResult = Apollo.QueryResult<GetMySystemRoleQuery, GetMySystemRoleQueryVariables>;
export const GetVodsDocument = gql`
    query GetVods($after: String, $before: String, $first: Int, $last: Int, $order: [VodDtoSortInput!], $streamerId: String!, $where: VodDtoFilterInput) {
  vods(
    after: $after
    before: $before
    first: $first
    last: $last
    order: $order
    streamerId: $streamerId
    where: $where
  ) {
    nodes {
      id
      title
      description
      preview
      source
      views
      createdAt
      duration
      streamer {
        id
        userName
        avatar
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
    `;

/**
 * __useGetVodsQuery__
 *
 * To run a query within a React component, call `useGetVodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVodsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      order: // value for 'order'
 *      streamerId: // value for 'streamerId'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetVodsQuery(baseOptions: Apollo.QueryHookOptions<GetVodsQuery, GetVodsQueryVariables> & ({ variables: GetVodsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVodsQuery, GetVodsQueryVariables>(GetVodsDocument, options);
      }
export function useGetVodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVodsQuery, GetVodsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVodsQuery, GetVodsQueryVariables>(GetVodsDocument, options);
        }
export function useGetVodsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVodsQuery, GetVodsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVodsQuery, GetVodsQueryVariables>(GetVodsDocument, options);
        }
export type GetVodsQueryHookResult = ReturnType<typeof useGetVodsQuery>;
export type GetVodsLazyQueryHookResult = ReturnType<typeof useGetVodsLazyQuery>;
export type GetVodsSuspenseQueryHookResult = ReturnType<typeof useGetVodsSuspenseQuery>;
export type GetVodsQueryResult = Apollo.QueryResult<GetVodsQuery, GetVodsQueryVariables>;
export const GetVodDocument = gql`
    query GetVod($vodId: UUID!) {
  vod(vodId: $vodId) {
    id
    title
    description
    preview
    source
    views
    createdAt
    duration
    streamer {
      id
      userName
      avatar
    }
  }
}
    `;

/**
 * __useGetVodQuery__
 *
 * To run a query within a React component, call `useGetVodQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVodQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVodQuery({
 *   variables: {
 *      vodId: // value for 'vodId'
 *   },
 * });
 */
export function useGetVodQuery(baseOptions: Apollo.QueryHookOptions<GetVodQuery, GetVodQueryVariables> & ({ variables: GetVodQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVodQuery, GetVodQueryVariables>(GetVodDocument, options);
      }
export function useGetVodLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVodQuery, GetVodQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVodQuery, GetVodQueryVariables>(GetVodDocument, options);
        }
export function useGetVodSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVodQuery, GetVodQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVodQuery, GetVodQueryVariables>(GetVodDocument, options);
        }
export type GetVodQueryHookResult = ReturnType<typeof useGetVodQuery>;
export type GetVodLazyQueryHookResult = ReturnType<typeof useGetVodLazyQuery>;
export type GetVodSuspenseQueryHookResult = ReturnType<typeof useGetVodSuspenseQuery>;
export type GetVodQueryResult = Apollo.QueryResult<GetVodQuery, GetVodQueryVariables>;