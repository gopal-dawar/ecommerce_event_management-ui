import { MenuItem } from "./rbac";

/**
 * Logged-in user representation
 */
export interface UserProfile {
  id: number;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roleId: number;
  roleCode: string;
  roleName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isActive: boolean;
}

/**
 * Authentication response from Spring Boot /api/v1/auth/login
 */
export interface AuthResponse {
  token: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
  user: UserProfile;
  menus?: MenuItem[];
}

/**
 * Login payload
 */
export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}
