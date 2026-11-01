import { create } from "zustand";
import { UserProfile } from "@/types/auth";
import { MenuItem, UserPermissionsMap } from "@/types/rbac";
import { normalizePermissions } from "@/utils/rbac";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  menus: MenuItem[];
  permissions: UserPermissionsMap;
  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (token: string, user: UserProfile, menus?: MenuItem[]) => void;
  logout: () => void;
  setMenus: (menus: MenuItem[]) => void;
  initialize: () => void;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const MENUS_KEY = "auth_menus";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  menus: [],
  permissions: {},
  isAuthenticated: false,
  isInitialized: false,

  login: (token: string, user: UserProfile, menus: MenuItem[] = []) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(MENUS_KEY, JSON.stringify(menus));
    }
    const permissions = normalizePermissions(menus);
    set({
      token,
      user,
      menus,
      permissions,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(MENUS_KEY);
    }
    set({
      token: null,
      user: null,
      menus: [],
      permissions: {},
      isAuthenticated: false,
      isInitialized: true,
    });
  },

  setMenus: (menus: MenuItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(MENUS_KEY, JSON.stringify(menus));
    }
    const permissions = normalizePermissions(menus);
    set({ menus, permissions });
  },

  initialize: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      const userStr = localStorage.getItem(USER_KEY);
      const menusStr = localStorage.getItem(MENUS_KEY);

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as UserProfile;
          const menus = menusStr ? (JSON.parse(menusStr) as MenuItem[]) : [];
          const permissions = normalizePermissions(menus);

          set({
            token,
            user,
            menus,
            permissions,
            isAuthenticated: true,
            isInitialized: true,
          });
          return;
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem(MENUS_KEY);
        }
      }
    }

    set({
      token: null,
      user: null,
      menus: [],
      permissions: {},
      isAuthenticated: false,
      isInitialized: true,
    });
  },
}));
