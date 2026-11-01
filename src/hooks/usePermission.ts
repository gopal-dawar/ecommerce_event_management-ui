import { useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { PermissionAction } from "@/types/rbac";
import { checkPermission } from "@/utils/rbac";

/**
 * Reusable Hook for Component & Action RBAC Authorization
 * Usage:
 * const { hasPermission } = usePermission();
 * if (hasPermission("USER", "ADD")) { ... }
 */
export function usePermission() {
  const permissions = useAuthStore((state) => state.permissions);

  const hasPermission = useCallback(
    (menuCode: string, action: PermissionAction): boolean => {
      return checkPermission(permissions, menuCode, action);
    },
    [permissions]
  );

  return {
    permissions,
    hasPermission,
  };
}
