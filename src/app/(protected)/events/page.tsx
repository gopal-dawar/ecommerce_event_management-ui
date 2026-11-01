"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DynamicPageHeader,
  DynamicTable,
  DynamicSearch,
  DynamicStatusBadge,
  ActionButton,
  EditButton,
  DeleteButton,
  ViewButton,
} from "@/components/common";
import { usePagination } from "@/hooks/usePagination";
import { usePermission } from "@/hooks/usePermission";

interface EventRecord {
  id: number;
  eventCode: string;
  title: string;
  venue: string;
  startDate: string;
  capacity: number;
  registeredCount: number;
  status: "approved" | "pending" | "completed";
}

const mockEvents: EventRecord[] = [
  { id: 1, eventCode: "EVT-2026-HACK", title: "National College Hackathon 2026", venue: "Auditorium Hall A", startDate: "2026-12-10", capacity: 300, registeredCount: 284, status: "approved" },
  { id: 2, eventCode: "EVT-2026-AI", title: "Generative AI Workshop Series", venue: "Computer Lab 4", startDate: "2026-11-20", capacity: 80, registeredCount: 80, status: "approved" },
  { id: 3, eventCode: "EVT-2026-CULT", title: "Inter-College Cultural Fest (Sanskriti)", venue: "Open Grounds", startDate: "2026-12-24", capacity: 1500, registeredCount: 650, status: "pending" },
];

export default function EventsPage() {
  const { hasPermission } = usePermission();
  const { pageNumber, pageSize, onPageChange, onPageSizeChange } = usePagination();
  const [searchTerm, setSearchTerm] = React.useState("");

  const columns = React.useMemo<ColumnDef<EventRecord, unknown>[]>(
    () => [
      {
        accessorKey: "eventCode",
        header: "Event Code",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: "Event Title",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "venue",
        header: "Venue",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "startDate",
        header: "Date",
        cell: (info) => (
          <span className="text-xs text-foreground font-medium">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: "Attendance",
        cell: ({ row }) => (
          <span className="text-xs">
            <span className="font-semibold text-foreground">{row.original.registeredCount}</span> / {row.original.capacity}
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
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center gap-1">
            <ViewButton />
            {hasPermission("EVENTS", "EDIT") && <EditButton />}
            {hasPermission("EVENTS", "DELETE") && <DeleteButton />}
          </div>
        ),
      },
    ],
    [hasPermission]
  );

  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="College Event Management"
        description="Schedule workshops, seminars, festivals, and coordinate student registrations."
        breadcrumbs={[
          { label: "Events", href: "/dashboard" },
          { label: "Schedules", isCurrent: true },
        ]}
        actions={
          hasPermission("EVENTS", "ADD") && (
            <ActionButton
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              label="Create Event"
            />
          )
        }
      />

      <div className="flex items-center justify-between">
        <DynamicSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search events by name, code, or venue..."
        />
      </div>

      <DynamicTable
        columns={columns}
        data={mockEvents}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRecords={mockEvents.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
