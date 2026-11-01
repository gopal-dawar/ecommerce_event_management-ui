"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ActionButton } from "./ActionButtons";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: ModalSize;
  footer?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: "primary" | "success" | "danger";
  confirmLoading?: boolean;
  cancelText?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
}

export const DynamicModal: React.FC<DynamicModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  footer,
  onConfirm,
  confirmText = "Confirm",
  confirmVariant = "primary",
  confirmLoading = false,
  cancelText = "Cancel",
  showCloseButton = true,
  closeOnBackdrop = true,
}) => {
  // ESC key listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
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

  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0"
        onClick={() => closeOnBackdrop && onClose()}
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative w-full rounded-xl border border-border bg-card p-6 shadow-elevation transition-all",
          "animate-in fade-in-0 zoom-in-95",
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="py-4 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {(footer !== undefined || onConfirm) && (
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
            {footer !== undefined ? (
              footer
            ) : (
              <>
                <ActionButton
                  variant="outline"
                  onClick={onClose}
                  label={cancelText}
                />
                {onConfirm && (
                  <ActionButton
                    variant={confirmVariant}
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
  );
};

export const Modal = DynamicModal;
export type ModalProps = DynamicModalProps;
