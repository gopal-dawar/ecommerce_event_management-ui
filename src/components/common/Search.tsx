"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";

export interface DynamicSearchProps {
  value?: string;
  onChange: (searchTerm: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export const DynamicSearch: React.FC<DynamicSearchProps> = ({
  value = "",
  onChange,
  placeholder = "Search by code, name, or description...",
  debounceMs = 400,
  className,
}) => {
  const [internalValue, setInternalValue] = React.useState(value);
  const debouncedValue = useDebounce(internalValue, debounceMs);

  React.useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className={cn("relative flex items-center w-full max-w-sm", className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-8 py-1.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {internalValue && (
        <button
          type="button"
          onClick={() => {
            setInternalValue("");
            onChange("");
          }}
          className="absolute right-2.5 p-0.5 rounded text-muted-foreground hover:text-foreground"
          title="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export const Search = DynamicSearch;
export type SearchProps = DynamicSearchProps;
