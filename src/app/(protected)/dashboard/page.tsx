"use client";

import * as React from "react";
import {
  Users,
  ShieldCheck,
  Calendar,
  Package,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DynamicPageHeader } from "@/components/common/DynamicPageHeader";
import { DynamicStatCard } from "@/components/common/DynamicStatCard";
import { DynamicTable } from "@/components/common/DynamicTable";
import { DynamicCard } from "@/components/common/DynamicCard";
import { ActionButton } from "@/components/common/ActionButtons";
import { DynamicStatusBadge } from "@/components/common/DynamicStatusBadge";

interface RecentActivity {
  id: number;
  activity: string;
  module: string;
  user: string;
  timestamp: string;
  status: string;
}

const mockActivities: RecentActivity[] = [
  {
    id: 1,
    activity: "Updated role permissions for Event Coordinator",
    module: "ROLE_MASTER",
    user: "Admin",
    timestamp: "10 mins ago",
    status: "active",
  },
  {
    id: 2,
    activity: "Created new user profile: Rahul Sharma",
    module: "USER_MASTER",
    user: "Admin",
    timestamp: "35 mins ago",
    status: "active",
  },
  {
    id: 3,
    activity: "Published College Hackathon 2026 Event",
    module: "EVENTS",
    user: "Coordinator",
    timestamp: "1 hour ago",
    status: "approved",
  },
  {
    id: 4,
    activity: "Added 12 new lab accessories into inventory",
    module: "PRODUCTS",
    user: "Staff",
    timestamp: "3 hours ago",
    status: "completed",
  },
];

export default function DashboardPage() {
  const columns = React.useMemo<ColumnDef<RecentActivity, unknown>[]>(
    () => [
      {
        accessorKey: "activity",
        header: "Activity Description",
        cell: (info) => (
          <span className="font-medium text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "module",
        header: "Master Module",
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "user",
        header: "Triggered By",
        cell: (info) => (
          <span className="text-xs text-foreground font-semibold">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <DynamicStatusBadge status={info.getValue() as string} size="sm" />
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <DynamicPageHeader
        title="Administrative Dashboard"
        description="Real-time status overview of college e-commerce, events, and core RBAC master tables."
        actions={
          <>
            <ActionButton
              variant="outline"
              size="sm"
              icon={<RefreshCw className="h-4 w-4" />}
              label="Sync Data"
            />
            <ActionButton
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              label="Quick Action"
            />
          </>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DynamicStatCard
          title="Total Users"
          value="1,248"
          change={{ value: 12.5, isPositive: true, period: "from last month" }}
          variant="primary"
          icon={<Users className="h-5 w-5" />}
        />
        <DynamicStatCard
          title="RBAC Roles"
          value="5 Active"
          description="Admin, Coordinator, Staff, Student, Guest"
          variant="info"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <DynamicStatCard
          title="Scheduled Events"
          value="24"
          change={{ value: 8.2, isPositive: true, period: "this semester" }}
          variant="success"
          icon={<Calendar className="h-5 w-5" />}
        />
        <DynamicStatCard
          title="Store Items"
          value="340"
          description="E-Commerce products active"
          variant="warning"
          icon={<Package className="h-5 w-5" />}
        />
      </div>

      {/* Backend Integration Status Banner */}
      <DynamicCard
        title="Backend API Connection"
        subtitle="Spring Boot 4.1.2 REST Service on localhost:8080"
        actions={
          <a
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionButton
              variant="outline"
              size="xs"
              icon={<ExternalLink className="h-3.5 w-3.5" />}
              label="Open Swagger UI"
            />
          </a>
        }
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-foreground font-medium">
              MySQL 8.0 & HikariCP Pool Active:
            </span>
            <span className="text-muted-foreground font-mono">
              jdbc:mysql://localhost:3306/e_cem
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DynamicStatusBadge status="active" label="Spring Boot Connected" size="sm" />
            <DynamicStatusBadge status="completed" label="OpenAPI 3.0 Ready" size="sm" />
          </div>
        </div>
      </DynamicCard>

      {/* Recent Activity Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Recent System Operations
        </h2>
        <DynamicTable columns={columns} data={mockActivities} />
      </div>
    </div>
  );
}
