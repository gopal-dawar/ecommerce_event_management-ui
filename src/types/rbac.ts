/**
 * RBAC Permission Action Type
 */
export type PermissionAction = "VIEW" | "ADD" | "EDIT" | "DELETE";

/**
 * Menu hierarchy response matching Spring Boot NavigationService & MenuTreeResponseDTO
 */
export interface MenuItem {
  id: number;
  menuCode: string;
  menuName: string;
  routeUrl: string;
  icon?: string;
  isParent: boolean;
  parentId?: number | null;
  displayOrder: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  children?: MenuItem[];
}

/**
 * Normalized user permissions map: [menuCode]: { VIEW: boolean, ADD: boolean, EDIT: boolean, DELETE: boolean }
 */
export type UserPermissionsMap = Record<
  string,
  {
    VIEW: boolean;
    ADD: boolean;
    EDIT: boolean;
    DELETE: boolean;
  }
>;
