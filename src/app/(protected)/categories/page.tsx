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
} from "@/components/common";
import { usePagination } from "@/hooks/usePagination";

interface CategoryRecord {
  id: number;
  categoryCode: string;
  name: string;
  itemCount: number;
  isActive: boolean;
}

const mockCategories: CategoryRecord[] = [
  { id: 1, categoryCode: "APPAREL", name: "Apparel & Uniforms", itemCount: 18, isActive: true },
  { id: 2, categoryCode: "BOOKS", name: "Course Books & Notes", itemCount: 52, isActive: true },
  { id: 3, categoryCode: "ELECTRONICS", name: "Lab & Electronics Hardware", itemCount: 34, isActive: true },
  { id: 4, categoryCode: "EVENT_TICKETS", name: "Festival & Workshop Passes", itemCount: 8, isActive: true },
];

export default function CategoriesPage() {
  const { pageNumber, pageSize, onPageChange, onPageSizeChange } = usePagination();
  const [searchTerm, setSearchTerm] = React.useState("");

  const columns = React.useMemo<ColumnDef<CategoryRecord, unknown>[]>(
    () => [
      {
        accessorKey: "categoryCode",
        header: "Code",
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-primary">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Category Name",
        cell: (info) => (
          <span className="font-semibold text-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "itemCount",
        header: "Total Items",
        cell: (info) => (
          <span className="text-xs text-muted-foreground">
            {info.getValue() as number} products
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
        cell: () => (
          <div className="flex items-center gap-1">
            <EditButton />
            <DeleteButton />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <DynamicPageHeader
        title="Product Categories"
        description="Organize store items into distinct merchandise groupings."
        breadcrumbs={[
          { label: "E-Commerce", href: "/dashboard" },
          { label: "Categories", isCurrent: true },
        ]}
        actions={
          <ActionButton
            variant="primary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            label="Add Category"
          />
        }
      />

      <div className="flex items-center justify-between">
        <DynamicSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search categories..."
        />
      </div>

      <DynamicTable
        columns={columns}
        data={mockCategories}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalRecords={mockCategories.length}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
