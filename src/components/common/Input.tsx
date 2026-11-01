"use client";

import * as React from "react";
import { Eye, EyeOff, X, Search, Phone, Mail, Lock, Calendar, Globe } from "lucide-react";
import { cn } from "@/utils/cn";

export type InputKind =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search"
  | "phone"
  | "url"
  | "date";

export interface DynamicInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string;
  kind?: InputKind;
  error?: string;
  helperText?: string;
  required?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
  containerClassName?: string;
}

export const DynamicInput = React.forwardRef<HTMLInputElement, DynamicInputProps>(
  (
    {
      className,
      containerClassName,
      label,
      kind = "text",
      type: explicitType,
      error,
      helperText,
      required = false,
      clearable = false,
      onClear,
      prefixIcon,
      suffixIcon,
      inputSize = "md",
      disabled,
      readOnly,
      value,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    // Determine actual HTML type
    const resolvedType = React.useMemo(() => {
      if (explicitType) return explicitType;
      if (kind === "password") {
        return showPassword ? "text" : "password";
      }
      if (kind === "phone") return "tel";
      return kind;
    }, [explicitType, kind, showPassword]);

    // Default icon according to kind if not explicitly given
    const defaultPrefixIcon = React.useMemo(() => {
      if (prefixIcon) return prefixIcon;
      switch (kind) {
        case "search":
          return <Search className="h-4 w-4 text-muted-foreground" />;
        case "email":
          return <Mail className="h-4 w-4 text-muted-foreground" />;
        case "phone":
          return <Phone className="h-4 w-4 text-muted-foreground" />;
        case "password":
          return <Lock className="h-4 w-4 text-muted-foreground" />;
        case "date":
          return <Calendar className="h-4 w-4 text-muted-foreground" />;
        case "url":
          return <Globe className="h-4 w-4 text-muted-foreground" />;
        default:
          return null;
      }
    }, [kind, prefixIcon]);

    const sizeClasses = {
      sm: "h-8 px-2.5 text-xs",
      md: "h-9 px-3 text-sm",
      lg: "h-11 px-4 text-base",
    };

    const hasValue = value !== undefined && value !== null && value !== "";

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {defaultPrefixIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
              {defaultPrefixIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            readOnly={readOnly}
            value={value}
            onChange={onChange}
            className={cn(
              "flex w-full rounded-md border border-input bg-background text-foreground shadow-sm transition-colors",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-60",
              "read-only:bg-muted/20 read-only:cursor-default",
              sizeClasses[inputSize],
              defaultPrefixIcon && "pl-9",
              (kind === "password" || (clearable && hasValue) || suffixIcon) && "pr-9",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />

          {/* Suffix Actions: Clear button, Password Toggle, or Custom Suffix */}
          <div className="absolute right-2.5 flex items-center gap-1 text-muted-foreground">
            {clearable && hasValue && !disabled && !readOnly && (
              <button
                type="button"
                onClick={onClear}
                tabIndex={-1}
                className="p-0.5 rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Clear"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {kind === "password" && !disabled && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="p-0.5 rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}

            {suffixIcon && !clearable && kind !== "password" && (
              <span className="pointer-events-none">{suffixIcon}</span>
            )}
          </div>
        </div>

        {error && <span className="text-xs text-destructive font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-muted-foreground">{helperText}</span>
        )}
      </div>
    );
  }
);

DynamicInput.displayName = "DynamicInput";

export const Input = DynamicInput;
export type InputProps = DynamicInputProps;
