/**
 * Centralized Application Route Definitions
 */
export const APP_ROUTES = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
  },
  PROTECTED: {
    DASHBOARD: "/dashboard",
    USERS: "/users",
    ROLES: "/roles",
    MENUS: "/menus",
    PERMISSIONS: "/permissions",
    PRODUCTS: "/products",
    CATEGORIES: "/categories",
    ORDERS: "/orders",
    EVENTS: "/events",
    BOOKINGS: "/bookings",
  },
} as const;

export type AppRoute = typeof APP_ROUTES;
