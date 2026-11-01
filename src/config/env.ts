/**
 * Centralized, validated environment configuration
 */
export const ENV = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1",
  APP_NAME:
    process.env.NEXT_PUBLIC_APP_NAME || "College E-Commerce & Event Management",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;
