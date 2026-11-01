import { MenuItem, PermissionAction, UserPermissionsMap } from "@/types/rbac";

/**
 * Recursively flattens hierarchical menu items into a lookup map of permissions
 */
export function normalizePermissions(menus: MenuItem[]): UserPermissionsMap {
  const map: UserPermissionsMap = {};

  function traverse(items: MenuItem[]) {
    for (const item of items) {
      if (item.menuCode) {
        map[item.menuCode.toUpperCase()] = {
          VIEW: Boolean(item.canView),
          ADD: Boolean(item.canAdd),
          EDIT: Boolean(item.canEdit),
          DELETE: Boolean(item.canDelete),
        };
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  }

  traverse(menus);
  return map;
}

/**
 * Checks whether the user has permission for a specific module and action
 */
export function checkPermission(
  permissions: UserPermissionsMap,
  menuCode: string,
  action: PermissionAction
): boolean {
  if (!menuCode) return false;
  const modulePerms = permissions[menuCode.toUpperCase()];
  if (!modulePerms) return false;
  return Boolean(modulePerms[action]);
}
