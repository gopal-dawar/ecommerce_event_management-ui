import * as React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { StatCardData } from "@/types/common";
import { cn } from "@/utils/cn";

export interface DynamicStatCardProps extends StatCardData {
  className?: string;
}

export const DynamicStatCard: React.FC<DynamicStatCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = "default",
  description,
  className,
}) => {
  const variantIcons: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    danger: "bg-destructive/10 text-destructive",
    info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 text-card-foreground shadow-card flex flex-col justify-between transition-all hover:shadow-elevation",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {icon && (
          <div className={cn("p-2.5 rounded-lg shrink-0", variantIcons[variant])}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </span>

        {(change || description) && (
          <div className="flex items-center gap-2 mt-1 text-xs">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center font-medium",
                  change.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive"
                )}
              >
                {change.isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                )}
                {change.value}%
              </span>
            )}
            <span className="text-muted-foreground truncate">
              {change?.period || description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const StatCard = DynamicStatCard;
export type StatCardProps = DynamicStatCardProps;
