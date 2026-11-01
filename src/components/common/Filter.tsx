"use client";

import * as React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { ActionButton } from "./ActionButtons";
import { DynamicInput } from "./Input";
import { DynamicSelect } from "./Select";
import { FilterFieldConfig, SelectOption } from "@/types/common";
import { cn } from "@/utils/cn";

export interface DynamicFilterProps {
  fields: FilterFieldConfig[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  onReset: () => void;
  onApply?: () => void;
  className?: string;
}

export const DynamicFilter: React.FC<DynamicFilterProps> = ({
  fields,
  values,
  onChange,
  onReset,
  onApply,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleFieldChange = (name: string, val: unknown) => {
    onChange({
      ...values,
      [name]: val,
    });
  };

  return (
    <div className={cn("w-full rounded-xl border border-border bg-card p-4 shadow-subtle space-y-3", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          <Filter className="h-4 w-4 text-primary" />
          <span>Filters & Search</span>
        </button>

        <div className="flex items-center gap-2">
          <ActionButton
            variant="ghost"
            size="xs"
            onClick={onReset}
            icon={<RotateCcw className="h-3 w-3" />}
            label="Reset"
          />
          {onApply && (
            <ActionButton
              variant="primary"
              size="xs"
              onClick={onApply}
              label="Apply"
            />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {fields.map((field) => {
            if (field.type === "select") {
              return (
                <DynamicSelect
                  key={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  options={field.options || []}
                  value={values[field.name] as string | number}
                  onChange={(val) => handleFieldChange(field.name, val)}
                  isClearable
                />
              );
            }

            return (
              <DynamicInput
                key={field.name}
                label={field.label}
                kind={field.type === "date" ? "date" : "text"}
                placeholder={field.placeholder}
                value={(values[field.name] as string) || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                clearable
                onClear={() => handleFieldChange(field.name, "")}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Filter = DynamicFilter;
export type FilterProps = DynamicFilterProps;
