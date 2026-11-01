/**
 * Centralized Backend API Endpoints (Prefix /api/v1 is set in Axios base URL)
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  NAVIGATION: {
    USER_MENU: (userId: number | string) => `/navigation/user/${userId}`,
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: number | string) => `/users/${id}`,
    HARD_DELETE: (id: number | string) => `/users/${id}/hard`,
    CHANGE_PASSWORD: (id: number | string) => `/users/${id}/change-password`,
  },
  ROLES: {
    BASE: "/roles",
    BY_ID: (id: number | string) => `/roles/${id}`,
    HARD_DELETE: (id: number | string) => `/roles/${id}/hard`,
  },
  MODULES: {
    BASE: "/modules",
    BY_ID: (id: number | string) => `/modules/${id}`,
    HARD_DELETE: (id: number | string) => `/modules/${id}/hard`,
  },
  MENUS: {
    BASE: "/menus",
    BY_ID: (id: number | string) => `/menus/${id}`,
    HARD_DELETE: (id: number | string) => `/menus/${id}/hard`,
  },
  PERMISSIONS: {
    BASE: "/permissions",
    BY_ID: (id: number | string) => `/permissions/${id}`,
    HARD_DELETE: (id: number | string) => `/permissions/${id}/hard`,
  },
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: number | string) => `/products/${id}`,
  },
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: number | string) => `/categories/${id}`,
  },
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id: number | string) => `/orders/${id}`,
  },
  EVENTS: {
    BASE: "/events",
    BY_ID: (id: number | string) => `/events/${id}`,
  },
  BOOKINGS: {
    BASE: "/bookings",
    BY_ID: (id: number | string) => `/bookings/${id}`,
  },
} as const;
