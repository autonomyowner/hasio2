import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/authClient";
import type { Doc } from "@/convex/_generated/dataModel";

/**
 * Hook to get the current user from Convex (synced from better-auth)
 * Returns the Convex user document with full profile data
 */
export function useConvexUser() {
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = !!session;

  // Query Convex for the user document
  const convexUser = useQuery(
    api.users.getCurrentUser,
    !isPending && isSignedIn ? {} : "skip"
  );

  return {
    // Auth state
    isLoaded: !isPending,
    isSignedIn,

    // Convex user data
    user: convexUser ?? null,
    isUserLoading: !isPending && isSignedIn && convexUser === undefined,

    // Convenience getters
    userId: convexUser?._id ?? null,
    userType: convexUser?.userType ?? "user",
    isBusinessOwner: convexUser?.userType === "business",
    isServiceProvider: convexUser?.userType === "provider",
    isAdmin: convexUser?.userType === "admin",
  };
}

/**
 * Hook to require authentication
 * Redirects to auth screen if not signed in
 */
export function useRequireConvexAuth() {
  const { isLoaded, isSignedIn, user, isUserLoading } = useConvexUser();

  return {
    isAuthenticated: isSignedIn && !!user,
    isLoading: !isLoaded || isUserLoading,
    user,
  };
}

export type ConvexUser = Doc<"users">;
