"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox } from "lucide-react";
import { cn } from "@/utils/cn";
import { DynamicPagination } from "./Pagination";

export interface DynamicTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  loading?: boolean;
  emptyMessage?: string;
  // Server-side / Client Pagination
  pageNumber?: number;
  pageSize?: number;
  totalRecords?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  // Sorting
  onSortChange?: (sortBy: string, sortOrder: "ASC" | "DESC") => void;
  // Row selection
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  className?: string;
}

export function DynamicTable<TData>({
  columns,
  data = [],
  loading = false,
  emptyMessage = "No records found",
  pageNumber = 1,
  pageSize = 10,
  totalRecords,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  enableRowSelection = false,
  onRowSelectionChange,
  className,
}: DynamicTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection,
    onRowSelectionChange: (updater) => {
      const nextSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(nextSelection);

      if (onRowSelectionChange) {
        const selectedIndices = Object.keys(nextSelection).map(Number);
        const selectedData = selectedIndices.map((idx) => data[idx]).filter(Boolean);
        onRowSelectionChange(selectedData);
      }
    },
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(nextSorting);

      if (onSortChange && nextSorting.length > 0) {
        const field = nextSorting[0].id;
        const order = nextSorting[0].desc ? "DESC" : "ASC";
        onSortChange(field, order);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-lg border border-border bg-card shadow-card">
        <table className="w-full caption-bottom text-sm border-collapse">
          {/* Header */}
          <thead className="bg-muted/40 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className="h-10 px-4 text-left align-middle font-semibold text-xs uppercase tracking-wider text-muted-foreground select-none"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center gap-1.5",
                            canSort && "cursor-pointer hover:text-foreground"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {canSort && (
                            <span className="shrink-0">
                              {isSorted === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5 text-primary" />
                              ) : isSorted === "desc" ? (
                                <ArrowDown className="h-3.5 w-3.5 text-primary" />
                              ) : (
                                <ArrowUpDown className="h-3 w-3 opacity-40 hover:opacity-100" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-border">
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: pageSize > 0 && pageSize <= 10 ? pageSize : 5 }).map(
                (_, rowIdx) => (
                  <tr key={`skeleton-${rowIdx}`} className="animate-pulse">
                    {columns.map((col, colIdx) => (
                      <td key={`skeleton-cell-${colIdx}`} className="p-4">
                        <div className="h-4 w-3/4 rounded bg-muted/60" />
                      </td>
                    ))}
                  </tr>
                )
              )
            ) : table.getRowModel().rows.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-36 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="h-8 w-8 text-muted-foreground/40 stroke-1" />
                    <span className="text-sm font-medium">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              // Actual Data Rows
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "transition-colors hover:bg-muted/30",
                    row.getIsSelected() && "bg-primary/5"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3.5 align-middle text-sm text-foreground">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {(totalRecords !== undefined || onPageChange) && (
        <DynamicPagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalRecords={totalRecords ?? data.length}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

export const Table = DynamicTable;
export type TableProps<TData> = DynamicTableProps<TData>;
