"use client";

import * as React from "react";
import { ChevronDown, Check, X, Loader2, Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { SelectOption } from "@/types/common";

export interface DynamicSelectProps<T = string | number> {
  label?: string;
  options: SelectOption<T>[];
  value?: T | T[];
  onChange?: (val: T | T[] | undefined) => void;
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  className?: string;
}

export function DynamicSelect<T = string | number>({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  isMulti = false,
  isSearchable = false,
  isClearable = true,
  disabled = false,
  loading = false,
  required = false,
  error,
  helperText,
  containerClassName,
  className,
}: DynamicSelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const selectedOptions = React.useMemo(() => {
    if (value === undefined || value === null) return [];
    if (isMulti && Array.isArray(value)) {
      return options.filter((opt) => (value as T[]).includes(opt.value));
    }
    return options.filter((opt) => opt.value === value);
  }, [options, value, isMulti]);

  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;

    if (isMulti) {
      const currentValues = Array.isArray(value) ? [...(value as T[])] : [];
      const index = currentValues.indexOf(option.value);
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(option.value);
      }
      onChange?.(currentValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(isMulti ? [] : undefined);
    setSearchTerm("");
  };

  const handleRemoveItem = (e: React.MouseEvent, val: T) => {
    e.stopPropagation();
    if (isMulti && Array.isArray(value)) {
      onChange?.((value as T[]).filter((v) => v !== val));
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Select Trigger Box */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "flex min-h-[36px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          disabled && "cursor-not-allowed bg-muted/40 opacity-60",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 pr-2">
          {loading ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading options...
            </span>
          ) : selectedOptions.length === 0 ? (
            <span className="text-muted-foreground select-none truncate">
              {placeholder}
            </span>
          ) : isMulti ? (
            selectedOptions.map((opt) => (
              <span
                key={String(opt.value)}
                className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {opt.label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveItem(e, opt.value)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className="text-foreground truncate">
              {selectedOptions[0]?.label}
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-muted-foreground shrink-0">
          {isClearable && selectedOptions.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:text-foreground rounded"
              title="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-elevation animate-in fade-in-0 zoom-in-95">
          {isSearchable && (
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-muted/50 border border-input">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-xs focus:outline-none placeholder:text-muted-foreground text-foreground"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = isMulti
                  ? Array.isArray(value) && (value as T[]).includes(opt.value)
                  : value === opt.value;

                return (
                  <div
                    key={String(opt.value)}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-1.5 rounded-sm text-sm cursor-pointer select-none transition-colors",
                      opt.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <span className="text-xs text-destructive font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
    </div>
  );
}

export const Select = DynamicSelect;
export type SelectProps<T = string | number> = DynamicSelectProps<T>;
