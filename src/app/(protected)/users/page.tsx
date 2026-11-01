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
  DynamicSelect,
} from "@/components/common";
import { usePagination } from "@/hooks/usePagination";
import { usePermission } from "@/hooks/usePermission";
import { ApiService } from "@/service/api.Service";
import { API_ENDPOINTS } from "@/lib/constants/endpoints";
import { CommonFilterParams } from "@/types/api";

interface UserRecord {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  phoneNumber?: string;
  isActive: boolean;
  createdDate?: string;
}

const fallbackUsers: UserRecord[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@college.edu",
    firstName: "System",
    lastName: "Admin",
    roleName: "Super Admin",
    phoneNumber: "+91 9876543210",
    isActive: true,
  },
  {
    id: 2,
    username: "coordinator",
    email: "events@college.edu",
    firstName: "Priya",
    lastName: "Sharma",
    roleName: "Event Coordinator",
    phoneNumber: "+91 9876543211",
    isActive: true,
  },
  {
    id: 3,
    username: "faculty_head",
    email: "faculty@college.edu",
    firstName: "Amit",
    lastName: "Verma",
    roleName: "Staff",
    phoneNumber: "+91 9876543212",
    isActive: false,
  },
];

export default function UsersMasterPage() {
  const { hasPermission } = usePermission();
  const { pageNumber, pageSize, onPageChange, onPageSizeChange } = usePagination();

  const [users, setUsers] = React.useState<UserRecord[]>(fallbackUsers);
  const [totalRecords, setTotalRecords] = React.useState<number>(fallbackUsers.length);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Modal & Confirmation Dialog States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserRecord | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = React.useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    roleId: "1",
    phoneNumber: "",
    isActive: true,
  });

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const filter: CommonFilterParams = {
        pageNumber,
        pageSize,
        searchTerm: searchTerm.trim() || undefined,
      };

      const res = await ApiService.fetchPaged<UserRecord>(
        API_ENDPOINTS.USERS.BASE,
        filter
      );

      if (res.success && res.data) {
        setUsers(res.data.items || []);
        setTotalRecords(res.data.totalRecords || 0);
      }
    } catch {
      // In development or if server isn't running yet, fallback data remains available
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      roleId: "1",
      phoneNumber: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserRecord) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: "1",
      phoneNumber: user.phoneNumber || "",
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await ApiService.put(API_ENDPOINTS.USERS.BY_ID(editingUser.id), formData);
        toast.success("User updated successfully");
      } else {
        await ApiService.post(API_ENDPOINTS.USERS.BASE, formData);
        toast.success("User created successfully");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save user");
    }
  };

  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      setDeleteLoading(true);
      await ApiService.delete(API_ENDPOINTS.USERS.BY_ID(selectedDeleteId));
      toast.success("User deactivated successfully (soft delete)");
      setIsConfirmDeleteOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = React.useMemo<ColumnDef<UserRecord, unknown>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email Address",
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue() as string}</span>
        ),
      },
      {
        header: "Full Name",
        cell: ({ row }) => (
          <span>
            {row.original.firstName} {row.original.lastName}
          </span>
        ),
      },
      {
        accessorKey: "roleName",
        header: "Assigned Role",
        cell: (info) => (
          <span className="font-medium text-primary">
            {info.getValue() as string}
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
            {hasPermission("USER_MASTER", "EDIT") && (
              <EditButton onClick={() => handleOpenEdit(row.original)} />
            )}
            {hasPermission("USER_MASTER", "DELETE") && (
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
        title="User Master Management"
        description="Configure application users, system credentials, and assign core security roles."
        breadcrumbs={[
          { label: "Masters", href: "/dashboard" },
          { label: "Users", isCurrent: true },
        ]}
        actions={
          hasPermission("USER_MASTER", "ADD") && (
            <ActionButton
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              label="Add New User"
              onClick={handleOpenAdd}
            />
          )
        }
      />

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <DynamicSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search users by name, username or email..."
        />
      </div>

      {/* User Records Table */}
      <DynamicTable
        columns={columns}
        data={users}
        loading={loading}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      {/* Add / Edit User Modal */}
      <DynamicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User Record" : "Create New User"}
        description="Provide account details and assign an authorization role."
        onConfirm={handleSave}
        confirmText={editingUser ? "Save Changes" : "Create User"}
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <DynamicInput
              label="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              required
            />
            <DynamicInput
              label="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              required
            />
          </div>

          <DynamicInput
            label="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />

          <DynamicInput
            label="Email Address"
            kind="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <DynamicSelect
            label="Role Assignment"
            options={[
              { label: "Super Admin", value: "1" },
              { label: "Event Coordinator", value: "2" },
              { label: "Staff", value: "3" },
              { label: "Student", value: "4" },
            ]}
            value={formData.roleId}
            onChange={(val) =>
              setFormData({ ...formData, roleId: String(val) })
            }
            required
          />
        </div>
      </DynamicModal>

      {/* Delete Confirmation Dialog */}
      <DynamicConfirmation
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Deactivate User Account"
        message="Are you sure you want to deactivate this user? The account will be marked inactive (soft deleted) and can be restored later."
      />
    </div>
  );
}
