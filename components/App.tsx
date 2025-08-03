"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import {MyApolloProvider} from "@/components/ApolloWrapper";
import {ThemeProvider} from "@/components/theme-provider";
import type React from "react";
export function App({ children }: { children: React.ReactNode }) {
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
                </ThemeProvider>

            </MyApolloProvider>
        </Auth0Provider>
    );
}
