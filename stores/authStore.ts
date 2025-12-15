import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

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
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isInitialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized, isLoading: false }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));

// Initialize auth listener once - call this in _layout.tsx
let authListenerInitialized = false;

export function initAuthListener() {
  if (authListenerInitialized) return;
  authListenerInitialized = true;

  const { setSession, setInitialized } = useAuthStore.getState();

  // Get initial session (non-blocking)
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setInitialized(true);
  });

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });
}
