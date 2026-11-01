"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  DynamicPageHeader,
  DynamicTable,
  DynamicSearch,
  DynamicModal,
  DynamicConfirmation,
  DynamicStatusBadge,
  ActionButton,
  EditButton,
  DeleteButton,
  ViewButton,
  DynamicInput,
} from "@/components/common";
import { usePagination } from "@/hooks/usePagination";
import { usePermission } from "@/hooks/usePermission";
import { ApiService } from "@/service/api.Service";
import { API_ENDPOINTS } from "@/lib/constants/endpoints";
import { CommonFilterParams } from "@/types/api";

interface MenuRecord {
  id: number;
  menuCode: string;
  menuName: string;
  routeUrl: string;
  icon?: string;
  isParent: boolean;
  displayOrder: number;
  isActive: boolean;
}

const fallbackMenus: MenuRecord[] = [
  { id: 1, menuCode: "DASHBOARD", menuName: "Dashboard", routeUrl: "/dashboard", icon: "dashboard", isParent: false, displayOrder: 1, isActive: true },
  { id: 2, menuCode: "USER_MASTER", menuName: "Users", routeUrl: "/users", icon: "users", isParent: false, displayOrder: 2, isActive: true },
  { id: 3, menuCode: "ROLE_MASTER", menuName: "Roles", routeUrl: "/roles", icon: "roles", isParent: false, displayOrder: 3, isActive: true },
  { id: 4, menuCode: "MENU_MASTER", menuName: "Menus", routeUrl: "/menus", icon: "menus", isParent: false, displayOrder: 4, isActive: true },
  { id: 5, menuCode: "PERMISSION_MASTER", menuName: "Permissions", routeUrl: "/permissions", icon: "permissions", isParent: false, displayOrder: 5, isActive: true },
  { id: 6, menuCode: "PRODUCTS", menuName: "Products", routeUrl: "/products", icon: "products", isParent: false, displayOrder: 6, isActive: true },
  { id: 7, menuCode: "EVENTS", menuName: "Events", routeUrl: "/events", icon: "events", isParent: false, displayOrder: 7, isActive: true },
];

export default function MenusMasterPage() {
  const { hasPermission } = usePermission();
  const { pageNumber, pageSize, onPageChange, onPageSizeChange } = usePagination();

  const [menus, setMenus] = React.useState<MenuRecord[]>(fallbackMenus);
  const [totalRecords, setTotalRecords] = React.useState<number>(fallbackMenus.length);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingMenu, setEditingMenu] = React.useState<MenuRecord | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = React.useState<number | null>(null);

  const [formData, setFormData] = React.useState({
    menuCode: "",
    menuName: "",
    routeUrl: "",
    icon: "",
    isParent: false,
    displayOrder: 1,
    isActive: true,
  });

  const fetchMenus = React.useCallback(async () => {
    try {
      setLoading(true);
      const filter: CommonFilterParams = {
        pageNumber,
        pageSize,
        searchTerm: searchTerm.trim() || undefined,
      };

      const res = await ApiService.fetchPaged<MenuRecord>(
        API_ENDPOINTS.MENUS.BASE,
        filter
      );

      if (res.success && res.data) {
        setMenus(res.data.items || []);
        setTotalRecords(res.data.totalRecords || 0);
      }
    } catch {
      // Dev mode fallbacks
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm]);

  React.useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleOpenAdd = () => {
    setEditingMenu(null);
    setFormData({
      menuCode: "",
      menuName: "",
      routeUrl: "",
      icon: "",
      isParent: false,
      displayOrder: menus.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (menu: MenuRecord) => {
    setEditingMenu(menu);
    setFormData({
      menuCode: menu.menuCode,
      menuName: menu.menuName,
      routeUrl: menu.routeUrl,
      icon: menu.icon || "",
      isParent: menu.isParent,
      displayOrder: menu.displayOrder,
      isActive: menu.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingMenu) {
        await ApiService.put(API_ENDPOINTS.MENUS.BY_ID(editingMenu.id), formData);
        toast.success("Menu updated successfully");
      } else {
        await ApiService.post(API_ENDPOINTS.MENUS.BASE, formData);
        toast.success("Menu created successfully");
      }
      setIsModalOpen(false);
      fetchMenus();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save menu");
    }
  };

  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await ApiService.delete(API_ENDPOINTS.MENUS.BY_ID(selectedDeleteId));
      toast.success("Menu deactivated successfully");
      setIsConfirmDeleteOpen(false);
      fetchMenus();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete menu");
    }
  };

  const columns = React.useMemo<ColumnDef<MenuRecord, unknown>[]>(
    () => [
      {
        accessorKey: "menuCode",
        header: "Menu Code",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "menuName",
        header: "Menu Name",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "routeUrl",
        header: "Route Path",
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "displayOrder",
        header: "Order",
        cell: (info) => (
          <span className="text-xs text-foreground font-semibold">
            {info.getValue() as number}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: (info) => (
          <DynamicStatusBadge isActive={info.getValue() as boolean} size="sm" />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <ViewButton onClick={() => handleOpenEdit(row.original)} />
            {hasPermission("MENU_MASTER", "EDIT") && (
              <EditButton onClick={() => handleOpenEdit(row.original)} />
            )}
            {hasPermission("MENU_MASTER", "DELETE") && (
              <DeleteButton
                onClick={() => {
                  setSelectedDeleteId(row.original.id);
                  setIsConfirmDeleteOpen(true);
                }}
              />
            )}
          </div>
        ),
      },
    ],
    [hasPermission]
  );

  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Menu Master Management"
        description="Configure sidebar dynamic menu trees, route paths, icons, and display ordering."
        breadcrumbs={[
          { label: "Masters", href: "/dashboard" },
          { label: "Menus", isCurrent: true },
        ]}
        actions={
          hasPermission("MENU_MASTER", "ADD") && (
            <ActionButton
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              label="Add New Menu"
              onClick={handleOpenAdd}
            />
          )
        }
      />

      <div className="flex items-center justify-between">
        <DynamicSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search menus by code, name, or route..."
        />
      </div>

      <DynamicTable
        columns={columns}
        data={menus}
        loading={loading}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      <DynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMenu ? "Edit Menu" : "Create New Menu"}
        onConfirm={handleSave}
      >
        <div className="space-y-3.5">
          <DynamicInput
            label="Menu Code"
            value={formData.menuCode}
            onChange={(e) =>
              setFormData({ ...formData, menuCode: e.target.value.toUpperCase() })
            }
            required
            disabled={Boolean(editingMenu)}
          />
          <DynamicInput
            label="Menu Name"
            value={formData.menuName}
            onChange={(e) =>
              setFormData({ ...formData, menuName: e.target.value })
            }
            required
          />
          <DynamicInput
            label="Route URL"
            value={formData.routeUrl}
            onChange={(e) =>
              setFormData({ ...formData, routeUrl: e.target.value })
            }
            required
          />
          <DynamicInput
            label="Icon Key"
            placeholder="e.g. users, shield, package, calendar"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          />
        </div>
      </DynamicModal>

      <DynamicConfirmation
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Deactivate Menu"
        message="Are you sure you want to deactivate this menu? Users will no longer see this route in their navigation sidebar."
      />
    </div>
  );
}
