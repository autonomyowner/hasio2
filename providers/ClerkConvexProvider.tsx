import React, { useCallback, useEffect, useRef } from "react";
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useMutation, useConvexAuth } from "convex/react";
import * as SecureStore from "expo-secure-store";
import { api } from "@/convex/_generated/api";

// Secure storage for Clerk tokens
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("Error getting token from secure store:", err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Error saving token to secure store:", err);
    }
  },
  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.error("Error clearing token from secure store:", err);
    }
  },
};

// Initialize Convex client
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

// Get Clerk publishable key
const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

interface Props {
  children: React.ReactNode;
}

// Component to auto-sync user to Convex on sign in
function UserSyncer({ children }: Props) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } = useConvexAuth();
  const syncUser = useMutation(api.users.syncUser);
  const hasSynced = useRef(false);

  useEffect(() => {
    // Wait for Convex auth to be ready before syncing
    // This ensures the JWT token has been passed to Convex
    if (isSignedIn && user && isConvexAuthenticated && !isConvexLoading && !hasSynced.current) {
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
    if (!isSignedIn) {
      hasSynced.current = false;
    }
  }, [isSignedIn, user, isConvexAuthenticated, isConvexLoading, syncUser]);

  return <>{children}</>;
}

// Inner component that has access to Clerk auth
function ConvexWrapper({ children }: Props) {
  const { getToken } = useAuth();

  // Fetch Convex token from Clerk
  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        const token = await getToken({
          template: "convex",
          skipCache: forceRefreshToken,
        });
        return token;
      } catch (error) {
        console.error("Error fetching Convex token:", error);
        return null;
      }
    },
    [getToken]
  );

  if (!convex) {
    // Fallback: render children without Convex if not configured
    console.warn("Convex URL not configured. Running without backend.");
    return <>{children}</>;
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <UserSyncer>{children}</UserSyncer>
    </ConvexProviderWithClerk>
  );
}

export function ClerkConvexProvider({ children }: Props) {
  // If Clerk is not configured, render children without auth
  if (!clerkPublishableKey) {
    console.warn("Clerk publishable key not configured. Running without auth.");
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexWrapper>{children}</ConvexWrapper>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export default ClerkConvexProvider;
