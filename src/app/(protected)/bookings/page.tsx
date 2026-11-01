"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DynamicPageHeader,
  DynamicTable,
  DynamicSearch,
  DynamicStatusBadge,
  ViewButton,
  ActionButton,
} from "@/components/common";
import { usePagination } from "@/hooks/usePagination";

interface BookingRecord {
  id: number;
  bookingRef: string;
  eventName: string;
  attendeeName: string;
  ticketCount: number;
  bookingDate: string;
  status: "approved" | "pending" | "cancelled";
}

const mockBookings: BookingRecord[] = [
  { id: 1, bookingRef: "BKG-9901", eventName: "National College Hackathon 2026", attendeeName: "Siddharth Verma", ticketCount: 1, bookingDate: "2026-11-01 11:20", status: "approved" },
  { id: 2, bookingRef: "BKG-9902", eventName: "Generative AI Workshop Series", attendeeName: "Ananya Roy", ticketCount: 1, bookingDate: "2026-11-01 12:45", status: "approved" },
  { id: 3, bookingRef: "BKG-9903", eventName: "Inter-College Cultural Fest (Sanskriti)", attendeeName: "Rohan Kapoor", ticketCount: 3, bookingDate: "2026-11-01 13:10", status: "pending" },
];

export default function BookingsPage() {
  const { pageNumber, pageSize, onPageChange, onPageSizeChange } = usePagination();
  const [searchTerm, setSearchTerm] = React.useState("");

  const columns = React.useMemo<ColumnDef<BookingRecord, unknown>[]>(
    () => [
      {
        accessorKey: "bookingRef",
        header: "Ref #",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "eventName",
        header: "Event",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "attendeeName",
        header: "Student / Attendee",
        cell: (info) => (
          <span className="text-foreground">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "ticketCount",
        header: "Passes",
        cell: (info) => (
          <span className="text-xs font-semibold text-foreground">
            {info.getValue() as number}
          </span>
        ),
      },
      {
        accessorKey: "bookingDate",
        header: "Booked On",
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
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center gap-1">
            <ViewButton />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Event Booking & Registrations"
        description="Verify attendee credentials, check-in passes, and booking transactions."
        breadcrumbs={[
          { label: "Events", href: "/dashboard" },
          { label: "Bookings", isCurrent: true },
        ]}
        actions={
          <ActionButton
            variant="outline"
            size="sm"
            icon="download"
            label="Download Attendee List"
          />
        }
      />

      <div className="flex items-center justify-between">
        <DynamicSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by student name or booking ref..."
        />
      </div>

      <DynamicTable
        columns={columns}
        data={mockBookings}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRecords={mockBookings.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
