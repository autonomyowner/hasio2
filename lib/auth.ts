import { supabase } from "./supabase";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";

// For OAuth redirect
const redirectUrl = makeRedirectUri({
  scheme: "hasio",
  path: "auth/callback",
});

// ============ EMAIL AUTH ============

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in error:", error.message);
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error("Sign up error:", error.message);
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

// ============ OAUTH ============

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        // Extract tokens from URL
        const url = new URL(result.url);
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) throw sessionError;
          return { user: sessionData.user, error: null };
        }
      }
    }

    return { user: null, error: "OAuth cancelled" };
  } catch (error: any) {
    console.error("Google sign in error:", error.message);
    return { user: null, error: error.message };
  }
}

export async function signInWithApple() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) throw sessionError;
          return { user: sessionData.user, error: null };
        }
      }
    }

    return { user: null, error: "OAuth cancelled" };
  } catch (error: any) {
    console.error("Apple sign in error:", error.message);
    return { user: null, error: error.message };
  }
}

// ============ SIGN OUT ============

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error.message);
    return { error: error.message };
  }

  return { error: null };
}

// ============ PASSWORD RESET ============

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectUrl}?type=recovery`,
  });

  if (error) {
    console.error("Password reset error:", error.message);
    return { error: error.message };
  }

  return { error: null };
}

// ============ SESSION ============

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Get session error:", error.message);
    return null;
  }

  return session;
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Get user error:", error.message);
    return null;
  }

  return user;
}

// ============ AUTH STATE LISTENER ============

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
