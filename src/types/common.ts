import { ReactNode } from "react";

/**
 * Standard Key-Value Option for Select, Radio, Checkbox
 */
export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
}

/**
 * Breadcrumb Item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

/**
 * Common Stat Card
 */
export interface StatCardData {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
    period?: string;
  };
  icon?: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  description?: string;
}

/**
 * Dynamic Filter Field Definition
 */
export interface FilterFieldConfig {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "boolean";
  placeholder?: string;
  options?: SelectOption[];
  defaultValue?: unknown;
}
