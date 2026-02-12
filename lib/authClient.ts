import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

const convexSiteUrl = process.env.EXPO_PUBLIC_CONVEX_SITE_URL;

export const authClient = createAuthClient({
  baseURL: convexSiteUrl,
  plugins: [
    expoClient({
      scheme: "hasio",
      storage: SecureStore,
    }),
    convexClient(),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
