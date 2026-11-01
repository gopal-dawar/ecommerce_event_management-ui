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

interface ProductRecord {
  id: number;
  productCode: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

const mockProducts: ProductRecord[] = [
  { id: 1, productCode: "PRD-001", name: "College Blazer & Crest", category: "Apparel", price: 1499, stockQuantity: 45, isActive: true },
  { id: 2, productCode: "PRD-002", name: "Engineering Lab Manual", category: "Books", price: 299, stockQuantity: 120, isActive: true },
  { id: 3, productCode: "PRD-003", name: "Tech Fest 2026 Hoodie", category: "Apparel", price: 899, stockQuantity: 15, isActive: true },
  { id: 4, productCode: "PRD-004", name: "Robotics Sensor Kit v2", category: "Electronics", price: 2499, stockQuantity: 0, isActive: false },
];

export default function ProductsPage() {
  const { hasPermission } = usePermission();
  const { pageNumber, pageSize, onPageChange, onPageSizeChange } = usePagination();
  const [searchTerm, setSearchTerm] = React.useState("");

  const columns = React.useMemo<ColumnDef<ProductRecord, unknown>[]>(
    () => [
      {
        accessorKey: "productCode",
        header: "Code",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Product Title",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price (INR)",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            ₹{(info.getValue() as number).toLocaleString("en-IN")}
          </span>
        ),
      },
      {
        accessorKey: "stockQuantity",
        header: "Stock",
        cell: (info) => {
          const qty = info.getValue() as number;
          return (
            <span
              className={
                qty === 0
                  ? "text-destructive font-semibold"
                  : "text-foreground"
              }
            >
              {qty === 0 ? "Out of Stock" : `${qty} units`}
            </span>
          );
        },
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
        cell: () => (
          <div className="flex items-center gap-1">
            <ViewButton />
            {hasPermission("PRODUCTS", "EDIT") && <EditButton />}
            {hasPermission("PRODUCTS", "DELETE") && <DeleteButton />}
          </div>
        ),
      },
    ],
    [hasPermission]
  );

  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="E-Commerce Product Catalog"
        description="Manage college merchandise, laboratory consumables, event tickets, and study materials."
        breadcrumbs={[
          { label: "E-Commerce", href: "/dashboard" },
          { label: "Products", isCurrent: true },
        ]}
        actions={
          hasPermission("PRODUCTS", "ADD") && (
            <ActionButton
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              label="Add Product"
            />
          )
        }
      />

      <div className="flex items-center justify-between">
        <DynamicSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search products by title or code..."
        />
      </div>

      <DynamicTable
        columns={columns}
        data={mockProducts}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRecords={mockProducts.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
