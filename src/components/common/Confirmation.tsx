"use client";

import * as React from "react";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { DynamicModal } from "./Modal";
import { ActionButton } from "./ActionButtons";

export type ConfirmationType = "danger" | "warning" | "info" | "success";

export interface DynamicConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  loading?: boolean;
}

export const DynamicConfirmation: React.FC<DynamicConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false,
}) => {
  const iconConfig = {
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
      bg: "bg-destructive/10",
      variant: "danger" as const,
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
      bg: "bg-amber-500/10",
      variant: "warning" as const,
    },
    info: {
      icon: <Info className="h-6 w-6 text-sky-500" />,
      bg: "bg-sky-500/10",
      variant: "primary" as const,
    },
    success: {
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
      bg: "bg-emerald-500/10",
      variant: "success" as const,
    },
  }[type];

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
            label={cancelText}
          />
          <ActionButton
            variant={iconConfig.variant}
            size="sm"
            onClick={onConfirm}
            loading={loading}
            label={confirmText}
          />
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full shrink-0 ${iconConfig.bg}`}>
          {iconConfig.icon}
        </div>
        <div className="text-sm text-muted-foreground pt-1">{message}</div>
      </div>
    </DynamicModal>
  );
};

export const Confirmation = DynamicConfirmation;
export type ConfirmationProps = DynamicConfirmationProps;
