import React, { useEffect, useRef } from "react";
import { ConvexReactClient, useMutation, useConvexAuth } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/authClient";
import { api } from "@/convex/_generated/api";

// Initialize Convex client
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

interface Props {
  children: React.ReactNode;
}

// Component to auto-sync user to Convex on sign in
function UserSyncer({ children }: Props) {
  const { data: session } = authClient.useSession();
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } = useConvexAuth();
  const syncUser = useMutation(api.users.syncUser);
  const hasSynced = useRef(false);

  useEffect(() => {
    // Wait for Convex auth to be ready before syncing
    if (session && isConvexAuthenticated && !isConvexLoading && !hasSynced.current) {
      hasSynced.current = true;
      syncUser({})
        .then(() => {
          console.log("User synced to Convex");
        })
        .catch((error) => {
          console.log("User sync deferred:", error.message);
          // Reset so we can try again
          hasSynced.current = false;
        });
    }

    // Reset flag when signed out
    if (!session) {
      hasSynced.current = false;
    }
  }, [session, isConvexAuthenticated, isConvexLoading, syncUser]);

  return <>{children}</>;
}

export function ConvexAuthProvider({ children }: Props) {
  if (!convex) {
    // Fallback: render children without Convex if not configured
    console.warn("Convex URL not configured. Running without backend.");
    return <>{children}</>;
  }

  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <UserSyncer>{children}</UserSyncer>
    </ConvexBetterAuthProvider>
  );
}

export default ConvexAuthProvider;
