"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Check,
  X,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Save,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { usePermission } from "@/hooks/usePermission";
import { PermissionAction } from "@/types/rbac";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-[0.98]",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm active:scale-[0.98]",
        warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm active:scale-[0.98]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        text: "text-foreground hover:underline p-0 h-auto bg-transparent",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto bg-transparent",
      },
      size: {
        xs: "h-7 rounded px-2.5 text-xs gap-1",
        sm: "h-8 rounded-md px-3 text-xs gap-1.5",
        md: "h-9 px-4 py-2 text-sm gap-2",
        lg: "h-11 rounded-md px-7 text-base gap-2.5",
        icon: "h-9 w-9 p-0 rounded-md",
        "icon-sm": "h-7 w-7 p-0 rounded",
        "icon-lg": "h-11 w-11 p-0 rounded-md",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

// Map common icon string identifiers to Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  add: Plus,
  plus: Plus,
  edit: Pencil,
  delete: Trash2,
  trash: Trash2,
  view: Eye,
  eye: Eye,
  save: Save,
  check: Check,
  cancel: X,
  close: X,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  chevronDown: ChevronDown,
};

export type IconType = keyof typeof ICON_MAP | React.ReactNode;

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  icon?: IconType;
  iconPosition?: "left" | "right";
  loading?: boolean;
  loadingText?: string;
  tooltip?: string;
  permission?: {
    menuCode: string;
    action: PermissionAction;
  };
  permissionBehavior?: "hide" | "disable";
}

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      label,
      children,
      icon,
      iconPosition = "left",
      loading = false,
      loadingText,
      tooltip,
      disabled,
      permission,
      permissionBehavior = "hide",
      type = "button",
      ...props
    },
    ref
  ) => {
    const { hasPermission } = usePermission();

    const hasAccess = React.useMemo(() => {
      if (!permission) return true;
      return hasPermission(permission.menuCode, permission.action);
    }, [permission, hasPermission]);

    if (!hasAccess && permissionBehavior === "hide") {
      return null;
    }

    const isEffectivelyDisabled = disabled || loading || (!hasAccess && permissionBehavior === "disable");

    const renderIcon = (iconItem?: IconType) => {
      if (!iconItem) return null;
      if (typeof iconItem === "string" && ICON_MAP[iconItem]) {
        const IconComponent = ICON_MAP[iconItem];
        return <IconComponent className="h-4 w-4 shrink-0" />;
      }
      return <span className="shrink-0">{iconItem as React.ReactNode}</span>;
    };

    const content = (
      <button
        ref={ref}
        type={type}
        disabled={isEffectivelyDisabled}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && renderIcon(icon)}
            {(label || children) && <span>{label || children}</span>}
            {icon && iconPosition === "right" && renderIcon(icon)}
          </>
        )}
      </button>
    );

    if (tooltip && !isEffectivelyDisabled) {
      return (
        <div className="relative group inline-flex" title={tooltip}>
          {content}
        </div>
      );
    }

    return content;
  }
);

ActionButton.displayName = "ActionButton";

// Also export as Button
export const Button = ActionButton;
export const ActionButtons = ActionButton;

// ==========================================
// Specialized Convenient Action Buttons
// ==========================================

export const AddButton: React.FC<ActionButtonProps> = (props) => (
  <ActionButton variant="primary" icon="add" label="Add New" {...props} />
);

export const SaveButton: React.FC<ActionButtonProps> = (props) => (
  <ActionButton variant="primary" icon="save" label="Save" type="submit" {...props} />
);

export const CancelButton: React.FC<ActionButtonProps> = (props) => (
  <ActionButton variant="outline" icon="cancel" label="Cancel" {...props} />
);

export const EditButton: React.FC<ActionButtonProps> = (props) => (
  <ActionButton variant="ghost" size="icon-sm" icon="edit" tooltip="Edit" {...props} />
);

export const DeleteButton: React.FC<ActionButtonProps> = (props) => (
  <ActionButton variant="danger" size="icon-sm" icon="delete" tooltip="Delete" {...props} />
);

export const ViewButton: React.FC<ActionButtonProps> = (props) => (
  <ActionButton variant="ghost" size="icon-sm" icon="view" tooltip="View Details" {...props} />
);

export const RefreshButton: React.FC<ActionButtonProps> = (props) => (
  <ActionButton variant="outline" size="sm" icon="refresh" label="Refresh" {...props} />
);

export const ExportButton: React.FC<ActionButtonProps> = (props) => (
  <ActionButton variant="outline" size="sm" icon="download" label="Export" {...props} />
);

export const FilterButton: React.FC<ActionButtonProps> = (props) => (
  <ActionButton variant="outline" size="sm" icon="filter" label="Filter" {...props} />
);
