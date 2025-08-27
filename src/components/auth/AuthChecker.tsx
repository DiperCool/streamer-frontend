"use client";

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useGetMeQuery } from "@/graphql/__generated__/graphql";
import { UsernameSetupDialog } from "@/src/components/auth/UsernameSetupDialog";

interface AuthCheckerProps {
  children: React.ReactNode;
}

export const AuthChecker: React.FC<AuthCheckerProps> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();

  // Fetch 'me' data to check finishedAuth status
  const { data: meData, loading: meLoading } = useGetMeQuery({
    skip: !isAuthenticated, // Skip if not authenticated
  });

  const showUsernameDialog = isAuthenticated && !authLoading && !meLoading && meData?.me.finishedAuth === false;

  return (
    <>
      {children}
      {/* Render the UsernameSetupDialog conditionally */}
      <UsernameSetupDialog isOpen={showUsernameDialog} onClose={() => {}} />
    </>
  );
};