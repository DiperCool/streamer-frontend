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

export type AnalyticsDiagramItem = {
  __typename?: 'AnalyticsDiagramItem';
  title: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export enum AnalyticsDiagramType {
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK'
}

export enum AnalyticsItemType {
  Follower = 'FOLLOWER',
  StreamTime = 'STREAM_TIME',
  StreamViewers = 'STREAM_VIEWERS'
}

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

export type BanUserInput = {
  banUntil: Scalars['DateTime']['input'];
  broadcasterId: Scalars['String']['input'];
  reason: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type BanUserResponse = {
  __typename?: 'BanUserResponse';
  id: Scalars['UUID']['output'];
};

export type BannedUserDto = {
  __typename?: 'BannedUserDto';
  bannedAt: Scalars['DateTime']['output'];
  bannedBy?: Maybe<StreamerDto>;
  bannedById: Scalars['String']['output'];
  bannedUntil: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  reason: Scalars['String']['output'];
  user?: Maybe<StreamerDto>;
  userId: Scalars['String']['output'];
};

export type BannedUserDtoFilterInput = {
  and?: InputMaybe<Array<BannedUserDtoFilterInput>>;
  bannedAt?: InputMaybe<DateTimeOperationFilterInput>;
  bannedById?: InputMaybe<StringOperationFilterInput>;
  bannedUntil?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<BannedUserDtoFilterInput>>;
  reason?: InputMaybe<StringOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type BannedUserDtoSortInput = {
  bannedAt?: InputMaybe<SortEnumType>;
  bannedById?: InputMaybe<SortEnumType>;
  bannedUntil?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  reason?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type BannedUsersConnection = {
  __typename?: 'BannedUsersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<BannedUsersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<BannedUserDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BannedUsersEdge = {
  __typename?: 'BannedUsersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: BannedUserDto;
};

export type BannerDto = {
  __typename?: 'BannerDto';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BotDto = {
  __typename?: 'BotDto';
  id: Scalars['UUID']['output'];
  state: BotState;
  streamVideoUrl: Scalars['String']['output'];
  streamer?: Maybe<StreamerDto>;
  streamerId: Scalars['String']['output'];
};

export type BotDtoFilterInput = {
  and?: InputMaybe<Array<BotDtoFilterInput>>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<BotDtoFilterInput>>;
  state?: InputMaybe<BotStateOperationFilterInput>;
  streamVideoUrl?: InputMaybe<StringOperationFilterInput>;
  streamerId?: InputMaybe<StringOperationFilterInput>;
};

export type BotDtoSortInput = {
  id?: InputMaybe<SortEnumType>;
  state?: InputMaybe<SortEnumType>;
  streamVideoUrl?: InputMaybe<SortEnumType>;
  streamerId?: InputMaybe<SortEnumType>;
};

export enum BotState {
  Active = 'ACTIVE',
  Stopped = 'STOPPED'
}

export type BotStateOperationFilterInput = {
  eq?: InputMaybe<BotState>;
  in?: InputMaybe<Array<BotState>>;
  neq?: InputMaybe<BotState>;
  nin?: InputMaybe<Array<BotState>>;
};

/** A connection to a list of items. */
export type BotsConnection = {
  __typename?: 'BotsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<BotsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<BotDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BotsEdge = {
  __typename?: 'BotsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: BotDto;
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
  watchers: Scalars['Long']['output'];
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

export type CreateBannerInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  streamerId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBannerResponse = {
  __typename?: 'CreateBannerResponse';
  id: Scalars['UUID']['output'];
};

export type CreateBotInput = {
  state: BotState;
  streamVideoUrl: Scalars['String']['input'];
  streamerId: Scalars['String']['input'];
};

export type CreateBotResponse = {
  __typename?: 'CreateBotResponse';
  id: Scalars['UUID']['output'];
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

export type EditBotInput = {
  id: Scalars['UUID']['input'];
  state: BotState;
  streamVideoUrl: Scalars['String']['input'];
};

export type EditBotResponse = {
  __typename?: 'EditBotResponse';
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

export type EditNotificationSettingsInput = {
  streamerLive: Scalars['Boolean']['input'];
  userFollowed: Scalars['Boolean']['input'];
};

export type EditNotificationSettingsResponse = {
  __typename?: 'EditNotificationSettingsResponse';
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

export type EditVodSettingsInput = {
  vodEnabled: Scalars['Boolean']['input'];
};

export type EditVodSettingsResponse = {
  __typename?: 'EditVodSettingsResponse';
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

export type FollowerDto = {
  __typename?: 'FollowerDto';
  followedAt: Scalars['DateTime']['output'];
  followerStreamer?: Maybe<StreamerDto>;
  followerStreamerId: Scalars['String']['output'];
};

export type FollowerDtoFilterInput = {
  and?: InputMaybe<Array<FollowerDtoFilterInput>>;
  followedAt?: InputMaybe<DateTimeOperationFilterInput>;
  followerStreamerId?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<FollowerDtoFilterInput>>;
};

export type FollowerDtoSortInput = {
  followedAt?: InputMaybe<SortEnumType>;
  followerStreamerId?: InputMaybe<SortEnumType>;
};

export type GetAnalyticsDiagramInput = {
  analyticsDiagramType: AnalyticsDiagramType;
  broadcasterId: Scalars['String']['input'];
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
  type: AnalyticsItemType;
};

export type GetEmailResponse = {
  __typename?: 'GetEmailResponse';
  email: Scalars['String']['output'];
};

export type GetOverviewAnalyticsInput = {
  broadcasterId: Scalars['String']['input'];
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
};

export type GetOverviewAnalyticsResponse = {
  __typename?: 'GetOverviewAnalyticsResponse';
  days: Scalars['Int']['output'];
  items: Array<OverviewAnalyticsItem>;
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
  banUser: BanUserResponse;
  createBanner: CreateBannerResponse;
  createBot: CreateBotResponse;
  createCategory: CreateCategoryResponse;
  createMessage: CreateMessageResponse;
  createRole: CreateRoleResponse;
  deleteMessage: DeleteMessageResponse;
  editBot: EditBotResponse;
  editNotificationSettings: EditNotificationSettingsResponse;
  editRole: EditRoleResponse;
  editVodSettings: EditVodSettingsResponse;
  finishAuth: FinishAuthResponse;
  follow: FollowResponse;
  pinMessage: PinMessageResponse;
  readAllNotifications: ReadAllNotificationsResponse;
  readNotification: ReadNotificationResponse;
  removeBanner: RemoveBannerResponse;
  removeBot: RemoveBotResponse;
  removeCategory: RemoveCategoryResponse;
  removeRole: RemoveRoleResponse;
  removeVod: RemoveVodResponse;
  unbanUser: UnbanUserResponse;
  unfollow: UnfollowResponse;
  unpinMessage: UnpinMessageResponse;
  updateAvatar: UpdateAvatarResponse;
  updateBanner: UpdateBannerResponse;
  updateBio: UpdateBioResponse;
  updateCategory: EditCategoryResponse;
  updateChannelBanner: UpdateChannelBannerResponse;
  updateChatSettings: UpdateChatSettingsResponse;
  updateOfflineBanner: UpdateOfflineBannerResponse;
  updateProfile: UpdateProfileResponse;
  updateStreamInfo: UpdateStreamInfoResponse;
  updateStreamSettings: UpdateStreamSettingsResponse;
  updateVod: UpdateVodResponse;
  upload: UploadFileResponse;
};


export type MutationBanUserArgs = {
  request: BanUserInput;
};


export type MutationCreateBannerArgs = {
  banner: CreateBannerInput;
};


export type MutationCreateBotArgs = {
  input: CreateBotInput;
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


export type MutationEditBotArgs = {
  input: EditBotInput;
};


export type MutationEditNotificationSettingsArgs = {
  readNotification: EditNotificationSettingsInput;
};


export type MutationEditRoleArgs = {
  input: EditRoleInput;
};


export type MutationEditVodSettingsArgs = {
  request: EditVodSettingsInput;
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


export type MutationReadNotificationArgs = {
  readNotification: ReadNotificationInput;
};


export type MutationRemoveBannerArgs = {
  banner: RemoveBannerInput;
};


export type MutationRemoveBotArgs = {
  input: RemoveBotInput;
};


export type MutationRemoveCategoryArgs = {
  input: RemoveCategoryInput;
};


export type MutationRemoveRoleArgs = {
  input: RemoveRoleInput;
};


export type MutationRemoveVodArgs = {
  request: RemoveVodInput;
};


export type MutationUnbanUserArgs = {
  request: UnbanUserInput;
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


export type MutationUpdateBannerArgs = {
  banner: UpdateBannerInput;
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


export type MutationUpdateStreamInfoArgs = {
  streamInfo: UpdateStreamInfoInput;
};


export type MutationUpdateVodArgs = {
  request: UpdateVodInput;
};


export type MutationUploadArgs = {
  input: UploadFileInput;
};

/** A connection to a list of items. */
export type MyFollowersConnection = {
  __typename?: 'MyFollowersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MyFollowersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<FollowerDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MyFollowersEdge = {
  __typename?: 'MyFollowersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: FollowerDto;
};

/** A connection to a list of items. */
export type MyFollowingsConnection = {
  __typename?: 'MyFollowingsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MyFollowingsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<StreamerFollowerDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MyFollowingsEdge = {
  __typename?: 'MyFollowingsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: StreamerFollowerDto;
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

export type NotificationDto = {
  __typename?: 'NotificationDto';
  createdAt: Scalars['DateTime']['output'];
  discriminator: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  seen: Scalars['Boolean']['output'];
  streamer?: Maybe<StreamerDto>;
  streamerId?: Maybe<Scalars['String']['output']>;
};

export type NotificationDtoFilterInput = {
  and?: InputMaybe<Array<NotificationDtoFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  discriminator?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<NotificationDtoFilterInput>>;
  seen?: InputMaybe<BooleanOperationFilterInput>;
  streamerId?: InputMaybe<StringOperationFilterInput>;
};

export type NotificationDtoSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  discriminator?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  seen?: InputMaybe<SortEnumType>;
  streamerId?: InputMaybe<SortEnumType>;
};

export type NotificationSettingsDto = {
  __typename?: 'NotificationSettingsDto';
  id: Scalars['UUID']['output'];
  streamerLive: Scalars['Boolean']['output'];
  userFollowed: Scalars['Boolean']['output'];
};

/** A connection to a list of items. */
export type NotificationsConnection = {
  __typename?: 'NotificationsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<NotificationsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<NotificationDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type NotificationsEdge = {
  __typename?: 'NotificationsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: NotificationDto;
};

export type OverviewAnalyticsItem = {
  __typename?: 'OverviewAnalyticsItem';
  type: AnalyticsItemType;
  value: Scalars['Float']['output'];
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
  isBanners: Scalars['Boolean']['output'];
  isChat: Scalars['Boolean']['output'];
  isNone: Scalars['Boolean']['output'];
  isRoles: Scalars['Boolean']['output'];
  isStream: Scalars['Boolean']['output'];
  isVod: Scalars['Boolean']['output'];
};

export type PermissionsFlagsInput = {
  isAll?: InputMaybe<Scalars['Boolean']['input']>;
  isBanners?: InputMaybe<Scalars['Boolean']['input']>;
  isChat?: InputMaybe<Scalars['Boolean']['input']>;
  isNone?: InputMaybe<Scalars['Boolean']['input']>;
  isRoles?: InputMaybe<Scalars['Boolean']['input']>;
  isStream?: InputMaybe<Scalars['Boolean']['input']>;
  isVod?: InputMaybe<Scalars['Boolean']['input']>;
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
  analyticsDiagram: Array<AnalyticsDiagramItem>;
  bannedUsers?: Maybe<BannedUsersConnection>;
  banners: Array<BannerDto>;
  bots?: Maybe<BotsConnection>;
  categories?: Maybe<CategoriesConnection>;
  category: CategoryDto;
  categoryBySlug: CategoryDto;
  chat: ChatDto;
  chatMessages?: Maybe<ChatMessagesConnection>;
  chatMessagesHistory: Array<ChatMessageDto>;
  chatSettings: ChatSettingsDto;
  currentStream: StreamDto;
  gBot: BotDto;
  me: StreamerMeDto;
  myEmail: GetEmailResponse;
  myFollowers?: Maybe<MyFollowersConnection>;
  myFollowings?: Maybe<MyFollowingsConnection>;
  myRole: RoleDto;
  myRoles?: Maybe<MyRolesConnection>;
  mySystemRole: SystemRoleDto;
  notificationSettings: NotificationSettingsDto;
  notifications?: Maybe<NotificationsConnection>;
  overviewAnalytics: GetOverviewAnalyticsResponse;
  profile: ProfileDto;
  role: RoleDto;
  roles?: Maybe<RolesConnection>;
  search: Array<SearchResult>;
  streamInfo: StreamInfoDto;
  streamSettings: StreamSettingsDto;
  streamer: StreamerDto;
  streamerInteraction: StreamerInteractionDto;
  streamers?: Maybe<StreamersConnection>;
  streams?: Maybe<StreamsConnection>;
  tags?: Maybe<TagsConnection>;
  topCategories: Array<CategoryDto>;
  topStreams: Array<StreamDto>;
  vod: VodDto;
  vodSettings: VodSettingsDto;
  vods?: Maybe<VodsConnection>;
};


export type QueryAnalyticsDiagramArgs = {
  param: GetAnalyticsDiagramInput;
};


export type QueryBannedUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BannedUserDtoSortInput>>;
  streamerId: Scalars['String']['input'];
  where?: InputMaybe<BannedUserDtoFilterInput>;
};


export type QueryBannersArgs = {
  streamerId: Scalars['String']['input'];
};


export type QueryBotsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BotDtoSortInput>>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BotDtoFilterInput>;
};


export type QueryCategoriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<CategoryDtoSortInput>>;
  search?: InputMaybe<Scalars['String']['input']>;
  tag?: InputMaybe<Scalars['UUID']['input']>;
  where?: InputMaybe<CategoryDtoFilterInput>;
};


export type QueryCategoryArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
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


export type QueryGBotArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryMyFollowersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FollowerDtoSortInput>>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<FollowerDtoFilterInput>;
};


export type QueryMyFollowingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<StreamerFollowerDtoSortInput>>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<StreamerFollowerDtoFilterInput>;
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


export type QueryNotificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<NotificationDtoSortInput>>;
  where?: InputMaybe<NotificationDtoFilterInput>;
};


export type QueryOverviewAnalyticsArgs = {
  param: GetOverviewAnalyticsInput;
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


export type QuerySearchArgs = {
  search: Scalars['String']['input'];
};


export type QueryStreamInfoArgs = {
  streamerId: Scalars['String']['input'];
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


export type QueryStreamsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['UUID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  languages?: InputMaybe<Array<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<StreamDtoSortInput>>;
  tag?: InputMaybe<Scalars['UUID']['input']>;
  where?: InputMaybe<StreamDtoFilterInput>;
};


export type QueryTagsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TagDtoSortInput>>;
  where?: InputMaybe<TagDtoFilterInput>;
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

export type ReadAllNotificationsResponse = {
  __typename?: 'ReadAllNotificationsResponse';
  result: Scalars['Boolean']['output'];
};

export type ReadNotificationInput = {
  id: Scalars['UUID']['input'];
};

export type ReadNotificationResponse = {
  __typename?: 'ReadNotificationResponse';
  hasUnreadNotifications: Scalars['Boolean']['output'];
};

export type RemoveBannerInput = {
  bannerId: Scalars['UUID']['input'];
  streamerId: Scalars['String']['input'];
};

export type RemoveBannerResponse = {
  __typename?: 'RemoveBannerResponse';
  id: Scalars['UUID']['output'];
};

export type RemoveBotInput = {
  id: Scalars['UUID']['input'];
};

export type RemoveBotResponse = {
  __typename?: 'RemoveBotResponse';
  id: Scalars['UUID']['output'];
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

export type RemoveVodInput = {
  id: Scalars['UUID']['input'];
};

export type RemoveVodResponse = {
  __typename?: 'RemoveVodResponse';
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

export type SearchResult = {
  __typename?: 'SearchResult';
  image?: Maybe<Scalars['String']['output']>;
  resultType: SearchResultType;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export enum SearchResultType {
  Category = 'CATEGORY',
  Streamer = 'STREAMER'
}

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StreamDto = {
  __typename?: 'StreamDto';
  active: Scalars['Boolean']['output'];
  category?: Maybe<CategoryDto>;
  categoryId?: Maybe<Scalars['UUID']['output']>;
  currentViewers: Scalars['Long']['output'];
  id: Scalars['UUID']['output'];
  language: Scalars['String']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  sources: Array<StreamSourceDto>;
  started: Scalars['DateTime']['output'];
  streamer?: Maybe<StreamerDto>;
  streamerId: Scalars['String']['output'];
  tags: Array<TagDto>;
  title: Scalars['String']['output'];
};

export type StreamDtoFilterInput = {
  active?: InputMaybe<BooleanOperationFilterInput>;
  and?: InputMaybe<Array<StreamDtoFilterInput>>;
  categoryId?: InputMaybe<UuidOperationFilterInput>;
  currentViewers?: InputMaybe<LongOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  language?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StreamDtoFilterInput>>;
  preview?: InputMaybe<StringOperationFilterInput>;
  started?: InputMaybe<DateTimeOperationFilterInput>;
  streamerId?: InputMaybe<StringOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
};

export type StreamDtoSortInput = {
  active?: InputMaybe<SortEnumType>;
  categoryId?: InputMaybe<SortEnumType>;
  currentViewers?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  language?: InputMaybe<SortEnumType>;
  preview?: InputMaybe<SortEnumType>;
  started?: InputMaybe<SortEnumType>;
  streamerId?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
};

export type StreamInfoDto = {
  __typename?: 'StreamInfoDto';
  category?: Maybe<CategoryDto>;
  categoryId?: Maybe<Scalars['UUID']['output']>;
  id: Scalars['UUID']['output'];
  language: Scalars['String']['output'];
  streamerId: Scalars['String']['output'];
  tags: Array<TagDto>;
  title?: Maybe<Scalars['String']['output']>;
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

export type StreamerFollowerDto = {
  __typename?: 'StreamerFollowerDto';
  avatar?: Maybe<Scalars['String']['output']>;
  currentStream?: Maybe<StreamDto>;
  currentStreamId?: Maybe<Scalars['UUID']['output']>;
  id: Scalars['String']['output'];
  isLive: Scalars['Boolean']['output'];
  userName?: Maybe<Scalars['String']['output']>;
};

export type StreamerFollowerDtoFilterInput = {
  and?: InputMaybe<Array<StreamerFollowerDtoFilterInput>>;
  avatar?: InputMaybe<StringOperationFilterInput>;
  currentStreamId?: InputMaybe<UuidOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isLive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<StreamerFollowerDtoFilterInput>>;
  userName?: InputMaybe<StringOperationFilterInput>;
};

export type StreamerFollowerDtoSortInput = {
  avatar?: InputMaybe<SortEnumType>;
  currentStreamId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isLive?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
};

export type StreamerInteractionDto = {
  __typename?: 'StreamerInteractionDto';
  banned: Scalars['Boolean']['output'];
  bannedUntil?: Maybe<Scalars['DateTime']['output']>;
  followed: Scalars['Boolean']['output'];
  followedAt?: Maybe<Scalars['DateTime']['output']>;
  lastTimeMessage?: Maybe<Scalars['DateTime']['output']>;
  permissions: PermissionsFlags;
};

export type StreamerMeDto = {
  __typename?: 'StreamerMeDto';
  avatar?: Maybe<Scalars['String']['output']>;
  finishedAuth: Scalars['Boolean']['output'];
  followers: Scalars['Long']['output'];
  hasUnreadNotifications: Scalars['Boolean']['output'];
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

/** A connection to a list of items. */
export type StreamsConnection = {
  __typename?: 'StreamsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<StreamsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<StreamDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type StreamsEdge = {
  __typename?: 'StreamsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: StreamDto;
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
  notificationCreated: NotificationDto;
  streamUpdated: StreamDto;
  streamerUpdated: StreamerDto;
  subscribeNotificationCreated: Array<NotificationDto>;
  subscribeWatchStream: Array<StreamWatcher>;
  userBanned: BannedUserDto;
  userUnbanned: BannedUserDto;
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


export type SubscriptionUserBannedArgs = {
  broadcasterId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type SubscriptionUserUnbannedArgs = {
  broadcasterId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
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

export type TagDto = {
  __typename?: 'TagDto';
  id: Scalars['UUID']['output'];
  title: Scalars['String']['output'];
};

export type TagDtoFilterInput = {
  and?: InputMaybe<Array<TagDtoFilterInput>>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<TagDtoFilterInput>>;
  title?: InputMaybe<StringOperationFilterInput>;
};

export type TagDtoSortInput = {
  id?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type TagsConnection = {
  __typename?: 'TagsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TagsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<TagDto>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type TagsEdge = {
  __typename?: 'TagsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: TagDto;
};

export type UnbanUserInput = {
  broadcasterId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type UnbanUserResponse = {
  __typename?: 'UnbanUserResponse';
  id: Scalars['UUID']['output'];
};

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

export type UpdateBannerInput = {
  bannerId: Scalars['UUID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  streamerId: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBannerResponse = {
  __typename?: 'UpdateBannerResponse';
  id: Scalars['UUID']['output'];
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

export type UpdateStreamInfoInput = {
  categoryId?: InputMaybe<Scalars['UUID']['input']>;
  language: Scalars['String']['input'];
  streamerId: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type UpdateStreamInfoResponse = {
  __typename?: 'UpdateStreamInfoResponse';
  id: Scalars['UUID']['output'];
};

export type UpdateStreamSettingsResponse = {
  __typename?: 'UpdateStreamSettingsResponse';
  id: Scalars['UUID']['output'];
};

export type UpdateVodInput = {
  categoryId?: InputMaybe<Scalars['UUID']['input']>;
  description: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
  language: Scalars['String']['input'];
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  type: VodType;
};

export type UpdateVodResponse = {
  __typename?: 'UpdateVodResponse';
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
  category?: Maybe<CategoryDto>;
  categoryId?: Maybe<Scalars['UUID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  duration: Scalars['Long']['output'];
  id: Scalars['UUID']['output'];
  language: Scalars['String']['output'];
  preview?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  streamer?: Maybe<StreamerDto>;
  streamerId: Scalars['String']['output'];
  tags: Array<TagDto>;
  title?: Maybe<Scalars['String']['output']>;
  type: VodType;
  views: Scalars['Long']['output'];
};

export type VodDtoFilterInput = {
  and?: InputMaybe<Array<VodDtoFilterInput>>;
  categoryId?: InputMaybe<UuidOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  duration?: InputMaybe<LongOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  language?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<VodDtoFilterInput>>;
  preview?: InputMaybe<StringOperationFilterInput>;
  source?: InputMaybe<StringOperationFilterInput>;
  streamerId?: InputMaybe<StringOperationFilterInput>;
  title?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<VodTypeOperationFilterInput>;
  views?: InputMaybe<LongOperationFilterInput>;
};

export type VodDtoSortInput = {
  categoryId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  duration?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  language?: InputMaybe<SortEnumType>;
  preview?: InputMaybe<SortEnumType>;
  source?: InputMaybe<SortEnumType>;
  streamerId?: InputMaybe<SortEnumType>;
  title?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  views?: InputMaybe<SortEnumType>;
};

export type VodSettingsDto = {
  __typename?: 'VodSettingsDto';
  id: Scalars['UUID']['output'];
  vodEnabled: Scalars['Boolean']['output'];
};

export enum VodType {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type VodTypeOperationFilterInput = {
  eq?: InputMaybe<VodType>;
  in?: InputMaybe<Array<VodType>>;
  neq?: InputMaybe<VodType>;
  nin?: InputMaybe<Array<VodType>>;
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

export type GetAnalyticsDiagramQueryVariables = Exact<{
  param: GetAnalyticsDiagramInput;
}>;


export type GetAnalyticsDiagramQuery = { __typename?: 'Query', analyticsDiagram: Array<{ __typename?: 'AnalyticsDiagramItem', title: string, value: number }> };

export type GetOverviewAnalyticsQueryVariables = Exact<{
  param: GetOverviewAnalyticsInput;
}>;


export type GetOverviewAnalyticsQuery = { __typename?: 'Query', overviewAnalytics: { __typename?: 'GetOverviewAnalyticsResponse', days: number, items: Array<{ __typename?: 'OverviewAnalyticsItem', type: AnalyticsItemType, value: number }> } };

export type CreateBannerMutationVariables = Exact<{
  banner: CreateBannerInput;
}>;


export type CreateBannerMutation = { __typename?: 'Mutation', createBanner: { __typename?: 'CreateBannerResponse', id: string } };

export type UpdateBannerMutationVariables = Exact<{
  banner: UpdateBannerInput;
}>;


export type UpdateBannerMutation = { __typename?: 'Mutation', updateBanner: { __typename?: 'UpdateBannerResponse', id: string } };

export type RemoveBannerMutationVariables = Exact<{
  banner: RemoveBannerInput;
}>;


export type RemoveBannerMutation = { __typename?: 'Mutation', removeBanner: { __typename?: 'RemoveBannerResponse', id: string } };

export type GetBannersQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type GetBannersQuery = { __typename?: 'Query', banners: Array<{ __typename?: 'BannerDto', id: string, title?: string | null, description?: string | null, image?: string | null, url?: string | null }> };

export type CreateBotMutationVariables = Exact<{
  input: CreateBotInput;
}>;


export type CreateBotMutation = { __typename?: 'Mutation', createBot: { __typename?: 'CreateBotResponse', id: string } };

export type EditBotMutationVariables = Exact<{
  input: EditBotInput;
}>;


export type EditBotMutation = { __typename?: 'Mutation', editBot: { __typename?: 'EditBotResponse', id: string } };

export type RemoveBotMutationVariables = Exact<{
  input: RemoveBotInput;
}>;


export type RemoveBotMutation = { __typename?: 'Mutation', removeBot: { __typename?: 'RemoveBotResponse', id: string } };

export type GetBotsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BotDtoSortInput> | BotDtoSortInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<BotDtoFilterInput>;
}>;


export type GetBotsQuery = { __typename?: 'Query', bots?: { __typename?: 'BotsConnection', nodes?: Array<{ __typename?: 'BotDto', id: string, state: BotState, streamVideoUrl: string, streamerId: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetBotByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBotByIdQuery = { __typename?: 'Query', gBot: { __typename?: 'BotDto', id: string, state: BotState, streamVideoUrl: string, streamerId: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null } };

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

export type GetCategoryBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCategoryBySlugQuery = { __typename?: 'Query', categoryBySlug: { __typename?: 'CategoryDto', id: string, title: string, slug: string, image: string, watchers: number } };

export type GetTopCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTopCategoriesQuery = { __typename?: 'Query', topCategories: Array<{ __typename?: 'CategoryDto', id: string, title: string, slug: string, image: string, watchers: number }> };

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

export type BanUserMutationVariables = Exact<{
  request: BanUserInput;
}>;


export type BanUserMutation = { __typename?: 'Mutation', banUser: { __typename?: 'BanUserResponse', id: string } };

export type UnbanUserMutationVariables = Exact<{
  request: UnbanUserInput;
}>;


export type UnbanUserMutation = { __typename?: 'Mutation', unbanUser: { __typename?: 'UnbanUserResponse', id: string } };

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


export type GetChatMessagesQuery = { __typename?: 'Query', chatMessages?: { __typename?: 'ChatMessagesConnection', nodes?: Array<{ __typename?: 'ChatMessageDto', id: string, createdAt: string, isActive: boolean, isDeleted: boolean, message: string, type: ChatMessageType, senderId: string, replyId?: string | null, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, reply?: { __typename?: 'ChatMessageDto', id: string, isDeleted: boolean, message: string, sender?: { __typename?: 'StreamerDto', userName?: string | null } | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetChatSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatSettingsQuery = { __typename?: 'Query', chatSettings: { __typename?: 'ChatSettingsDto', id: string, bannedWords: Array<string>, followersOnly: boolean, slowMode?: number | null, subscribersOnly: boolean } };

export type GetChatMessagesHistoryQueryVariables = Exact<{
  chatId: Scalars['UUID']['input'];
  order?: InputMaybe<Array<ChatMessageDtoSortInput> | ChatMessageDtoSortInput>;
  startFrom: Scalars['DateTime']['input'];
  where?: InputMaybe<ChatMessageDtoFilterInput>;
}>;


export type GetChatMessagesHistoryQuery = { __typename?: 'Query', chatMessagesHistory: Array<{ __typename?: 'ChatMessageDto', createdAt: string, id: string, isActive: boolean, isDeleted: boolean, message: string, replyId?: string | null, senderId: string, type: ChatMessageType, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, reply?: { __typename?: 'ChatMessageDto', id: string, isDeleted: boolean, message: string, sender?: { __typename?: 'StreamerDto', id: string, userName?: string | null } | null } | null }> };

export type GetBannedUsersQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<BannedUserDtoSortInput> | BannedUserDtoSortInput>;
  streamerId: Scalars['String']['input'];
  where?: InputMaybe<BannedUserDtoFilterInput>;
}>;


export type GetBannedUsersQuery = { __typename?: 'Query', bannedUsers?: { __typename?: 'BannedUsersConnection', nodes?: Array<{ __typename?: 'BannedUserDto', id: string, userId: string, bannedById: string, reason: string, bannedAt: string, bannedUntil: string, user?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, bannedBy?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

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

export type UserBannedSubscriptionVariables = Exact<{
  broadcasterId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type UserBannedSubscription = { __typename?: 'Subscription', userBanned: { __typename?: 'BannedUserDto', id: string, userId: string, bannedById: string, reason: string, bannedAt: string, bannedUntil: string, user?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, bannedBy?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null } };

export type UserUnbannedSubscriptionVariables = Exact<{
  broadcasterId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type UserUnbannedSubscription = { __typename?: 'Subscription', userUnbanned: { __typename?: 'BannedUserDto', id: string, userId: string, bannedById: string, reason: string, bannedAt: string, bannedUntil: string, user?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, bannedBy?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null } };

export type UploadFileMutationVariables = Exact<{
  input: UploadFileInput;
}>;


export type UploadFileMutation = { __typename?: 'Mutation', upload: { __typename?: 'UploadFileResponse', fileName: string } };

export type ReadNotificationMutationVariables = Exact<{
  readNotification: ReadNotificationInput;
}>;


export type ReadNotificationMutation = { __typename?: 'Mutation', readNotification: { __typename?: 'ReadNotificationResponse', hasUnreadNotifications: boolean } };

export type EditNotificationSettingsMutationVariables = Exact<{
  input: EditNotificationSettingsInput;
}>;


export type EditNotificationSettingsMutation = { __typename?: 'Mutation', editNotificationSettings: { __typename?: 'EditNotificationSettingsResponse', id: string } };

export type ReadAllNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type ReadAllNotificationsMutation = { __typename?: 'Mutation', readAllNotifications: { __typename?: 'ReadAllNotificationsResponse', result: boolean } };

export type GetNotificationsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<NotificationDtoSortInput> | NotificationDtoSortInput>;
}>;


export type GetNotificationsQuery = { __typename?: 'Query', notifications?: { __typename?: 'NotificationsConnection', nodes?: Array<{ __typename?: 'NotificationDto', id: string, createdAt: string, seen: boolean, discriminator: string, streamerId?: string | null, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetNotificationSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationSettingsQuery = { __typename?: 'Query', notificationSettings: { __typename?: 'NotificationSettingsDto', id: string, streamerLive: boolean, userFollowed: boolean } };

export type NotificationCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotificationCreatedSubscription = { __typename?: 'Subscription', notificationCreated: { __typename?: 'NotificationDto', id: string, createdAt: string, seen: boolean, discriminator: string, streamerId?: string | null, streamer?: { __typename?: 'StreamerDto', id: string, isLive: boolean, userName?: string | null, avatar?: string | null } | null } };

export type SubscribeNotificationCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeNotificationCreatedSubscription = { __typename?: 'Subscription', subscribeNotificationCreated: Array<{ __typename?: 'NotificationDto', id: string, createdAt: string, seen: boolean, discriminator: string, streamer?: { __typename?: 'StreamerDto', id: string, isLive: boolean, userName?: string | null, avatar?: string | null } | null }> };

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


export type GetMyRoleQuery = { __typename?: 'Query', myRole: { __typename?: 'RoleDto', id: string, type: RoleType, streamerId: string, broadcasterId: string, permissions: { __typename?: 'PermissionsFlags', isAll: boolean, isChat: boolean, isNone: boolean, isRoles: boolean, isStream: boolean, isVod: boolean }, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, broadcaster?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null } };

export type GetRoleByIdQueryVariables = Exact<{
  roleId: Scalars['UUID']['input'];
}>;


export type GetRoleByIdQuery = { __typename?: 'Query', role: { __typename?: 'RoleDto', id: string, type: RoleType, streamerId: string, broadcasterId: string, permissions: { __typename?: 'PermissionsFlags', isAll: boolean, isChat: boolean, isNone: boolean, isRoles: boolean, isStream: boolean, isVod: boolean }, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, broadcaster?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null } };

export type SearchQueryVariables = Exact<{
  search: Scalars['String']['input'];
}>;


export type SearchQuery = { __typename?: 'Query', search: Array<{ __typename?: 'SearchResult', title: string, slug: string, image?: string | null, resultType: SearchResultType }> };

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


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'StreamerMeDto', id: string, avatar?: string | null, userName?: string | null, followers: number, isLive: boolean, finishedAuth: boolean, hasUnreadNotifications: boolean } };

export type GetMyEmailQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyEmailQuery = { __typename?: 'Query', myEmail: { __typename?: 'GetEmailResponse', email: string } };

export type StreamerInteractionQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type StreamerInteractionQuery = { __typename?: 'Query', streamerInteraction: { __typename?: 'StreamerInteractionDto', followed: boolean, followedAt?: string | null, banned: boolean, bannedUntil?: string | null, lastTimeMessage?: string | null, permissions: { __typename?: 'PermissionsFlags', isAll: boolean, isChat: boolean, isNone: boolean, isRoles: boolean, isStream: boolean, isVod: boolean } } };

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

export type GetMyFollowingsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<StreamerFollowerDtoSortInput> | StreamerFollowerDtoSortInput>;
  where?: InputMaybe<StreamerFollowerDtoFilterInput>;
}>;


export type GetMyFollowingsQuery = { __typename?: 'Query', myFollowings?: { __typename?: 'MyFollowingsConnection', nodes?: Array<{ __typename?: 'StreamerFollowerDto', id: string, userName?: string | null, avatar?: string | null, isLive: boolean, currentStream?: { __typename?: 'StreamDto', id: string, title: string, currentViewers: number, category?: { __typename?: 'CategoryDto', id: string, title: string } | null } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetMyFollowersQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<FollowerDtoSortInput> | FollowerDtoSortInput>;
  where?: InputMaybe<FollowerDtoFilterInput>;
}>;


export type GetMyFollowersQuery = { __typename?: 'Query', myFollowers?: { __typename?: 'MyFollowersConnection', nodes?: Array<{ __typename?: 'FollowerDto', followerStreamerId: string, followedAt: string, followerStreamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null, isLive: boolean } | null }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type StreamUpdatedSubscriptionVariables = Exact<{
  streamId: Scalars['UUID']['input'];
}>;


export type StreamUpdatedSubscription = { __typename?: 'Subscription', streamUpdated: { __typename?: 'StreamDto', id: string, active: boolean, title: string, currentViewers: number, language: string, started: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null, followers: number } | null, category?: { __typename?: 'CategoryDto', id: string, title: string, slug: string, image: string } | null, tags: Array<{ __typename?: 'TagDto', id: string, title: string }> } };

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

export type UpdateStreamInfoMutationVariables = Exact<{
  streamInfo: UpdateStreamInfoInput;
}>;


export type UpdateStreamInfoMutation = { __typename?: 'Mutation', updateStreamInfo: { __typename?: 'UpdateStreamInfoResponse', id: string } };

export type GetCurrentStreamQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type GetCurrentStreamQuery = { __typename?: 'Query', currentStream: { __typename?: 'StreamDto', id: string, streamerId: string, active: boolean, title: string, currentViewers: number, language: string, started: string, streamer?: { __typename?: 'StreamerDto', id: string, isLive: boolean, userName?: string | null, avatar?: string | null, followers: number } | null, sources: Array<{ __typename?: 'StreamSourceDto', streamId: string, url: string, sourceType: StreamSourceType }>, category?: { __typename?: 'CategoryDto', id: string, title: string, slug: string, image: string } | null, tags: Array<{ __typename?: 'TagDto', id: string, title: string }> } };

export type GetStreamSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStreamSettingsQuery = { __typename?: 'Query', streamSettings: { __typename?: 'StreamSettingsDto', id: string, streamKey: string, streamUrl: string } };

export type GetStreamInfoQueryVariables = Exact<{
  streamerId: Scalars['String']['input'];
}>;


export type GetStreamInfoQuery = { __typename?: 'Query', streamInfo: { __typename?: 'StreamInfoDto', id: string, streamerId: string, title?: string | null, language: string, categoryId?: string | null, category?: { __typename?: 'CategoryDto', id: string, title: string } | null, tags: Array<{ __typename?: 'TagDto', id: string, title: string }> } };

export type GetStreamsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<StreamDtoSortInput> | StreamDtoSortInput>;
  categoryId?: InputMaybe<Scalars['UUID']['input']>;
  languages?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  tag?: InputMaybe<Scalars['UUID']['input']>;
  where?: InputMaybe<StreamDtoFilterInput>;
}>;


export type GetStreamsQuery = { __typename?: 'Query', streams?: { __typename?: 'StreamsConnection', nodes?: Array<{ __typename?: 'StreamDto', id: string, title: string, preview?: string | null, currentViewers: number, language: string, started: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null, isLive: boolean } | null, category?: { __typename?: 'CategoryDto', id: string, title: string, image: string } | null, tags: Array<{ __typename?: 'TagDto', id: string, title: string }> }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetTopStreamsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTopStreamsQuery = { __typename?: 'Query', topStreams: Array<{ __typename?: 'StreamDto', id: string, title: string, preview?: string | null, currentViewers: number, language: string, started: string, active: boolean, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null, isLive: boolean, followers: number } | null, sources: Array<{ __typename?: 'StreamSourceDto', streamId: string, url: string, sourceType: StreamSourceType }>, category?: { __typename?: 'CategoryDto', id: string, title: string, image: string } | null, tags: Array<{ __typename?: 'TagDto', id: string, title: string }> }> };

export type GetMySystemRoleQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySystemRoleQuery = { __typename?: 'Query', mySystemRole: { __typename?: 'SystemRoleDto', roleType: SystemRoleType, streamerId: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null, followers: number, isLive: boolean } | null } };

export type GetTagsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TagDtoSortInput> | TagDtoSortInput>;
  where?: InputMaybe<TagDtoFilterInput>;
}>;


export type GetTagsQuery = { __typename?: 'Query', tags?: { __typename?: 'TagsConnection', nodes?: Array<{ __typename?: 'TagDto', id: string, title: string }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type RemoveVodMutationVariables = Exact<{
  request: RemoveVodInput;
}>;


export type RemoveVodMutation = { __typename?: 'Mutation', removeVod: { __typename?: 'RemoveVodResponse', id: string } };

export type UpdateVodMutationVariables = Exact<{
  request: UpdateVodInput;
}>;


export type UpdateVodMutation = { __typename?: 'Mutation', updateVod: { __typename?: 'UpdateVodResponse', id: string } };

export type EditVodSettingsMutationVariables = Exact<{
  request: EditVodSettingsInput;
}>;


export type EditVodSettingsMutation = { __typename?: 'Mutation', editVodSettings: { __typename?: 'EditVodSettingsResponse', id: string } };

export type GetVodsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<VodDtoSortInput> | VodDtoSortInput>;
  streamerId: Scalars['String']['input'];
  where?: InputMaybe<VodDtoFilterInput>;
}>;


export type GetVodsQuery = { __typename?: 'Query', vods?: { __typename?: 'VodsConnection', nodes?: Array<{ __typename?: 'VodDto', id: string, title?: string | null, description?: string | null, preview?: string | null, source?: string | null, views: number, createdAt: string, type: VodType, duration: number, language: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, category?: { __typename?: 'CategoryDto', id: string, title: string } | null, tags: Array<{ __typename?: 'TagDto', id: string, title: string }> }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetVodQueryVariables = Exact<{
  vodId: Scalars['UUID']['input'];
}>;


export type GetVodQuery = { __typename?: 'Query', vod: { __typename?: 'VodDto', id: string, title?: string | null, description?: string | null, preview?: string | null, source?: string | null, views: number, createdAt: string, duration: number, type: VodType, language: string, streamer?: { __typename?: 'StreamerDto', id: string, userName?: string | null, avatar?: string | null } | null, category?: { __typename?: 'CategoryDto', id: string, title: string } | null, tags: Array<{ __typename?: 'TagDto', id: string, title: string }> } };

export type GetVodSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVodSettingsQuery = { __typename?: 'Query', vodSettings: { __typename?: 'VodSettingsDto', id: string, vodEnabled: boolean } };


export const GetAnalyticsDiagramDocument = gql`
    query GetAnalyticsDiagram($param: GetAnalyticsDiagramInput!) {
  analyticsDiagram(param: $param) {
    title
    value
  }
}
    `;

/**
 * __useGetAnalyticsDiagramQuery__
 *
 * To run a query within a React component, call `useGetAnalyticsDiagramQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAnalyticsDiagramQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAnalyticsDiagramQuery({
 *   variables: {
 *      param: // value for 'param'
 *   },
 * });
 */
export function useGetAnalyticsDiagramQuery(baseOptions: Apollo.QueryHookOptions<GetAnalyticsDiagramQuery, GetAnalyticsDiagramQueryVariables> & ({ variables: GetAnalyticsDiagramQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAnalyticsDiagramQuery, GetAnalyticsDiagramQueryVariables>(GetAnalyticsDiagramDocument, options);
      }
export function useGetAnalyticsDiagramLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAnalyticsDiagramQuery, GetAnalyticsDiagramQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAnalyticsDiagramQuery, GetAnalyticsDiagramQueryVariables>(GetAnalyticsDiagramDocument, options);
        }
export function useGetAnalyticsDiagramSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAnalyticsDiagramQuery, GetAnalyticsDiagramQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAnalyticsDiagramQuery, GetAnalyticsDiagramQueryVariables>(GetAnalyticsDiagramDocument, options);
        }
export type GetAnalyticsDiagramQueryHookResult = ReturnType<typeof useGetAnalyticsDiagramQuery>;
export type GetAnalyticsDiagramLazyQueryHookResult = ReturnType<typeof useGetAnalyticsDiagramLazyQuery>;
export type GetAnalyticsDiagramSuspenseQueryHookResult = ReturnType<typeof useGetAnalyticsDiagramSuspenseQuery>;
export type GetAnalyticsDiagramQueryResult = Apollo.QueryResult<GetAnalyticsDiagramQuery, GetAnalyticsDiagramQueryVariables>;
export const GetOverviewAnalyticsDocument = gql`
    query GetOverviewAnalytics($param: GetOverviewAnalyticsInput!) {
  overviewAnalytics(param: $param) {
    days
    items {
      type
      value
    }
  }
}
    `;

/**
 * __useGetOverviewAnalyticsQuery__
 *
 * To run a query within a React component, call `useGetOverviewAnalyticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOverviewAnalyticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOverviewAnalyticsQuery({
 *   variables: {
 *      param: // value for 'param'
 *   },
 * });
 */
export function useGetOverviewAnalyticsQuery(baseOptions: Apollo.QueryHookOptions<GetOverviewAnalyticsQuery, GetOverviewAnalyticsQueryVariables> & ({ variables: GetOverviewAnalyticsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOverviewAnalyticsQuery, GetOverviewAnalyticsQueryVariables>(GetOverviewAnalyticsDocument, options);
      }
export function useGetOverviewAnalyticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOverviewAnalyticsQuery, GetOverviewAnalyticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOverviewAnalyticsQuery, GetOverviewAnalyticsQueryVariables>(GetOverviewAnalyticsDocument, options);
        }
export function useGetOverviewAnalyticsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOverviewAnalyticsQuery, GetOverviewAnalyticsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOverviewAnalyticsQuery, GetOverviewAnalyticsQueryVariables>(GetOverviewAnalyticsDocument, options);
        }
export type GetOverviewAnalyticsQueryHookResult = ReturnType<typeof useGetOverviewAnalyticsQuery>;
export type GetOverviewAnalyticsLazyQueryHookResult = ReturnType<typeof useGetOverviewAnalyticsLazyQuery>;
export type GetOverviewAnalyticsSuspenseQueryHookResult = ReturnType<typeof useGetOverviewAnalyticsSuspenseQuery>;
export type GetOverviewAnalyticsQueryResult = Apollo.QueryResult<GetOverviewAnalyticsQuery, GetOverviewAnalyticsQueryVariables>;
export const CreateBannerDocument = gql`
    mutation CreateBanner($banner: CreateBannerInput!) {
  createBanner(banner: $banner) {
    id
  }
}
    `;
export type CreateBannerMutationFn = Apollo.MutationFunction<CreateBannerMutation, CreateBannerMutationVariables>;

/**
 * __useCreateBannerMutation__
 *
 * To run a mutation, you first call `useCreateBannerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBannerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBannerMutation, { data, loading, error }] = useCreateBannerMutation({
 *   variables: {
 *      banner: // value for 'banner'
 *   },
 * });
 */
export function useCreateBannerMutation(baseOptions?: Apollo.MutationHookOptions<CreateBannerMutation, CreateBannerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBannerMutation, CreateBannerMutationVariables>(CreateBannerDocument, options);
      }
export type CreateBannerMutationHookResult = ReturnType<typeof useCreateBannerMutation>;
export type CreateBannerMutationResult = Apollo.MutationResult<CreateBannerMutation>;
export type CreateBannerMutationOptions = Apollo.BaseMutationOptions<CreateBannerMutation, CreateBannerMutationVariables>;
export const UpdateBannerDocument = gql`
    mutation UpdateBanner($banner: UpdateBannerInput!) {
  updateBanner(banner: $banner) {
    id
  }
}
    `;
export type UpdateBannerMutationFn = Apollo.MutationFunction<UpdateBannerMutation, UpdateBannerMutationVariables>;

/**
 * __useUpdateBannerMutation__
 *
 * To run a mutation, you first call `useUpdateBannerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBannerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBannerMutation, { data, loading, error }] = useUpdateBannerMutation({
 *   variables: {
 *      banner: // value for 'banner'
 *   },
 * });
 */
export function useUpdateBannerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBannerMutation, UpdateBannerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBannerMutation, UpdateBannerMutationVariables>(UpdateBannerDocument, options);
      }
export type UpdateBannerMutationHookResult = ReturnType<typeof useUpdateBannerMutation>;
export type UpdateBannerMutationResult = Apollo.MutationResult<UpdateBannerMutation>;
export type UpdateBannerMutationOptions = Apollo.BaseMutationOptions<UpdateBannerMutation, UpdateBannerMutationVariables>;
export const RemoveBannerDocument = gql`
    mutation RemoveBanner($banner: RemoveBannerInput!) {
  removeBanner(banner: $banner) {
    id
  }
}
    `;
export type RemoveBannerMutationFn = Apollo.MutationFunction<RemoveBannerMutation, RemoveBannerMutationVariables>;

/**
 * __useRemoveBannerMutation__
 *
 * To run a mutation, you first call `useRemoveBannerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveBannerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeBannerMutation, { data, loading, error }] = useRemoveBannerMutation({
 *   variables: {
 *      banner: // value for 'banner'
 *   },
 * });
 */
export function useRemoveBannerMutation(baseOptions?: Apollo.MutationHookOptions<RemoveBannerMutation, RemoveBannerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveBannerMutation, RemoveBannerMutationVariables>(RemoveBannerDocument, options);
      }
export type RemoveBannerMutationHookResult = ReturnType<typeof useRemoveBannerMutation>;
export type RemoveBannerMutationResult = Apollo.MutationResult<RemoveBannerMutation>;
export type RemoveBannerMutationOptions = Apollo.BaseMutationOptions<RemoveBannerMutation, RemoveBannerMutationVariables>;
export const GetBannersDocument = gql`
    query GetBanners($streamerId: String!) {
  banners(streamerId: $streamerId) {
    id
    title
    description
    image
    url
  }
}
    `;

/**
 * __useGetBannersQuery__
 *
 * To run a query within a React component, call `useGetBannersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBannersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBannersQuery({
 *   variables: {
 *      streamerId: // value for 'streamerId'
 *   },
 * });
 */
export function useGetBannersQuery(baseOptions: Apollo.QueryHookOptions<GetBannersQuery, GetBannersQueryVariables> & ({ variables: GetBannersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBannersQuery, GetBannersQueryVariables>(GetBannersDocument, options);
      }
export function useGetBannersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBannersQuery, GetBannersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBannersQuery, GetBannersQueryVariables>(GetBannersDocument, options);
        }
export function useGetBannersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBannersQuery, GetBannersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBannersQuery, GetBannersQueryVariables>(GetBannersDocument, options);
        }
export type GetBannersQueryHookResult = ReturnType<typeof useGetBannersQuery>;
export type GetBannersLazyQueryHookResult = ReturnType<typeof useGetBannersLazyQuery>;
export type GetBannersSuspenseQueryHookResult = ReturnType<typeof useGetBannersSuspenseQuery>;
export type GetBannersQueryResult = Apollo.QueryResult<GetBannersQuery, GetBannersQueryVariables>;
export const CreateBotDocument = gql`
    mutation CreateBot($input: CreateBotInput!) {
  createBot(input: $input) {
    id
  }
}
    `;
export type CreateBotMutationFn = Apollo.MutationFunction<CreateBotMutation, CreateBotMutationVariables>;

/**
 * __useCreateBotMutation__
 *
 * To run a mutation, you first call `useCreateBotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBotMutation, { data, loading, error }] = useCreateBotMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBotMutation(baseOptions?: Apollo.MutationHookOptions<CreateBotMutation, CreateBotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBotMutation, CreateBotMutationVariables>(CreateBotDocument, options);
      }
export type CreateBotMutationHookResult = ReturnType<typeof useCreateBotMutation>;
export type CreateBotMutationResult = Apollo.MutationResult<CreateBotMutation>;
export type CreateBotMutationOptions = Apollo.BaseMutationOptions<CreateBotMutation, CreateBotMutationVariables>;
export const EditBotDocument = gql`
    mutation EditBot($input: EditBotInput!) {
  editBot(input: $input) {
    id
  }
}
    `;
export type EditBotMutationFn = Apollo.MutationFunction<EditBotMutation, EditBotMutationVariables>;

/**
 * __useEditBotMutation__
 *
 * To run a mutation, you first call `useEditBotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditBotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editBotMutation, { data, loading, error }] = useEditBotMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditBotMutation(baseOptions?: Apollo.MutationHookOptions<EditBotMutation, EditBotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditBotMutation, EditBotMutationVariables>(EditBotDocument, options);
      }
export type EditBotMutationHookResult = ReturnType<typeof useEditBotMutation>;
export type EditBotMutationResult = Apollo.MutationResult<EditBotMutation>;
export type EditBotMutationOptions = Apollo.BaseMutationOptions<EditBotMutation, EditBotMutationVariables>;
export const RemoveBotDocument = gql`
    mutation RemoveBot($input: RemoveBotInput!) {
  removeBot(input: $input) {
    id
  }
}
    `;
export type RemoveBotMutationFn = Apollo.MutationFunction<RemoveBotMutation, RemoveBotMutationVariables>;

/**
 * __useRemoveBotMutation__
 *
 * To run a mutation, you first call `useRemoveBotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveBotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeBotMutation, { data, loading, error }] = useRemoveBotMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveBotMutation(baseOptions?: Apollo.MutationHookOptions<RemoveBotMutation, RemoveBotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveBotMutation, RemoveBotMutationVariables>(RemoveBotDocument, options);
      }
export type RemoveBotMutationHookResult = ReturnType<typeof useRemoveBotMutation>;
export type RemoveBotMutationResult = Apollo.MutationResult<RemoveBotMutation>;
export type RemoveBotMutationOptions = Apollo.BaseMutationOptions<RemoveBotMutation, RemoveBotMutationVariables>;
export const GetBotsDocument = gql`
    query GetBots($after: String, $before: String, $first: Int, $last: Int, $order: [BotDtoSortInput!], $search: String, $where: BotDtoFilterInput) {
  bots(
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
      state
      streamVideoUrl
      streamerId
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
 * __useGetBotsQuery__
 *
 * To run a query within a React component, call `useGetBotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBotsQuery({
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
export function useGetBotsQuery(baseOptions?: Apollo.QueryHookOptions<GetBotsQuery, GetBotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBotsQuery, GetBotsQueryVariables>(GetBotsDocument, options);
      }
export function useGetBotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBotsQuery, GetBotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBotsQuery, GetBotsQueryVariables>(GetBotsDocument, options);
        }
export function useGetBotsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBotsQuery, GetBotsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBotsQuery, GetBotsQueryVariables>(GetBotsDocument, options);
        }
export type GetBotsQueryHookResult = ReturnType<typeof useGetBotsQuery>;
export type GetBotsLazyQueryHookResult = ReturnType<typeof useGetBotsLazyQuery>;
export type GetBotsSuspenseQueryHookResult = ReturnType<typeof useGetBotsSuspenseQuery>;
export type GetBotsQueryResult = Apollo.QueryResult<GetBotsQuery, GetBotsQueryVariables>;
export const GetBotByIdDocument = gql`
    query GetBotById($id: UUID!) {
  gBot(id: $id) {
    id
    state
    streamVideoUrl
    streamerId
    streamer {
      id
      userName
      avatar
    }
  }
}
    `;

/**
 * __useGetBotByIdQuery__
 *
 * To run a query within a React component, call `useGetBotByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBotByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBotByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBotByIdQuery(baseOptions: Apollo.QueryHookOptions<GetBotByIdQuery, GetBotByIdQueryVariables> & ({ variables: GetBotByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBotByIdQuery, GetBotByIdQueryVariables>(GetBotByIdDocument, options);
      }
export function useGetBotByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBotByIdQuery, GetBotByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBotByIdQuery, GetBotByIdQueryVariables>(GetBotByIdDocument, options);
        }
export function useGetBotByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBotByIdQuery, GetBotByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBotByIdQuery, GetBotByIdQueryVariables>(GetBotByIdDocument, options);
        }
export type GetBotByIdQueryHookResult = ReturnType<typeof useGetBotByIdQuery>;
export type GetBotByIdLazyQueryHookResult = ReturnType<typeof useGetBotByIdLazyQuery>;
export type GetBotByIdSuspenseQueryHookResult = ReturnType<typeof useGetBotByIdSuspenseQuery>;
export type GetBotByIdQueryResult = Apollo.QueryResult<GetBotByIdQuery, GetBotByIdQueryVariables>;
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
export const GetCategoryBySlugDocument = gql`
    query GetCategoryBySlug($slug: String!) {
  categoryBySlug(slug: $slug) {
    id
    title
    slug
    image
    watchers
  }
}
    `;

/**
 * __useGetCategoryBySlugQuery__
 *
 * To run a query within a React component, call `useGetCategoryBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCategoryBySlugQuery(baseOptions: Apollo.QueryHookOptions<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables> & ({ variables: GetCategoryBySlugQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>(GetCategoryBySlugDocument, options);
      }
export function useGetCategoryBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>(GetCategoryBySlugDocument, options);
        }
export function useGetCategoryBySlugSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>(GetCategoryBySlugDocument, options);
        }
export type GetCategoryBySlugQueryHookResult = ReturnType<typeof useGetCategoryBySlugQuery>;
export type GetCategoryBySlugLazyQueryHookResult = ReturnType<typeof useGetCategoryBySlugLazyQuery>;
export type GetCategoryBySlugSuspenseQueryHookResult = ReturnType<typeof useGetCategoryBySlugSuspenseQuery>;
export type GetCategoryBySlugQueryResult = Apollo.QueryResult<GetCategoryBySlugQuery, GetCategoryBySlugQueryVariables>;
export const GetTopCategoriesDocument = gql`
    query GetTopCategories {
  topCategories {
    id
    title
    slug
    image
    watchers
  }
}
    `;

/**
 * __useGetTopCategoriesQuery__
 *
 * To run a query within a React component, call `useGetTopCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTopCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetTopCategoriesQuery, GetTopCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTopCategoriesQuery, GetTopCategoriesQueryVariables>(GetTopCategoriesDocument, options);
      }
export function useGetTopCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTopCategoriesQuery, GetTopCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTopCategoriesQuery, GetTopCategoriesQueryVariables>(GetTopCategoriesDocument, options);
        }
export function useGetTopCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTopCategoriesQuery, GetTopCategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTopCategoriesQuery, GetTopCategoriesQueryVariables>(GetTopCategoriesDocument, options);
        }
export type GetTopCategoriesQueryHookResult = ReturnType<typeof useGetTopCategoriesQuery>;
export type GetTopCategoriesLazyQueryHookResult = ReturnType<typeof useGetTopCategoriesLazyQuery>;
export type GetTopCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetTopCategoriesSuspenseQuery>;
export type GetTopCategoriesQueryResult = Apollo.QueryResult<GetTopCategoriesQuery, GetTopCategoriesQueryVariables>;
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
export const BanUserDocument = gql`
    mutation BanUser($request: BanUserInput!) {
  banUser(request: $request) {
    id
  }
}
    `;
export type BanUserMutationFn = Apollo.MutationFunction<BanUserMutation, BanUserMutationVariables>;

/**
 * __useBanUserMutation__
 *
 * To run a mutation, you first call `useBanUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBanUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [banUserMutation, { data, loading, error }] = useBanUserMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useBanUserMutation(baseOptions?: Apollo.MutationHookOptions<BanUserMutation, BanUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BanUserMutation, BanUserMutationVariables>(BanUserDocument, options);
      }
export type BanUserMutationHookResult = ReturnType<typeof useBanUserMutation>;
export type BanUserMutationResult = Apollo.MutationResult<BanUserMutation>;
export type BanUserMutationOptions = Apollo.BaseMutationOptions<BanUserMutation, BanUserMutationVariables>;
export const UnbanUserDocument = gql`
    mutation UnbanUser($request: UnbanUserInput!) {
  unbanUser(request: $request) {
    id
  }
}
    `;
export type UnbanUserMutationFn = Apollo.MutationFunction<UnbanUserMutation, UnbanUserMutationVariables>;

/**
 * __useUnbanUserMutation__
 *
 * To run a mutation, you first call `useUnbanUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnbanUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unbanUserMutation, { data, loading, error }] = useUnbanUserMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUnbanUserMutation(baseOptions?: Apollo.MutationHookOptions<UnbanUserMutation, UnbanUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnbanUserMutation, UnbanUserMutationVariables>(UnbanUserDocument, options);
      }
export type UnbanUserMutationHookResult = ReturnType<typeof useUnbanUserMutation>;
export type UnbanUserMutationResult = Apollo.MutationResult<UnbanUserMutation>;
export type UnbanUserMutationOptions = Apollo.BaseMutationOptions<UnbanUserMutation, UnbanUserMutationVariables>;
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
      senderId
      replyId
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
export const GetBannedUsersDocument = gql`
    query GetBannedUsers($after: String, $before: String, $first: Int, $last: Int, $order: [BannedUserDtoSortInput!], $streamerId: String!, $where: BannedUserDtoFilterInput) {
  bannedUsers(
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
      userId
      bannedById
      reason
      bannedAt
      bannedUntil
      user {
        id
        userName
        avatar
      }
      bannedBy {
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
 * __useGetBannedUsersQuery__
 *
 * To run a query within a React component, call `useGetBannedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBannedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBannedUsersQuery({
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
export function useGetBannedUsersQuery(baseOptions: Apollo.QueryHookOptions<GetBannedUsersQuery, GetBannedUsersQueryVariables> & ({ variables: GetBannedUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBannedUsersQuery, GetBannedUsersQueryVariables>(GetBannedUsersDocument, options);
      }
export function useGetBannedUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBannedUsersQuery, GetBannedUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBannedUsersQuery, GetBannedUsersQueryVariables>(GetBannedUsersDocument, options);
        }
export function useGetBannedUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBannedUsersQuery, GetBannedUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBannedUsersQuery, GetBannedUsersQueryVariables>(GetBannedUsersDocument, options);
        }
export type GetBannedUsersQueryHookResult = ReturnType<typeof useGetBannedUsersQuery>;
export type GetBannedUsersLazyQueryHookResult = ReturnType<typeof useGetBannedUsersLazyQuery>;
export type GetBannedUsersSuspenseQueryHookResult = ReturnType<typeof useGetBannedUsersSuspenseQuery>;
export type GetBannedUsersQueryResult = Apollo.QueryResult<GetBannedUsersQuery, GetBannedUsersQueryVariables>;
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
export const UserBannedDocument = gql`
    subscription UserBanned($broadcasterId: String!, $userId: String!) {
  userBanned(broadcasterId: $broadcasterId, userId: $userId) {
    id
    userId
    bannedById
    reason
    bannedAt
    bannedUntil
    user {
      id
      userName
      avatar
    }
    bannedBy {
      id
      userName
      avatar
    }
  }
}
    `;

/**
 * __useUserBannedSubscription__
 *
 * To run a query within a React component, call `useUserBannedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserBannedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserBannedSubscription({
 *   variables: {
 *      broadcasterId: // value for 'broadcasterId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserBannedSubscription(baseOptions: Apollo.SubscriptionHookOptions<UserBannedSubscription, UserBannedSubscriptionVariables> & ({ variables: UserBannedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserBannedSubscription, UserBannedSubscriptionVariables>(UserBannedDocument, options);
      }
export type UserBannedSubscriptionHookResult = ReturnType<typeof useUserBannedSubscription>;
export type UserBannedSubscriptionResult = Apollo.SubscriptionResult<UserBannedSubscription>;
export const UserUnbannedDocument = gql`
    subscription UserUnbanned($broadcasterId: String!, $userId: String!) {
  userUnbanned(broadcasterId: $broadcasterId, userId: $userId) {
    id
    userId
    bannedById
    reason
    bannedAt
    bannedUntil
    user {
      id
      userName
      avatar
    }
    bannedBy {
      id
      userName
      avatar
    }
  }
}
    `;

/**
 * __useUserUnbannedSubscription__
 *
 * To run a query within a React component, call `useUserUnbannedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserUnbannedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserUnbannedSubscription({
 *   variables: {
 *      broadcasterId: // value for 'broadcasterId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserUnbannedSubscription(baseOptions: Apollo.SubscriptionHookOptions<UserUnbannedSubscription, UserUnbannedSubscriptionVariables> & ({ variables: UserUnbannedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserUnbannedSubscription, UserUnbannedSubscriptionVariables>(UserUnbannedDocument, options);
      }
export type UserUnbannedSubscriptionHookResult = ReturnType<typeof useUserUnbannedSubscription>;
export type UserUnbannedSubscriptionResult = Apollo.SubscriptionResult<UserUnbannedSubscription>;
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
export const ReadNotificationDocument = gql`
    mutation ReadNotification($readNotification: ReadNotificationInput!) {
  readNotification(readNotification: $readNotification) {
    hasUnreadNotifications
  }
}
    `;
export type ReadNotificationMutationFn = Apollo.MutationFunction<ReadNotificationMutation, ReadNotificationMutationVariables>;

/**
 * __useReadNotificationMutation__
 *
 * To run a mutation, you first call `useReadNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readNotificationMutation, { data, loading, error }] = useReadNotificationMutation({
 *   variables: {
 *      readNotification: // value for 'readNotification'
 *   },
 * });
 */
export function useReadNotificationMutation(baseOptions?: Apollo.MutationHookOptions<ReadNotificationMutation, ReadNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReadNotificationMutation, ReadNotificationMutationVariables>(ReadNotificationDocument, options);
      }
export type ReadNotificationMutationHookResult = ReturnType<typeof useReadNotificationMutation>;
export type ReadNotificationMutationResult = Apollo.MutationResult<ReadNotificationMutation>;
export type ReadNotificationMutationOptions = Apollo.BaseMutationOptions<ReadNotificationMutation, ReadNotificationMutationVariables>;
export const EditNotificationSettingsDocument = gql`
    mutation EditNotificationSettings($input: EditNotificationSettingsInput!) {
  editNotificationSettings(readNotification: $input) {
    id
  }
}
    `;
export type EditNotificationSettingsMutationFn = Apollo.MutationFunction<EditNotificationSettingsMutation, EditNotificationSettingsMutationVariables>;

/**
 * __useEditNotificationSettingsMutation__
 *
 * To run a mutation, you first call `useEditNotificationSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditNotificationSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editNotificationSettingsMutation, { data, loading, error }] = useEditNotificationSettingsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditNotificationSettingsMutation(baseOptions?: Apollo.MutationHookOptions<EditNotificationSettingsMutation, EditNotificationSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditNotificationSettingsMutation, EditNotificationSettingsMutationVariables>(EditNotificationSettingsDocument, options);
      }
export type EditNotificationSettingsMutationHookResult = ReturnType<typeof useEditNotificationSettingsMutation>;
export type EditNotificationSettingsMutationResult = Apollo.MutationResult<EditNotificationSettingsMutation>;
export type EditNotificationSettingsMutationOptions = Apollo.BaseMutationOptions<EditNotificationSettingsMutation, EditNotificationSettingsMutationVariables>;
export const ReadAllNotificationsDocument = gql`
    mutation ReadAllNotifications {
  readAllNotifications {
    result
  }
}
    `;
export type ReadAllNotificationsMutationFn = Apollo.MutationFunction<ReadAllNotificationsMutation, ReadAllNotificationsMutationVariables>;

/**
 * __useReadAllNotificationsMutation__
 *
 * To run a mutation, you first call `useReadAllNotificationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadAllNotificationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readAllNotificationsMutation, { data, loading, error }] = useReadAllNotificationsMutation({
 *   variables: {
 *   },
 * });
 */
export function useReadAllNotificationsMutation(baseOptions?: Apollo.MutationHookOptions<ReadAllNotificationsMutation, ReadAllNotificationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReadAllNotificationsMutation, ReadAllNotificationsMutationVariables>(ReadAllNotificationsDocument, options);
      }
export type ReadAllNotificationsMutationHookResult = ReturnType<typeof useReadAllNotificationsMutation>;
export type ReadAllNotificationsMutationResult = Apollo.MutationResult<ReadAllNotificationsMutation>;
export type ReadAllNotificationsMutationOptions = Apollo.BaseMutationOptions<ReadAllNotificationsMutation, ReadAllNotificationsMutationVariables>;
export const GetNotificationsDocument = gql`
    query GetNotifications($after: String, $before: String, $first: Int, $last: Int, $order: [NotificationDtoSortInput!]) {
  notifications(
    after: $after
    before: $before
    first: $first
    last: $last
    order: $order
  ) {
    nodes {
      id
      createdAt
      seen
      discriminator
      streamerId
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
 * __useGetNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      order: // value for 'order'
 *   },
 * });
 */
export function useGetNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
      }
export function useGetNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
        }
export function useGetNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
        }
export type GetNotificationsQueryHookResult = ReturnType<typeof useGetNotificationsQuery>;
export type GetNotificationsLazyQueryHookResult = ReturnType<typeof useGetNotificationsLazyQuery>;
export type GetNotificationsSuspenseQueryHookResult = ReturnType<typeof useGetNotificationsSuspenseQuery>;
export type GetNotificationsQueryResult = Apollo.QueryResult<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetNotificationSettingsDocument = gql`
    query GetNotificationSettings {
  notificationSettings {
    id
    streamerLive
    userFollowed
  }
}
    `;

/**
 * __useGetNotificationSettingsQuery__
 *
 * To run a query within a React component, call `useGetNotificationSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNotificationSettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>(GetNotificationSettingsDocument, options);
      }
export function useGetNotificationSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>(GetNotificationSettingsDocument, options);
        }
export function useGetNotificationSettingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>(GetNotificationSettingsDocument, options);
        }
export type GetNotificationSettingsQueryHookResult = ReturnType<typeof useGetNotificationSettingsQuery>;
export type GetNotificationSettingsLazyQueryHookResult = ReturnType<typeof useGetNotificationSettingsLazyQuery>;
export type GetNotificationSettingsSuspenseQueryHookResult = ReturnType<typeof useGetNotificationSettingsSuspenseQuery>;
export type GetNotificationSettingsQueryResult = Apollo.QueryResult<GetNotificationSettingsQuery, GetNotificationSettingsQueryVariables>;
export const NotificationCreatedDocument = gql`
    subscription NotificationCreated {
  notificationCreated {
    id
    createdAt
    seen
    discriminator
    streamerId
    streamer {
      id
      isLive
      userName
      avatar
    }
  }
}
    `;

/**
 * __useNotificationCreatedSubscription__
 *
 * To run a query within a React component, call `useNotificationCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNotificationCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNotificationCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NotificationCreatedSubscription, NotificationCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NotificationCreatedSubscription, NotificationCreatedSubscriptionVariables>(NotificationCreatedDocument, options);
      }
export type NotificationCreatedSubscriptionHookResult = ReturnType<typeof useNotificationCreatedSubscription>;
export type NotificationCreatedSubscriptionResult = Apollo.SubscriptionResult<NotificationCreatedSubscription>;
export const SubscribeNotificationCreatedDocument = gql`
    subscription SubscribeNotificationCreated {
  subscribeNotificationCreated {
    id
    createdAt
    seen
    discriminator
    streamer {
      id
      isLive
      userName
      avatar
    }
  }
}
    `;

/**
 * __useSubscribeNotificationCreatedSubscription__
 *
 * To run a query within a React component, call `useSubscribeNotificationCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeNotificationCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeNotificationCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscribeNotificationCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscribeNotificationCreatedSubscription, SubscribeNotificationCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeNotificationCreatedSubscription, SubscribeNotificationCreatedSubscriptionVariables>(SubscribeNotificationCreatedDocument, options);
      }
export type SubscribeNotificationCreatedSubscriptionHookResult = ReturnType<typeof useSubscribeNotificationCreatedSubscription>;
export type SubscribeNotificationCreatedSubscriptionResult = Apollo.SubscriptionResult<SubscribeNotificationCreatedSubscription>;
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
      isVod
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
      isVod
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
export const SearchDocument = gql`
    query Search($search: String!) {
  search(search: $search) {
    title
    slug
    image
    resultType
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables> & ({ variables: SearchQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export function useSearchSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchSuspenseQueryHookResult = ReturnType<typeof useSearchSuspenseQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
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
    hasUnreadNotifications
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
    banned
    bannedUntil
    lastTimeMessage
    permissions {
      isAll
      isChat
      isNone
      isRoles
      isStream
      isVod
    }
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
export const GetMyFollowingsDocument = gql`
    query GetMyFollowings($after: String, $before: String, $first: Int, $last: Int, $order: [StreamerFollowerDtoSortInput!], $where: StreamerFollowerDtoFilterInput) {
  myFollowings(
    after: $after
    before: $before
    first: $first
    last: $last
    order: $order
    where: $where
  ) {
    nodes {
      id
      userName
      avatar
      isLive
      currentStream {
        id
        title
        category {
          id
          title
        }
        currentViewers
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
 * __useGetMyFollowingsQuery__
 *
 * To run a query within a React component, call `useGetMyFollowingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyFollowingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyFollowingsQuery({
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
export function useGetMyFollowingsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyFollowingsQuery, GetMyFollowingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyFollowingsQuery, GetMyFollowingsQueryVariables>(GetMyFollowingsDocument, options);
      }
export function useGetMyFollowingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyFollowingsQuery, GetMyFollowingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyFollowingsQuery, GetMyFollowingsQueryVariables>(GetMyFollowingsDocument, options);
        }
export function useGetMyFollowingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyFollowingsQuery, GetMyFollowingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyFollowingsQuery, GetMyFollowingsQueryVariables>(GetMyFollowingsDocument, options);
        }
export type GetMyFollowingsQueryHookResult = ReturnType<typeof useGetMyFollowingsQuery>;
export type GetMyFollowingsLazyQueryHookResult = ReturnType<typeof useGetMyFollowingsLazyQuery>;
export type GetMyFollowingsSuspenseQueryHookResult = ReturnType<typeof useGetMyFollowingsSuspenseQuery>;
export type GetMyFollowingsQueryResult = Apollo.QueryResult<GetMyFollowingsQuery, GetMyFollowingsQueryVariables>;
export const GetMyFollowersDocument = gql`
    query GetMyFollowers($after: String, $before: String, $first: Int, $last: Int, $order: [FollowerDtoSortInput!], $where: FollowerDtoFilterInput) {
  myFollowers(
    after: $after
    before: $before
    first: $first
    last: $last
    order: $order
    where: $where
  ) {
    nodes {
      followerStreamerId
      followedAt
      followerStreamer {
        id
        userName
        avatar
        isLive
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
 * __useGetMyFollowersQuery__
 *
 * To run a query within a React component, call `useGetMyFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyFollowersQuery({
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
export function useGetMyFollowersQuery(baseOptions?: Apollo.QueryHookOptions<GetMyFollowersQuery, GetMyFollowersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyFollowersQuery, GetMyFollowersQueryVariables>(GetMyFollowersDocument, options);
      }
export function useGetMyFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyFollowersQuery, GetMyFollowersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyFollowersQuery, GetMyFollowersQueryVariables>(GetMyFollowersDocument, options);
        }
export function useGetMyFollowersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyFollowersQuery, GetMyFollowersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyFollowersQuery, GetMyFollowersQueryVariables>(GetMyFollowersDocument, options);
        }
export type GetMyFollowersQueryHookResult = ReturnType<typeof useGetMyFollowersQuery>;
export type GetMyFollowersLazyQueryHookResult = ReturnType<typeof useGetMyFollowersLazyQuery>;
export type GetMyFollowersSuspenseQueryHookResult = ReturnType<typeof useGetMyFollowersSuspenseQuery>;
export type GetMyFollowersQueryResult = Apollo.QueryResult<GetMyFollowersQuery, GetMyFollowersQueryVariables>;
export const StreamUpdatedDocument = gql`
    subscription StreamUpdated($streamId: UUID!) {
  streamUpdated(streamId: $streamId) {
    id
    active
    title
    currentViewers
    language
    started
    streamer {
      id
      userName
      avatar
      followers
    }
    category {
      id
      title
      slug
      image
    }
    tags {
      id
      title
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
export const UpdateStreamInfoDocument = gql`
    mutation UpdateStreamInfo($streamInfo: UpdateStreamInfoInput!) {
  updateStreamInfo(streamInfo: $streamInfo) {
    id
  }
}
    `;
export type UpdateStreamInfoMutationFn = Apollo.MutationFunction<UpdateStreamInfoMutation, UpdateStreamInfoMutationVariables>;

/**
 * __useUpdateStreamInfoMutation__
 *
 * To run a mutation, you first call `useUpdateStreamInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStreamInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStreamInfoMutation, { data, loading, error }] = useUpdateStreamInfoMutation({
 *   variables: {
 *      streamInfo: // value for 'streamInfo'
 *   },
 * });
 */
export function useUpdateStreamInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStreamInfoMutation, UpdateStreamInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateStreamInfoMutation, UpdateStreamInfoMutationVariables>(UpdateStreamInfoDocument, options);
      }
export type UpdateStreamInfoMutationHookResult = ReturnType<typeof useUpdateStreamInfoMutation>;
export type UpdateStreamInfoMutationResult = Apollo.MutationResult<UpdateStreamInfoMutation>;
export type UpdateStreamInfoMutationOptions = Apollo.BaseMutationOptions<UpdateStreamInfoMutation, UpdateStreamInfoMutationVariables>;
export const GetCurrentStreamDocument = gql`
    query GetCurrentStream($streamerId: String!) {
  currentStream(streamerId: $streamerId) {
    id
    streamerId
    active
    title
    currentViewers
    language
    started
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
    category {
      id
      title
      slug
      image
    }
    tags {
      id
      title
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
export const GetStreamInfoDocument = gql`
    query GetStreamInfo($streamerId: String!) {
  streamInfo(streamerId: $streamerId) {
    id
    streamerId
    title
    language
    categoryId
    category {
      id
      title
    }
    tags {
      id
      title
    }
  }
}
    `;

/**
 * __useGetStreamInfoQuery__
 *
 * To run a query within a React component, call `useGetStreamInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStreamInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStreamInfoQuery({
 *   variables: {
 *      streamerId: // value for 'streamerId'
 *   },
 * });
 */
export function useGetStreamInfoQuery(baseOptions: Apollo.QueryHookOptions<GetStreamInfoQuery, GetStreamInfoQueryVariables> & ({ variables: GetStreamInfoQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStreamInfoQuery, GetStreamInfoQueryVariables>(GetStreamInfoDocument, options);
      }
export function useGetStreamInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStreamInfoQuery, GetStreamInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStreamInfoQuery, GetStreamInfoQueryVariables>(GetStreamInfoDocument, options);
        }
export function useGetStreamInfoSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStreamInfoQuery, GetStreamInfoQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStreamInfoQuery, GetStreamInfoQueryVariables>(GetStreamInfoDocument, options);
        }
export type GetStreamInfoQueryHookResult = ReturnType<typeof useGetStreamInfoQuery>;
export type GetStreamInfoLazyQueryHookResult = ReturnType<typeof useGetStreamInfoLazyQuery>;
export type GetStreamInfoSuspenseQueryHookResult = ReturnType<typeof useGetStreamInfoSuspenseQuery>;
export type GetStreamInfoQueryResult = Apollo.QueryResult<GetStreamInfoQuery, GetStreamInfoQueryVariables>;
export const GetStreamsDocument = gql`
    query GetStreams($after: String, $before: String, $first: Int, $last: Int, $order: [StreamDtoSortInput!], $categoryId: UUID, $languages: [String!], $tag: UUID, $where: StreamDtoFilterInput) {
  streams(
    after: $after
    before: $before
    first: $first
    last: $last
    order: $order
    categoryId: $categoryId
    languages: $languages
    tag: $tag
    where: $where
  ) {
    nodes {
      id
      title
      preview
      currentViewers
      language
      started
      streamer {
        id
        userName
        avatar
        isLive
      }
      category {
        id
        title
        image
      }
      tags {
        id
        title
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
 * __useGetStreamsQuery__
 *
 * To run a query within a React component, call `useGetStreamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStreamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStreamsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      order: // value for 'order'
 *      categoryId: // value for 'categoryId'
 *      languages: // value for 'languages'
 *      tag: // value for 'tag'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetStreamsQuery(baseOptions?: Apollo.QueryHookOptions<GetStreamsQuery, GetStreamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStreamsQuery, GetStreamsQueryVariables>(GetStreamsDocument, options);
      }
export function useGetStreamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStreamsQuery, GetStreamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStreamsQuery, GetStreamsQueryVariables>(GetStreamsDocument, options);
        }
export function useGetStreamsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStreamsQuery, GetStreamsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStreamsQuery, GetStreamsQueryVariables>(GetStreamsDocument, options);
        }
export type GetStreamsQueryHookResult = ReturnType<typeof useGetStreamsQuery>;
export type GetStreamsLazyQueryHookResult = ReturnType<typeof useGetStreamsLazyQuery>;
export type GetStreamsSuspenseQueryHookResult = ReturnType<typeof useGetStreamsSuspenseQuery>;
export type GetStreamsQueryResult = Apollo.QueryResult<GetStreamsQuery, GetStreamsQueryVariables>;
export const GetTopStreamsDocument = gql`
    query GetTopStreams {
  topStreams {
    id
    title
    preview
    currentViewers
    language
    started
    active
    streamer {
      id
      userName
      avatar
      isLive
      followers
    }
    sources {
      streamId
      url
      sourceType
    }
    category {
      id
      title
      image
    }
    tags {
      id
      title
    }
  }
}
    `;

/**
 * __useGetTopStreamsQuery__
 *
 * To run a query within a React component, call `useGetTopStreamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopStreamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopStreamsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTopStreamsQuery(baseOptions?: Apollo.QueryHookOptions<GetTopStreamsQuery, GetTopStreamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTopStreamsQuery, GetTopStreamsQueryVariables>(GetTopStreamsDocument, options);
      }
export function useGetTopStreamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTopStreamsQuery, GetTopStreamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTopStreamsQuery, GetTopStreamsQueryVariables>(GetTopStreamsDocument, options);
        }
export function useGetTopStreamsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTopStreamsQuery, GetTopStreamsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTopStreamsQuery, GetTopStreamsQueryVariables>(GetTopStreamsDocument, options);
        }
export type GetTopStreamsQueryHookResult = ReturnType<typeof useGetTopStreamsQuery>;
export type GetTopStreamsLazyQueryHookResult = ReturnType<typeof useGetTopStreamsLazyQuery>;
export type GetTopStreamsSuspenseQueryHookResult = ReturnType<typeof useGetTopStreamsSuspenseQuery>;
export type GetTopStreamsQueryResult = Apollo.QueryResult<GetTopStreamsQuery, GetTopStreamsQueryVariables>;
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
export const GetTagsDocument = gql`
    query GetTags($after: String, $before: String, $first: Int, $last: Int, $order: [TagDtoSortInput!], $where: TagDtoFilterInput) {
  tags(
    after: $after
    before: $before
    first: $first
    last: $last
    order: $order
    where: $where
  ) {
    nodes {
      id
      title
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
 * __useGetTagsQuery__
 *
 * To run a query within a React component, call `useGetTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTagsQuery({
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
export function useGetTagsQuery(baseOptions?: Apollo.QueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
      }
export function useGetTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
        }
export function useGetTagsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
        }
export type GetTagsQueryHookResult = ReturnType<typeof useGetTagsQuery>;
export type GetTagsLazyQueryHookResult = ReturnType<typeof useGetTagsLazyQuery>;
export type GetTagsSuspenseQueryHookResult = ReturnType<typeof useGetTagsSuspenseQuery>;
export type GetTagsQueryResult = Apollo.QueryResult<GetTagsQuery, GetTagsQueryVariables>;
export const RemoveVodDocument = gql`
    mutation RemoveVod($request: RemoveVodInput!) {
  removeVod(request: $request) {
    id
  }
}
    `;
export type RemoveVodMutationFn = Apollo.MutationFunction<RemoveVodMutation, RemoveVodMutationVariables>;

/**
 * __useRemoveVodMutation__
 *
 * To run a mutation, you first call `useRemoveVodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveVodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeVodMutation, { data, loading, error }] = useRemoveVodMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useRemoveVodMutation(baseOptions?: Apollo.MutationHookOptions<RemoveVodMutation, RemoveVodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveVodMutation, RemoveVodMutationVariables>(RemoveVodDocument, options);
      }
export type RemoveVodMutationHookResult = ReturnType<typeof useRemoveVodMutation>;
export type RemoveVodMutationResult = Apollo.MutationResult<RemoveVodMutation>;
export type RemoveVodMutationOptions = Apollo.BaseMutationOptions<RemoveVodMutation, RemoveVodMutationVariables>;
export const UpdateVodDocument = gql`
    mutation UpdateVod($request: UpdateVodInput!) {
  updateVod(request: $request) {
    id
  }
}
    `;
export type UpdateVodMutationFn = Apollo.MutationFunction<UpdateVodMutation, UpdateVodMutationVariables>;

/**
 * __useUpdateVodMutation__
 *
 * To run a mutation, you first call `useUpdateVodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVodMutation, { data, loading, error }] = useUpdateVodMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUpdateVodMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVodMutation, UpdateVodMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVodMutation, UpdateVodMutationVariables>(UpdateVodDocument, options);
      }
export type UpdateVodMutationHookResult = ReturnType<typeof useUpdateVodMutation>;
export type UpdateVodMutationResult = Apollo.MutationResult<UpdateVodMutation>;
export type UpdateVodMutationOptions = Apollo.BaseMutationOptions<UpdateVodMutation, UpdateVodMutationVariables>;
export const EditVodSettingsDocument = gql`
    mutation EditVodSettings($request: EditVodSettingsInput!) {
  editVodSettings(request: $request) {
    id
  }
}
    `;
export type EditVodSettingsMutationFn = Apollo.MutationFunction<EditVodSettingsMutation, EditVodSettingsMutationVariables>;

/**
 * __useEditVodSettingsMutation__
 *
 * To run a mutation, you first call `useEditVodSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditVodSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editVodSettingsMutation, { data, loading, error }] = useEditVodSettingsMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useEditVodSettingsMutation(baseOptions?: Apollo.MutationHookOptions<EditVodSettingsMutation, EditVodSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditVodSettingsMutation, EditVodSettingsMutationVariables>(EditVodSettingsDocument, options);
      }
export type EditVodSettingsMutationHookResult = ReturnType<typeof useEditVodSettingsMutation>;
export type EditVodSettingsMutationResult = Apollo.MutationResult<EditVodSettingsMutation>;
export type EditVodSettingsMutationOptions = Apollo.BaseMutationOptions<EditVodSettingsMutation, EditVodSettingsMutationVariables>;
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
      type
      duration
      language
      streamer {
        id
        userName
        avatar
      }
      category {
        id
        title
      }
      tags {
        id
        title
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
    type
    language
    streamer {
      id
      userName
      avatar
    }
    category {
      id
      title
    }
    tags {
      id
      title
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
export const GetVodSettingsDocument = gql`
    query GetVodSettings {
  vodSettings {
    id
    vodEnabled
  }
}
    `;

/**
 * __useGetVodSettingsQuery__
 *
 * To run a query within a React component, call `useGetVodSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVodSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVodSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVodSettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetVodSettingsQuery, GetVodSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVodSettingsQuery, GetVodSettingsQueryVariables>(GetVodSettingsDocument, options);
      }
export function useGetVodSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVodSettingsQuery, GetVodSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVodSettingsQuery, GetVodSettingsQueryVariables>(GetVodSettingsDocument, options);
        }
export function useGetVodSettingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVodSettingsQuery, GetVodSettingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVodSettingsQuery, GetVodSettingsQueryVariables>(GetVodSettingsDocument, options);
        }
export type GetVodSettingsQueryHookResult = ReturnType<typeof useGetVodSettingsQuery>;
export type GetVodSettingsLazyQueryHookResult = ReturnType<typeof useGetVodSettingsLazyQuery>;
export type GetVodSettingsSuspenseQueryHookResult = ReturnType<typeof useGetVodSettingsSuspenseQuery>;
export type GetVodSettingsQueryResult = Apollo.QueryResult<GetVodSettingsQuery, GetVodSettingsQueryVariables>;