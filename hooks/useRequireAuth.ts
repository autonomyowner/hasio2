import { useAuthStore } from "@/stores/authStore";

/**
 * Lightweight hook to check if user is authenticated
 * Returns auth state without blocking - components decide how to handle
 */
export function useRequireAuth() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return {
    isAuthenticated: !!user,
    isLoading: !isInitialized,
    user,
  };
}
