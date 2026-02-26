import React from "react";
import { useModerationActionsQuery, useModerationActivityCreatedSubscription } from "@/graphql/__generated__/graphql";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; // Assuming a Button component exists
import { useApolloClient } from "@apollo/client";
import { MODERATION_ACTIONS } from "@/graphql/moderationActivities/moderationActivitiesQueries";

interface ModActionsWidgetProps {
  streamerId: string;
}

export const ModActionsWidget: React.FC<ModActionsWidgetProps> = ({ streamerId }) => {
  const client = useApolloClient();

  const { data, loading, error, fetchMore } = useModerationActionsQuery({
    variables: { streamerId, first: 10 }, // Fetch initial 10 items
    skip: !streamerId,
  });

  useModerationActivityCreatedSubscription({
    variables: { streamerId },
    skip: !streamerId,
    onData: ({ client, data: subscriptionData }) => {
      const newModerationAction = subscriptionData.data?.moderationActivityCreated;

      if (newModerationAction) {
        client.cache.updateQuery(
          {
            query: MODERATION_ACTIONS,
            variables: { streamerId, first: 10 }, // Ensure variables match initial query for cache update
          },
          (existingData) => {
            if (existingData && newModerationAction) {
              const currentEdges = existingData.moderationActivities?.edges || [];
              const newEdge = {
                __typename: "ModerationActivitiesEdge",
                node: newModerationAction,
                cursor: "" // Subscriptions don't usually provide a cursor, or it's not strictly needed for prepending
              };

              return {
                ...existingData,
                moderationActivities: {
                  ...existingData.moderationActivities,
                  edges: [newEdge, ...currentEdges],
                },
              };
            }
            return existingData;
          }
        );
      }
    },
  });

  const moderationActions = data?.moderationActivities?.edges?.map((edge) => edge?.node).filter(Boolean);
  const pageInfo = data?.moderationActivities?.pageInfo;

  const handleLoadMore = () => {
    if (pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          streamerId,
          first: 10, // Load next 10 items
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newEdges = fetchMoreResult.moderationActivities?.edges || [];
          const combinedEdges = [...(prev.moderationActivities?.edges || []), ...newEdges];

          return {
            ...prev,
            moderationActivities: {
              ...prev.moderationActivities,
              edges: combinedEdges,
              pageInfo: fetchMoreResult.moderationActivities?.pageInfo,
            },
          };
        },
      });
    }
  };

  if (loading && !moderationActions) { // Only show full loading if no data yet
    return (
      <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        Loading moderation actions...
      </CardContent>
    );
  }

  if (error) {
    return (
      <CardContent className="flex-1 p-3 text-red-400 text-sm flex items-center justify-center">
        Error loading moderation actions: {error.message}
      </CardContent>
    );
  }

  if (!moderationActions || moderationActions.length === 0) {
    return (
      <CardContent className="flex-1 p-3 text-gray-400 text-sm flex items-center justify-center">
        No moderation actions found.
      </CardContent>
    );
  }

  return (
    <ScrollArea className="flex-1 h-full p-3 flex flex-col">
      <ul className="space-y-2 flex-1">
        {moderationActions.map((action, index) => (
          <li key={action.id || index} className="bg-gray-700 p-2 rounded-md text-gray-200 text-xs">
            {action.createdDate && <span className="text-gray-400">[{new Date(action.createdDate).toLocaleString()}] </span>}
            {action.__typename === "BanActionDto" && (
              <>
                <strong>Ban:</strong> {action.targetUser?.userName} by {action.moderator?.userName} (Reason: {action.reason || "N/A"}) until {action.bannedUntil ? new Date(action.bannedUntil).toLocaleString() : "N/A"}
              </>
            )}
            {action.__typename === "UnbanActionDto" && (
              <>
                <strong>Unban:</strong> {action.targetUser?.userName} by {action.moderator?.userName}
              </>
            )}
            {action.__typename === "ChatModeActionDto" && (
              <>
                <strong>Chat Mode Change:</strong> {action.newChatMode} by {action.moderator?.userName}
              </>
            )}
            {action.__typename === "PinActionDto" && (
              <>
                <strong>Pin Message:</strong> "{action.chatMessage?.message}" from {action.chatMessage?.sender?.userName} by {action.moderator?.userName}
              </>
            )}
            {action.__typename === "UnpinActionDto" && (
              <>
                <strong>Unpin Message:</strong> "{action.chatMessage?.message}" from {action.chatMessage?.sender?.userName} by {action.moderator?.userName}
              </>
            )}
            {action.__typename === "StreamNameActionDto" && (
              <>
                <strong>Stream Name Change:</strong> to "{action.newStreamName}" by {action.moderator?.userName}
              </>
            )}
            {action.__typename === "StreamLanguageActionDto" && (
              <>
                <strong>Stream Language Change:</strong> to "{action.newLanguage}" by {action.moderator?.userName}
              </>
            )}
            {action.__typename === "StreamCategoryActionDto" && (
              <>
                <strong>Stream Category Change:</strong> to "{action.newCategory}" by {action.moderator?.userName}
              </>
            )}
          </li>
        ))}
      </ul>
      {pageInfo?.hasNextPage && (
        <div className="mt-4 text-center">
          <Button onClick={handleLoadMore} disabled={loading} variant="secondary" size="sm">
            {loading ? "Loading more..." : "Load More"}
          </Button>
        </div>
      )}
    </ScrollArea>
  );
};
