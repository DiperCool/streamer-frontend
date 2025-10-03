"use client";

import React, { ReactNode, useMemo } from "react";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    HttpLink,
    split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useAuth0 } from "@auth0/auth0-react";

interface MyApolloProviderProps {
    children: ReactNode;
}

export function MyApolloProvider({ children }: MyApolloProviderProps) {
    const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();


    const client = useMemo(() => {
        const httpLink = new HttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
        });

        const authLink = setContext(async (_, { headers }) => {
            let token = null;
            if (isAuthenticated) {
                try {
                    token = await getAccessTokenSilently();
                } catch (e) {
                    console.error("Error getting access token silently:", e);
                }
            }
            return {
                headers: {
                    ...headers,
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            };
        });

        const wsLink =
            typeof window !== "undefined"
                ? new GraphQLWsLink(
                    createClient({
                        url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URI!,
                        connectionParams: async () => {
                            let token = null;
                            if (isAuthenticated) {
                                try {
                                    token = await getAccessTokenSilently();
                                } catch (e) {
                                    console.error("Error getting access token for WS:", e);
                                }
                            }
                            return token ? { Authorization: `Bearer ${token}` } : {};
                        },
                    })
                )
                : null;

        const splitLink =
            typeof window !== "undefined" && wsLink
                ? split(
                    ({ query }) => {
                        const def = getMainDefinition(query);
                        return (
                            def.kind === "OperationDefinition" &&
                            def.operation === "subscription"
                        );
                    },
                    wsLink,
                    authLink.concat(httpLink)
                )
                : authLink.concat(httpLink);

        return new ApolloClient({
            link: splitLink,
            cache: new InMemoryCache(),
        });
    }, [getAccessTokenSilently, isAuthenticated]);

    if (authLoading || !client) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}