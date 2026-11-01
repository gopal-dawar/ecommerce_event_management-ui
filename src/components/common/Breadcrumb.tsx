import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbItem } from "@/types/common";
import { cn } from "@/utils/cn";

export interface DynamicBreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({
  items,
  showHome = true,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs text-muted-foreground", className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {showHome && (
          <li className="flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
            {items.length > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
            )}
          </li>
        )}

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-medium truncate max-w-[200px]",
                    isLast ? "text-foreground font-semibold" : ""
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export const Breadcrumb = DynamicBreadcrumb;
export type BreadcrumbProps = DynamicBreadcrumbProps;
