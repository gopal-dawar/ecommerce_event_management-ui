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
  DynamicSelect,
} from "@/components/common";
import { usePagination } from "@/hooks/usePagination";
import { usePermission } from "@/hooks/usePermission";
import { ApiService } from "@/service/api.Service";
import { API_ENDPOINTS } from "@/lib/constants/endpoints";
import { CommonFilterParams } from "@/types/api";

interface PermissionRecord {
  id: number;
  userId: number;
  username: string;
  menuId: number;
  menuName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isActive: boolean;
}

const fallbackPermissions: PermissionRecord[] = [
  { id: 1, userId: 1, username: "admin", menuId: 1, menuName: "Dashboard", canView: true, canAdd: true, canEdit: true, canDelete: true, isActive: true },
  { id: 2, userId: 1, username: "admin", menuId: 2, menuName: "Users", canView: true, canAdd: true, canEdit: true, canDelete: true, isActive: true },
  { id: 3, userId: 2, username: "coordinator", menuId: 7, menuName: "Events", canView: true, canAdd: true, canEdit: true, canDelete: false, isActive: true },
  { id: 4, userId: 3, username: "faculty_head", menuId: 6, menuName: "Products", canView: true, canAdd: false, canEdit: false, canDelete: false, isActive: true },
];

export default function PermissionsMasterPage() {
  const { hasPermission } = usePermission();
  const { pageNumber, pageSize, onPageChange, onPageSizeChange } = usePagination();

  const [permissions, setPermissions] = React.useState<PermissionRecord[]>(fallbackPermissions);
  const [totalRecords, setTotalRecords] = React.useState<number>(fallbackPermissions.length);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPerm, setEditingPerm] = React.useState<PermissionRecord | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = React.useState<number | null>(null);

  const [formData, setFormData] = React.useState({
    userId: "1",
    menuId: "1",
    canView: true,
    canAdd: false,
    canEdit: false,
    canDelete: false,
    isActive: true,
  });

  const fetchPermissions = React.useCallback(async () => {
    try {
      setLoading(true);
      const filter: CommonFilterParams = {
        pageNumber,
        pageSize,
        searchTerm: searchTerm.trim() || undefined,
      };

      const res = await ApiService.fetchPaged<PermissionRecord>(
        API_ENDPOINTS.PERMISSIONS.BASE,
        filter
      );

      if (res.success && res.data) {
        setPermissions(res.data.items || []);
        setTotalRecords(res.data.totalRecords || 0);
      }
    } catch {
      // Dev mode fallbacks
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm]);

  React.useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleOpenAdd = () => {
    setEditingPerm(null);
    setFormData({
      userId: "1",
      menuId: "1",
      canView: true,
      canAdd: false,
      canEdit: false,
      canDelete: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (perm: PermissionRecord) => {
    setEditingPerm(perm);
    setFormData({
      userId: String(perm.userId),
      menuId: String(perm.menuId),
      canView: perm.canView,
      canAdd: perm.canAdd,
      canEdit: perm.canEdit,
      canDelete: perm.canDelete,
      isActive: perm.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingPerm) {
        await ApiService.put(API_ENDPOINTS.PERMISSIONS.BY_ID(editingPerm.id), formData);
        toast.success("Permission updated successfully");
      } else {
        await ApiService.post(API_ENDPOINTS.PERMISSIONS.BASE, formData);
        toast.success("Permission assigned successfully");
      }
      setIsModalOpen(false);
      fetchPermissions();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save permission");
    }
  };

  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await ApiService.delete(API_ENDPOINTS.PERMISSIONS.BY_ID(selectedDeleteId));
      toast.success("Permission revoked successfully");
      setIsConfirmDeleteOpen(false);
      fetchPermissions();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete permission");
    }
  };

  const columns = React.useMemo<ColumnDef<PermissionRecord, unknown>[]>(
    () => [
      {
        accessorKey: "username",
        header: "User Account",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "menuName",
        header: "Menu Module",
        cell: (info) => (
          <span className="font-medium text-primary">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "canView",
        header: "VIEW",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold">
            {info.getValue() ? "✓" : "—"}
          </span>
        ),
      },
      {
        accessorKey: "canAdd",
        header: "ADD",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-emerald-600">
            {info.getValue() ? "✓" : "—"}
          </span>
        ),
      },
      {
        accessorKey: "canEdit",
        header: "EDIT",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-amber-600">
            {info.getValue() ? "✓" : "—"}
          </span>
        ),
      },
      {
        accessorKey: "canDelete",
        header: "DELETE",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-destructive">
            {info.getValue() ? "✓" : "—"}
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
            {hasPermission("PERMISSION_MASTER", "EDIT") && (
              <EditButton onClick={() => handleOpenEdit(row.original)} />
            )}
            {hasPermission("PERMISSION_MASTER", "DELETE") && (
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
        title="User Menu Permissions"
        description="Fine-grained granular access control mapping users to modules with View, Add, Edit, and Delete privileges."
        breadcrumbs={[
          { label: "Masters", href: "/dashboard" },
          { label: "Permissions", isCurrent: true },
        ]}
        actions={
          hasPermission("PERMISSION_MASTER", "ADD") && (
            <ActionButton
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              label="Assign Permission"
              onClick={handleOpenAdd}
            />
          )
        }
      />

      <div className="flex items-center justify-between">
        <DynamicSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Filter permissions by user or menu..."
        />
      </div>

      <DynamicTable
        columns={columns}
        data={permissions}
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
        title={editingPerm ? "Edit Permission Mapping" : "Assign New Permission"}
        onConfirm={handleSave}
      >
        <div className="space-y-4">
          <DynamicSelect
            label="User"
            options={[
              { label: "admin (Super Admin)", value: "1" },
              { label: "coordinator (Event Coordinator)", value: "2" },
              { label: "faculty_head (Staff)", value: "3" },
            ]}
            value={formData.userId}
            onChange={(val) => setFormData({ ...formData, userId: String(val) })}
            disabled={Boolean(editingPerm)}
            required
          />

          <DynamicSelect
            label="Menu"
            options={[
              { label: "Dashboard", value: "1" },
              { label: "User Master", value: "2" },
              { label: "Role Master", value: "3" },
              { label: "Menu Master", value: "4" },
              { label: "Permissions", value: "5" },
              { label: "Products Catalog", value: "6" },
              { label: "Events Management", value: "7" },
            ]}
            value={formData.menuId}
            onChange={(val) => setFormData({ ...formData, menuId: String(val) })}
            disabled={Boolean(editingPerm)}
            required
          />

          <div className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Permission Actions
            </span>
            <div className="grid grid-cols-2 gap-2 text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canView}
                  onChange={(e) =>
                    setFormData({ ...formData, canView: e.target.checked })
                  }
                  className="rounded border-input text-primary"
                />
                <span>Can VIEW</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canAdd}
                  onChange={(e) =>
                    setFormData({ ...formData, canAdd: e.target.checked })
                  }
                  className="rounded border-input text-primary"
                />
                <span>Can ADD</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canEdit}
                  onChange={(e) =>
                    setFormData({ ...formData, canEdit: e.target.checked })
                  }
                  className="rounded border-input text-primary"
                />
                <span>Can EDIT</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canDelete}
                  onChange={(e) =>
                    setFormData({ ...formData, canDelete: e.target.checked })
                  }
                  className="rounded border-input text-primary"
                />
                <span>Can DELETE</span>
              </label>
            </div>
          </div>
        </div>
      </DynamicModal>

      <DynamicConfirmation
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Revoke Permission"
        message="Are you sure you want to revoke this permission? The user will lose access immediately."
      />
    </div>
  );
}
