import { supabase } from "./supabase";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Platform } from "react-native";
import { UserType, Profile } from "@/types";

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

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string,
  userType: UserType = "user"
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: userType,
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

// ============ PROFILE FUNCTIONS ============

export async function getProfile(userId: string): Promise<{ profile: Profile | null; error: string | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Get profile error:", error.message);
    return { profile: null, error: error.message };
  }

  return { profile: data as Profile, error: null };
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ profile: Profile | null; error: string | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Update profile error:", error.message);
    return { profile: null, error: error.message };
  }

  return { profile: data as Profile, error: null };
}

export async function upgradeUserType(
  userId: string,
  newType: "business" | "provider"
): Promise<{ success: boolean; error: string | null }> {
  // First verify current type is 'user'
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", userId)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  if (profile?.user_type !== "user") {
    return { success: false, error: "Cannot upgrade: already a business or provider" };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ user_type: newType })
    .eq("id", userId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, error: null };
}
