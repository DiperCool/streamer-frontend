import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URI, // например: "https://example.com/graphql"
});

const wsLink = typeof window !== "undefined"
    ? new GraphQLWsLink(createClient({
        url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URI!, // например: "wss://example.com/graphql"
    }))
    : null;

const splitLink = typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
            const def = getMainDefinition(query);
            return (
                def.kind === "OperationDefinition" && def.operation === "subscription"
            );
        },
        wsLink,
        httpLink
    )
    : httpLink;

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});
