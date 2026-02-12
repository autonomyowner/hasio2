"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ConvexReactClient, useMutation, useConvexAuth } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { api } from "@convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

function UserSyncer({ children }: { children: ReactNode }) {
  const { data: session } = authClient.useSession();
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } =
    useConvexAuth();
  const syncUser = useMutation(api.users.syncUser);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (
      session &&
      isConvexAuthenticated &&
      !isConvexLoading &&
      !hasSynced.current
    ) {
      hasSynced.current = true;
      syncUser({}).catch(() => {
        hasSynced.current = false;
      });
    }
    if (!session) {
      hasSynced.current = false;
    }
  }, [session, isConvexAuthenticated, isConvexLoading, syncUser]);

  return <>{children}</>;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <UserSyncer>{children}</UserSyncer>
    </ConvexBetterAuthProvider>
  );
}
