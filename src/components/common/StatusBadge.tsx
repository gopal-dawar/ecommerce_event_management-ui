import * as React from "react";
import { cn } from "@/utils/cn";

export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "completed"
  | "cancelled"
  | "rejected"
  | "approved"
  | "draft";

export interface DynamicStatusBadgeProps {
  status?: StatusType | string;
  isActive?: boolean; // Convenience for boolean DB fields
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export const DynamicStatusBadge: React.FC<DynamicStatusBadgeProps> = ({
  status,
  isActive,
  label,
  size = "md",
  className,
}) => {
  // Resolve status string
  const resolvedStatus: string = React.useMemo(() => {
    if (isActive !== undefined) {
      return isActive ? "active" : "inactive";
    }
    return (status || "draft").toLowerCase();
  }, [isActive, status]);

  const config: Record<
    string,
    { bg: string; text: string; dot: string; defaultLabel: string }
  > = {
    active: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
      defaultLabel: "Active",
    },
    inactive: {
      bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
      text: "text-rose-700 dark:text-rose-300",
      dot: "bg-rose-500",
      defaultLabel: "Inactive",
    },
    pending: {
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
      text: "text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
      defaultLabel: "Pending",
    },
    approved: {
      bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800",
      text: "text-sky-700 dark:text-sky-300",
      dot: "bg-sky-500",
      defaultLabel: "Approved",
    },
    completed: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
      defaultLabel: "Completed",
    },
    rejected: {
      bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
      text: "text-rose-700 dark:text-rose-300",
      dot: "bg-rose-500",
      defaultLabel: "Rejected",
    },
    cancelled: {
      bg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
      text: "text-slate-600 dark:text-slate-400",
      dot: "bg-slate-400",
      defaultLabel: "Cancelled",
    },
    draft: {
      bg: "bg-muted border-border",
      text: "text-muted-foreground",
      dot: "bg-muted-foreground",
      defaultLabel: "Draft",
    },
  };

  const item = config[resolvedStatus] || config.draft;
  const displayLabel = label || item.defaultLabel;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border select-none",
        item.bg,
        item.text,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", item.dot)} />
      <span>{displayLabel}</span>
    </span>
  );
};

export const StatusBadge = DynamicStatusBadge;
export type StatusBadgeProps = DynamicStatusBadgeProps;
