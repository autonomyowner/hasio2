"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { authClient } from "@/lib/auth-client";

export function useCurrentUser() {
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = !!session;

  const convexUser = useQuery(
    api.users.getCurrentUser,
    !isPending && isSignedIn ? {} : "skip"
  );

  return {
    isLoaded: !isPending,
    isSignedIn,
    user: convexUser ?? null,
    isUserLoading: !isPending && isSignedIn && convexUser === undefined,
    userId: convexUser?._id ?? null,
    userType: convexUser?.userType ?? "user",
    isBusinessOwner: convexUser?.userType === "business",
    isServiceProvider: convexUser?.userType === "provider",
    isAdmin: convexUser?.userType === "admin",
  };
}
