"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { MyApolloProvider } from "@/components/ApolloWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import type React from "react";
import { useGetMeQuery } from "@/graphql/__generated__/graphql";
import { UsernameSetupDialog } from "@/src/components/auth/UsernameSetupDialog";

export function App({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading: authLoading } = useAuth0();

    // Fetch 'me' data to check finishedAuth status
    const { data: meData, loading: meLoading } = useGetMeQuery({
        skip: !isAuthenticated, // Skip if not authenticated
    });

    const showUsernameDialog = isAuthenticated && !authLoading && !meLoading && meData?.me.finishedAuth === false;

    return (
        <Auth0Provider
            domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
            clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
            authorizationParams={{
                redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
                audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                scope: "openid profile email",
            }}
        >
            <MyApolloProvider>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                    {children}
                    {/* Render the UsernameSetupDialog conditionally */}
                    <UsernameSetupDialog isOpen={showUsernameDialog} onClose={() => {}} />
                </ThemeProvider>
            </MyApolloProvider>
        </Auth0Provider>
    );
}