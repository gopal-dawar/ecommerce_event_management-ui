"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { ActionButton } from "./ActionButtons";

export interface DynamicPaginationProps {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const DynamicPagination: React.FC<DynamicPaginationProps> = ({
  pageNumber = 1,
  pageSize = 10,
  totalRecords = 0,
  totalPages: explicitTotalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100, -1],
  className,
}) => {
  // If pageSize is -1 (All items), total pages is 1
  const calculatedTotalPages =
    pageSize === -1
      ? 1
      : Math.max(1, Math.ceil(totalRecords / (pageSize > 0 ? pageSize : 10)));

  const totalPages = explicitTotalPages ?? calculatedTotalPages;

  const startRecord =
    totalRecords === 0
      ? 0
      : pageSize === -1
      ? 1
      : (pageNumber - 1) * pageSize + 1;

  const endRecord =
    pageSize === -1 ? totalRecords : Math.min(pageNumber * pageSize, totalRecords);

  // Generate visible page numbers
  const getPageNumbers = () => {
    if (pageSize === -1) return [1];
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, pageNumber - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2 text-sm text-muted-foreground",
        className
      )}
    >
      {/* Range Display */}
      <div className="flex items-center gap-2 text-xs">
        <span>
          Showing <span className="font-semibold text-foreground">{startRecord}</span> to{" "}
          <span className="font-semibold text-foreground">{endRecord}</span> of{" "}
          <span className="font-semibold text-foreground">{totalRecords}</span> entries
        </span>

        {/* Page size dropdown */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-3">
            <span className="text-xs">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 rounded border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === -1 ? "All" : opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {pageSize !== -1 && totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First page */}
          <ActionButton
            variant="outline"
            size="icon-sm"
            disabled={pageNumber <= 1}
            onClick={() => onPageChange?.(1)}
            tooltip="First page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </ActionButton>

          {/* Previous page */}
          <ActionButton
            variant="outline"
            size="icon-sm"
            disabled={pageNumber <= 1}
            onClick={() => onPageChange?.(pageNumber - 1)}
            tooltip="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </ActionButton>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-xs text-muted-foreground select-none"
                  >
                    ...
                  </span>
                );
              }
              const isCurrent = p === pageNumber;
              return (
                <ActionButton
                  key={`page-${p}`}
                  variant={isCurrent ? "primary" : "outline"}
                  size="icon-sm"
                  onClick={() => onPageChange?.(Number(p))}
                  className={cn(isCurrent && "font-semibold")}
                >
                  {p}
                </ActionButton>
              );
            })}
          </div>

          {/* Next page */}
          <ActionButton
            variant="outline"
            size="icon-sm"
            disabled={pageNumber >= totalPages}
            onClick={() => onPageChange?.(pageNumber + 1)}
            tooltip="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </ActionButton>

          {/* Last page */}
          <ActionButton
            variant="outline"
            size="icon-sm"
            disabled={pageNumber >= totalPages}
            onClick={() => onPageChange?.(totalPages)}
            tooltip="Last page"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export const Pagination = DynamicPagination;
export type PaginationProps = DynamicPaginationProps;
