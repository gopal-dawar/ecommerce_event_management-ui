"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ActionButton } from "./ActionButtons";

export type DrawerPlacement = "left" | "right";
export type DrawerSize = "sm" | "md" | "lg" | "xl";

export interface DynamicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  footer?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  confirmLoading?: boolean;
  cancelText?: string;
}

export const DynamicDrawer: React.FC<DynamicDrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  placement = "right",
  size = "md",
  footer,
  onConfirm,
  confirmText = "Save",
  confirmLoading = false,
  cancelText = "Cancel",
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<DrawerSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-xl",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0"
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-y-0 flex max-w-full",
          placement === "right" ? "right-0" : "left-0"
        )}
      >
        <div
          className={cn(
            "relative w-screen bg-card border-border shadow-floating flex flex-col justify-between",
            placement === "right" ? "border-l" : "border-r",
            "animate-in duration-200",
            placement === "right" ? "slide-in-from-right" : "slide-in-from-left",
            sizeClasses[size]
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              {description && (
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 overflow-y-auto">{children}</div>

          {/* Footer */}
          {(footer !== undefined || onConfirm) && (
            <div className="flex items-center justify-end gap-2.5 p-4 border-t border-border bg-muted/20">
              {footer !== undefined ? (
                footer
              ) : (
                <>
                  <ActionButton
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    label={cancelText}
                  />
                  {onConfirm && (
                    <ActionButton
                      variant="primary"
                      size="sm"
                      onClick={onConfirm}
                      loading={confirmLoading}
                      label={confirmText}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Drawer = DynamicDrawer;
export type DrawerProps = DynamicDrawerProps;
