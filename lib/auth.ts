// Auth utilities using Clerk
// This file provides helper functions that can be used outside of React components
// For React components, use the @clerk/clerk-expo hooks directly

import { UserType, Profile } from "@/types";

export interface AuthUser {
  id: string;
  email: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
}

// ============ NOTE ON USAGE ============
// Most auth operations should use Clerk hooks directly in components:
//
// import { useSignIn, useSignUp, useAuth, useUser } from "@clerk/clerk-expo";
//
// const { signIn, setActive } = useSignIn();
// const { signUp } = useSignUp();
// const { signOut, isSignedIn } = useAuth();
// const { user } = useUser();

// ============ EMAIL AUTH ============

/**
 * Sign in with email and password
 * NOTE: Use this within a component that has access to Clerk's useSignIn hook
 *
 * Example usage in component:
 * ```
 * const { signIn, setActive } = useSignIn();
 *
 * const handleSignIn = async () => {
 *   const result = await signIn.create({
 *     identifier: email,
 *     password: password,
 *   });
 *   if (result.status === "complete") {
 *     await setActive({ session: result.createdSessionId });
 *   }
 * };
 * ```
 */
export async function signInWithEmail(email: string, password: string) {
  console.log("Use Clerk's useSignIn hook in your component");
  return { user: null, error: "Use Clerk hooks directly in components" };
}

/**
 * Sign up with email and password
 * NOTE: Use this within a component that has access to Clerk's useSignUp hook
 *
 * Example usage in component:
 * ```
 * const { signUp, setActive } = useSignUp();
 *
 * const handleSignUp = async () => {
 *   const result = await signUp.create({
 *     emailAddress: email,
 *     password: password,
 *     firstName: fullName?.split(' ')[0],
 *     lastName: fullName?.split(' ').slice(1).join(' '),
 *   });
 *   // Handle email verification if required
 *   if (result.status === "complete") {
 *     await setActive({ session: result.createdSessionId });
 *   }
 * };
 * ```
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string,
  userType: UserType = "user"
) {
  console.log("Use Clerk's useSignUp hook in your component");
  return { user: null, error: "Use Clerk hooks directly in components" };
}

// ============ OAUTH ============

/**
 * Sign in with Google OAuth
 * NOTE: Use Clerk's OAuth helpers in your component
 *
 * Example usage:
 * ```
 * import { useOAuth } from "@clerk/clerk-expo";
 * import * as WebBrowser from "expo-web-browser";
 *
 * const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
 *
 * const handleGoogleSignIn = async () => {
 *   const { createdSessionId, setActive } = await startOAuthFlow();
 *   if (createdSessionId) {
 *     await setActive({ session: createdSessionId });
 *   }
 * };
 * ```
 */
export async function signInWithGoogle() {
  console.log("Use Clerk's useOAuth hook in your component");
  return { user: null, error: "Use Clerk hooks directly in components" };
}

/**
 * Sign in with Apple OAuth
 * NOTE: Use Clerk's OAuth helpers in your component
 *
 * Example usage:
 * ```
 * import { useOAuth } from "@clerk/clerk-expo";
 *
 * const { startOAuthFlow } = useOAuth({ strategy: "oauth_apple" });
 *
 * const handleAppleSignIn = async () => {
 *   const { createdSessionId, setActive } = await startOAuthFlow();
 *   if (createdSessionId) {
 *     await setActive({ session: createdSessionId });
 *   }
 * };
 * ```
 */
export async function signInWithApple() {
  console.log("Use Clerk's useOAuth hook in your component");
  return { user: null, error: "Use Clerk hooks directly in components" };
}

// ============ SIGN OUT ============

/**
 * Sign out the current user
 * NOTE: Use Clerk's useAuth hook in your component
 *
 * Example usage:
 * ```
 * const { signOut } = useAuth();
 * await signOut();
 * ```
 */
export async function signOut() {
  console.log("Use Clerk's useAuth hook in your component");
  return { error: null };
}

// ============ PASSWORD RESET ============

/**
 * Request password reset email
 * NOTE: Use Clerk's useSignIn hook in your component
 *
 * Example usage:
 * ```
 * const { signIn } = useSignIn();
 *
 * const handlePasswordReset = async () => {
 *   await signIn.create({
 *     strategy: "reset_password_email_code",
 *     identifier: email,
 *   });
 * };
 * ```
 */
export async function resetPassword(email: string) {
  console.log("Use Clerk's useSignIn hook in your component");
  return { error: "Use Clerk hooks directly in components" };
}

// ============ SESSION ============

/**
 * Get current session
 * NOTE: Use Clerk's useAuth hook for session state
 *
 * Example usage:
 * ```
 * const { sessionId, isSignedIn } = useAuth();
 * ```
 */
export async function getSession() {
  return null;
}

/**
 * Get current user
 * NOTE: Use Clerk's useUser hook for user data
 *
 * Example usage:
 * ```
 * const { user, isLoaded, isSignedIn } = useUser();
 * ```
 */
export async function getUser() {
  return null;
}

// ============ AUTH STATE LISTENER ============

/**
 * Listen for auth state changes
 * NOTE: Clerk handles this automatically. Use useAuth hook for reactive state.
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return {
    data: {
      subscription: {
        unsubscribe: () => {},
      },
    },
  };
}

// ============ PROFILE FUNCTIONS ============

/**
 * Get user profile from Convex
 * NOTE: Use useConvexUser hook instead
 *
 * Example usage:
 * ```
 * import { useConvexUser } from "@/hooks/useConvexUser";
 * const { user } = useConvexUser();
 * ```
 */
export async function getProfile(userId: string): Promise<{ profile: Profile | null; error: string | null }> {
  console.log("Use useConvexUser hook in your component");
  return { profile: null, error: "Use useConvexUser hook" };
}

/**
 * Update user profile in Convex
 * NOTE: Use Convex mutation
 *
 * Example usage:
 * ```
 * import { useMutation } from "convex/react";
 * import { api } from "@/convex/_generated/api";
 *
 * const updateProfile = useMutation(api.users.updateProfile);
 * await updateProfile({ fullName: "New Name" });
 * ```
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ profile: Profile | null; error: string | null }> {
  console.log("Use Convex useMutation hook in your component");
  return { profile: null, error: "Use Convex mutations" };
}

/**
 * Upgrade user to business or provider type
 * NOTE: Use Convex mutation
 *
 * Example usage:
 * ```
 * const upgradeUserType = useMutation(api.users.upgradeUserType);
 * await upgradeUserType({ userType: "business" });
 * ```
 */
export async function upgradeUserType(
  userId: string,
  newType: "business" | "provider"
): Promise<{ success: boolean; error: string | null }> {
  console.log("Use Convex useMutation hook in your component");
  return { success: false, error: "Use Convex mutations" };
}

// ============ ACCOUNT DELETION ============

/**
 * Delete user account
 * NOTE: Use Clerk's user.delete() method
 *
 * Example usage:
 * ```
 * const { user } = useUser();
 * await user?.delete();
 * ```
 */
export async function deleteAccount(
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  console.log("Use Clerk's user.delete() in your component");
  return { success: false, error: "Use Clerk SDK directly" };
}
