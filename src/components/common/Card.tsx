import * as React from "react";
import { cn } from "@/utils/cn";

export interface DynamicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const DynamicCard = React.forwardRef<HTMLDivElement, DynamicCardProps>(
  (
    {
      className,
      title,
      subtitle,
      actions,
      footer,
      noPadding = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground shadow-card transition-all",
          className
        )}
        {...props}
      >
        {(title || subtitle || actions) && (
          <div className="flex items-start justify-between gap-4 p-5 pb-4 border-b border-border">
            <div>
              {title && (
                <h3 className="text-base font-semibold leading-none tracking-tight text-foreground">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1.5 text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}

        <div className={cn(!noPadding && "p-5")}>{children}</div>

        {footer && (
          <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20 rounded-b-xl text-xs text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

DynamicCard.displayName = "DynamicCard";

export const Card = DynamicCard;
export type CardProps = DynamicCardProps;
