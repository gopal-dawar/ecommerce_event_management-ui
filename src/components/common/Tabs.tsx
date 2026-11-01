"use client";

import * as React from "react";
import { cn } from "@/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface DynamicTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
  variant?: "line" | "pill";
}

export const DynamicTabs: React.FC<DynamicTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = "line",
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-x-auto",
        variant === "line" ? "border-b border-border" : "p-1 bg-muted/60 rounded-lg",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium transition-all select-none",
              variant === "line"
                ? cn(
                    "px-4 py-2.5 border-b-2 -mb-px",
                    isActive
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                  )
                : cn(
                    "px-3 py-1.5 rounded-md",
                    isActive
                      ? "bg-card text-foreground shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  ),
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const Tabs = DynamicTabs;
export type TabsProps = DynamicTabsProps;
