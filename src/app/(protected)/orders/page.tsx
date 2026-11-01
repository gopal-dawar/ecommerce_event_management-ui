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

interface OrderRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  itemCount: number;
  paymentStatus: "completed" | "pending" | "cancelled";
  orderDate: string;
}

const mockOrders: OrderRecord[] = [
  { id: 1, orderNumber: "ORD-2026-001", customerName: "Rahul Sharma", totalAmount: 2499, itemCount: 2, paymentStatus: "completed", orderDate: "2026-11-01 14:30" },
  { id: 2, orderNumber: "ORD-2026-002", customerName: "Priya Patel", totalAmount: 899, itemCount: 1, paymentStatus: "completed", orderDate: "2026-11-01 15:10" },
  { id: 3, orderNumber: "ORD-2026-003", customerName: "Karan Mehta", totalAmount: 499, itemCount: 1, paymentStatus: "pending", orderDate: "2026-11-01 16:45" },
];

export default function OrdersPage() {
  const { pageNumber, pageSize, onPageChange, onPageSizeChange } = usePagination();
  const [searchTerm, setSearchTerm] = React.useState("");

  const columns = React.useMemo<ColumnDef<OrderRecord, unknown>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order #",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "itemCount",
        header: "Items",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue() as number} items
          </span>
        ),
      },
      {
        accessorKey: "totalAmount",
        header: "Total",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            ₹{(info.getValue() as number).toLocaleString("en-IN")}
          </span>
        ),
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment Status",
        cell: (info) => (
          <DynamicStatusBadge status={info.getValue() as string} size="sm" />
        ),
      },
      {
        accessorKey: "orderDate",
        header: "Date",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue() as string}
          </span>
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
        title="Student & Faculty Store Orders"
        description="Track customer purchases, fulfillment status, and transaction receipts."
        breadcrumbs={[
          { label: "E-Commerce", href: "/dashboard" },
          { label: "Orders", isCurrent: true },
        ]}
        actions={
          <ActionButton
            variant="outline"
            size="sm"
            icon="download"
            label="Export Orders"
          />
        }
      />

      <div className="flex items-center justify-between">
        <DynamicSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by order # or student name..."
        />
      </div>

      <DynamicTable
        columns={columns}
        data={mockOrders}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRecords={mockOrders.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
