import { useAuthStore } from "@/store/authStore";

/**
 * Convenience hook to access authentication state and handlers
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const menus = useAuthStore((state) => state.menus);

  return {
    user,
    token,
    menus,
    isAuthenticated,
    isInitialized,
    login,
    logout,
  };
}
