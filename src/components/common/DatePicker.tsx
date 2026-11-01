import * as React from "react";
import { Calendar } from "lucide-react";
import { DynamicInput } from "./Input";

export interface DynamicDatePickerProps {
  label?: string;
  value?: string;
  onChange?: (dateStr: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  minDate?: string;
  maxDate?: string;
  includeTime?: boolean;
  className?: string;
}

export const DynamicDatePicker: React.FC<DynamicDatePickerProps> = ({
  label,
  value,
  onChange,
  required,
  disabled,
  error,
  helperText,
  minDate,
  maxDate,
  includeTime = false,
  className,
}) => {
  return (
    <DynamicInput
      label={label}
      kind="date"
      type={includeTime ? "datetime-local" : "date"}
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      min={minDate}
      max={maxDate}
      prefixIcon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      clearable={Boolean(value)}
      onClear={() => onChange?.("")}
      className={className}
    />
  );
};

export const DatePicker = DynamicDatePicker;
export type DatePickerProps = DynamicDatePickerProps;
