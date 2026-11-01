"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Menu as MenuIcon,
  Layers,
  Lock,
  Package,
  FolderTree,
  ShoppingCart,
  Calendar,
  Ticket,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useSidebarStore } from "@/store/sidebarStore";
import { useAuthStore } from "@/store/authStore";
import { MenuItem } from "@/types/rbac";

// Icon mapping for backend navigation items
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  users: Users,
  roles: Shield,
  menus: MenuIcon,
  modules: Layers,
  permissions: Lock,
  products: Package,
  categories: FolderTree,
  orders: ShoppingCart,
  events: Calendar,
  bookings: Ticket,
};

// Default fallback navigation items if backend menus are not yet loaded
const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    menuCode: "DASHBOARD",
    menuName: "Dashboard",
    routeUrl: "/dashboard",
    icon: "dashboard",
    isParent: false,
    displayOrder: 1,
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  },
  {
    id: 2,
    menuCode: "USER_MASTER",
    menuName: "Users",
    routeUrl: "/users",
    icon: "users",
    isParent: false,
    displayOrder: 2,
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  },
  {
    id: 3,
    menuCode: "ROLE_MASTER",
    menuName: "Roles",
    routeUrl: "/roles",
    icon: "roles",
    isParent: false,
    displayOrder: 3,
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  },
  {
    id: 4,
    menuCode: "MENU_MASTER",
    menuName: "Menus",
    routeUrl: "/menus",
    icon: "menus",
    isParent: false,
    displayOrder: 4,
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  },
  {
    id: 5,
    menuCode: "PERMISSION_MASTER",
    menuName: "Permissions",
    routeUrl: "/permissions",
    icon: "permissions",
    isParent: false,
    displayOrder: 5,
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  },
  {
    id: 6,
    menuCode: "PRODUCTS",
    menuName: "Products",
    routeUrl: "/products",
    icon: "products",
    isParent: false,
    displayOrder: 6,
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  },
  {
    id: 7,
    menuCode: "EVENTS",
    menuName: "Events",
    routeUrl: "/events",
    icon: "events",
    isParent: false,
    displayOrder: 7,
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  },
];

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse, isMobileOpen, setMobileOpen } = useSidebarStore();
  const { menus, logout, user } = useAuthStore();
  const [openSubmenus, setOpenSubmenus] = React.useState<Record<number, boolean>>({});

  const navItems = menus && menus.length > 0 ? menus : DEFAULT_MENU_ITEMS;

  const toggleSubmenu = (id: number) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Layers className="h-4 w-4 shrink-0" />;
    const key = iconName.toLowerCase();
    const IconComponent = ICON_MAP[key] || Layers;
    return <IconComponent className="h-4 w-4 shrink-0" />;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-border bg-card text-card-foreground transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-tight text-foreground truncate">
                  E-Commerce & Event
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Management System
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems
            .filter((item) => item.canView !== false)
            .map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isActive =
                pathname === item.routeUrl ||
                (item.routeUrl !== "/dashboard" &&
                  pathname.startsWith(item.routeUrl));

              if (hasChildren) {
                const isSubmenuOpen = Boolean(openSubmenus[item.id]);

                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors select-none",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {renderIcon(item.icon)}
                        {!isCollapsed && <span>{item.menuName}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            isSubmenuOpen && "rotate-180"
                          )}
                        />
                      )}
                    </button>

                    {/* Submenu Items */}
                    {!isCollapsed && isSubmenuOpen && (
                      <div className="ml-4 pl-3 border-l border-border space-y-1">
                        {item.children?.map((sub) => {
                          const isSubActive = pathname === sub.routeUrl;
                          return (
                            <Link
                              key={sub.id}
                              href={sub.routeUrl}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                                isSubActive
                                  ? "bg-primary text-primary-foreground font-medium"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              {renderIcon(sub.icon)}
                              <span>{sub.menuName}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.routeUrl}
                  onClick={() => setMobileOpen(false)}
                  title={isCollapsed ? item.menuName : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors select-none",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {renderIcon(item.icon)}
                  {!isCollapsed && <span className="truncate">{item.menuName}</span>}
                </Link>
              );
            })}
        </nav>

        {/* Sidebar Footer: User details, Collapse toggle, Logout */}
        <div className="p-3 border-t border-border flex flex-col gap-2">
          {/* User profile preview */}
          {!isCollapsed && user && (
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/40">
              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {user.fullName?.charAt(0) || user.username?.charAt(0) || "U"}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user.fullName || user.username}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user.roleName || user.roleCode || "User"}
                </span>
              </div>
            </div>
          )}

          {/* Controls: Collapse & Logout */}
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={logout}
              className={cn(
                "flex items-center gap-2 h-8 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors",
                isCollapsed ? "w-8 justify-center p-0" : "flex-1 px-2.5"
              )}
              title="Logout"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
