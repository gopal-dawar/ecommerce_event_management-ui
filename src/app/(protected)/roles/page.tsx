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

interface RoleRecord {
  id: number;
  roleCode: string;
  roleName: string;
  description?: string;
  isActive: boolean;
}

const fallbackRoles: RoleRecord[] = [
  {
    id: 1,
    roleCode: "SUPER_ADMIN",
    roleName: "Super Admin",
    description: "Complete unrestricted access across all masters and operations",
    isActive: true,
  },
  {
    id: 2,
    roleCode: "EVENT_COORDINATOR",
    roleName: "Event Coordinator",
    description: "Manages college festivals, workshops, bookings and attendee lists",
    isActive: true,
  },
  {
    id: 3,
    roleCode: "STAFF",
    roleName: "Staff Member",
    description: "Standard departmental operations and store product catalog entry",
    isActive: true,
  },
  {
    id: 4,
    roleCode: "STUDENT",
    roleName: "Student",
    description: "Event attendee and store purchaser privileges",
    isActive: true,
  },
];

export default function RolesMasterPage() {
  const { hasPermission } = usePermission();
  const { pageNumber, pageSize, onPageChange, onPageSizeChange } = usePagination();

  const [roles, setRoles] = React.useState<RoleRecord[]>(fallbackRoles);
  const [totalRecords, setTotalRecords] = React.useState<number>(fallbackRoles.length);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<RoleRecord | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = React.useState<number | null>(null);

  const [formData, setFormData] = React.useState({
    roleCode: "",
    roleName: "",
    description: "",
    isActive: true,
  });

  const fetchRoles = React.useCallback(async () => {
    try {
      setLoading(true);
      const filter: CommonFilterParams = {
        pageNumber,
        pageSize,
        searchTerm: searchTerm.trim() || undefined,
      };

      const res = await ApiService.fetchPaged<RoleRecord>(
        API_ENDPOINTS.ROLES.BASE,
        filter
      );

      if (res.success && res.data) {
        setRoles(res.data.items || []);
        setTotalRecords(res.data.totalRecords || 0);
      }
    } catch {
      // In dev mode, fallbacks remain displayed
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm]);

  React.useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleOpenAdd = () => {
    setEditingRole(null);
    setFormData({
      roleCode: "",
      roleName: "",
      description: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role: RoleRecord) => {
    setEditingRole(role);
    setFormData({
      roleCode: role.roleCode,
      roleName: role.roleName,
      description: role.description || "",
      isActive: role.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingRole) {
        await ApiService.put(API_ENDPOINTS.ROLES.BY_ID(editingRole.id), formData);
        toast.success("Role updated successfully");
      } else {
        await ApiService.post(API_ENDPOINTS.ROLES.BASE, formData);
        toast.success("Role created successfully");
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save role");
    }
  };

  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await ApiService.delete(API_ENDPOINTS.ROLES.BY_ID(selectedDeleteId));
      toast.success("Role deactivated successfully");
      setIsConfirmDeleteOpen(false);
      fetchRoles();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete role");
    }
  };

  const columns = React.useMemo<ColumnDef<RoleRecord, unknown>[]>(
    () => [
      {
        accessorKey: "roleCode",
        header: "Role Code",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "roleName",
        header: "Role Name",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info) => (
          <span className="text-muted-foreground text-xs">
            {(info.getValue() as string) || "—"}
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
            {hasPermission("ROLE_MASTER", "EDIT") && (
              <EditButton onClick={() => handleOpenEdit(row.original)} />
            )}
            {hasPermission("ROLE_MASTER", "DELETE") && (
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
        title="Role Master Management"
        description="Define RBAC roles and control baseline security tiers across the enterprise."
        breadcrumbs={[
          { label: "Masters", href: "/dashboard" },
          { label: "Roles", isCurrent: true },
        ]}
        actions={
          hasPermission("ROLE_MASTER", "ADD") && (
            <ActionButton
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              label="Add New Role"
              onClick={handleOpenAdd}
            />
          )
        }
      />

      <div className="flex items-center justify-between">
        <DynamicSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search roles by code or name..."
        />
      </div>

      <DynamicTable
        columns={columns}
        data={roles}
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
        title={editingRole ? "Edit Role" : "Create New Role"}
        onConfirm={handleSave}
        confirmText={editingRole ? "Save Changes" : "Create Role"}
      >
        <div className="space-y-3.5">
          <DynamicInput
            label="Role Code"
            placeholder="e.g. EVENT_COORDINATOR"
            value={formData.roleCode}
            onChange={(e) =>
              setFormData({ ...formData, roleCode: e.target.value.toUpperCase() })
            }
            required
            disabled={Boolean(editingRole)}
          />
          <DynamicInput
            label="Role Name"
            placeholder="e.g. Event Coordinator"
            value={formData.roleName}
            onChange={(e) =>
              setFormData({ ...formData, roleName: e.target.value })
            }
            required
          />
          <DynamicInput
            label="Description"
            placeholder="Describe role responsibilities"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </DynamicModal>

      <DynamicConfirmation
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Deactivate Role"
        message="Are you sure you want to deactivate this role? Users assigned to this role may lose access to assigned menus."
      />
    </div>
  );
}
