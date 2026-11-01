import * as React from "react";
import { DynamicBreadcrumb } from "./Breadcrumb";
import { BreadcrumbItem } from "@/types/common";
import { cn } from "@/utils/cn";

export interface DynamicPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const DynamicPageHeader: React.FC<DynamicPageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-3 pb-5 border-b border-border/80", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <DynamicBreadcrumb items={breadcrumbs} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

export const PageHeader = DynamicPageHeader;
export type PageHeaderProps = DynamicPageHeaderProps;
