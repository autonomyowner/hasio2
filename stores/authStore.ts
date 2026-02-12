// Auth store - syncs with Clerk authentication
// This store maintains local auth state that mirrors Clerk's state

import { create } from "zustand";

// User type matching Convex schema
interface User {
  id: string;
  clerkId: string;
  email: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  userType: "user" | "business" | "provider";
}

interface Session {
  user: User;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  signOut: () => Promise<void>;

  // Sync with Clerk user data
  syncFromClerk: (clerkUser: {
    id: string;
    primaryEmailAddress?: { emailAddress: string } | null;
    fullName?: string | null;
    imageUrl?: string | null;
  } | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized, isLoading: false }),

  signOut: async () => {
    set({ user: null, session: null });
  },

  // Sync local state with Clerk user
  syncFromClerk: (clerkUser) => {
    if (!clerkUser) {
      set({ user: null, session: null });
      return;
    }

    const user: User = {
      id: clerkUser.id,
      clerkId: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
      fullName: clerkUser.fullName,
      avatarUrl: clerkUser.imageUrl,
      userType: "user", // Default, will be updated from Convex
    };

    set({
      user,
      session: { user },
    });
  },
}));

// Initialize auth - now handled by Clerk provider
export function initAuthListener() {
  const { setInitialized } = useAuthStore.getState();
  // Mark as initialized - Clerk handles auth state
  setInitialized(true);
}

// Hook to sync Clerk user with local store
// Use this in components that need to sync auth state
export function useSyncAuthStore() {
  const syncFromClerk = useAuthStore((state) => state.syncFromClerk);
  return { syncFromClerk };
}
