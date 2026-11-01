"use client";

import * as React from "react";
import {
  useForm,
  FieldValues,
  DefaultValues,
  UseFormReturn,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DynamicInput, InputKind } from "./Input";
import { DynamicSelect } from "./Select";
import { ActionButton } from "./ActionButtons";
import { SelectOption } from "@/types/common";
import { cn } from "@/utils/cn";

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "phone"
  | "url"
  | "date"
  | "select"
  | "multi-select"
  | "textarea"
  | "checkbox"
  | "radio";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  options?: SelectOption[]; // For select, multi-select, radio
  colSpan?: 1 | 2 | 3;
}

export interface DynamicFormProps<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<T, any, any>;
  fields: FormFieldConfig[];
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  loading?: boolean;
  gridCols?: 1 | 2 | 3;
  className?: string;
  children?: (methods: UseFormReturn<T>) => React.ReactNode;
}

export function DynamicForm<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  defaultValues,
  submitText = "Save",
  cancelText = "Cancel",
  onCancel,
  loading = false,
  gridCols = 1,
  className,
  children,
}: DynamicFormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  }[gridCols];

  const renderField = (field: FormFieldConfig) => {
    const errorMsg = errors[field.name]?.message as string | undefined;

    switch (field.type) {
      case "select":
      case "multi-select":
        return (
          <Controller
            key={field.name}
            name={field.name as unknown as never}
            control={control}
            render={({ field: controllerField }) => (
              <DynamicSelect
                label={field.label}
                required={field.required}
                disabled={field.disabled}
                placeholder={field.placeholder}
                options={field.options || []}
                isMulti={field.type === "multi-select"}
                isSearchable={true}
                value={controllerField.value}
                onChange={controllerField.onChange}
                error={errorMsg}
                helperText={field.helperText}
              />
            )}
          />
        );

      case "textarea":
        return (
          <Controller
            key={field.name}
            name={field.name as unknown as never}
            control={control}
            render={({ field: controllerField }) => (
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </label>
                <textarea
                  {...controllerField}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                  className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    errorMsg && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errorMsg && (
                  <span className="text-xs text-destructive font-medium">{errorMsg}</span>
                )}
                {!errorMsg && field.helperText && (
                  <span className="text-xs text-muted-foreground">{field.helperText}</span>
                )}
              </div>
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            key={field.name}
            name={field.name as unknown as never}
            control={control}
            render={({ field: controllerField }) => (
              <div className="flex flex-col gap-1 py-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(controllerField.value)}
                    onChange={(e) => controllerField.onChange(e.target.checked)}
                    disabled={field.disabled}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                  />
                  <span>{field.label}</span>
                </label>
                {errorMsg && (
                  <span className="text-xs text-destructive font-medium">{errorMsg}</span>
                )}
              </div>
            )}
          />
        );

      default:
        // text, email, password, number, phone, url, date
        return (
          <Controller
            key={field.name}
            name={field.name as unknown as never}
            control={control}
            render={({ field: controllerField }) => (
              <DynamicInput
                {...controllerField}
                label={field.label}
                kind={field.type as InputKind}
                required={field.required}
                disabled={field.disabled}
                placeholder={field.placeholder}
                error={errorMsg}
                helperText={field.helperText}
              />
            )}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
      <div className={cn("grid gap-4", gridClass)}>
        {fields.map((field) => {
          const spanClass = field.colSpan
            ? `sm:col-span-${Math.min(field.colSpan, gridCols)}`
            : "";
          return (
            <div key={field.name} className={spanClass}>
              {renderField(field)}
            </div>
          );
        })}
      </div>

      {children && children(methods)}

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <ActionButton
            type="button"
            variant="outline"
            onClick={onCancel}
            label={cancelText}
          />
        )}
        <ActionButton
          type="submit"
          variant="primary"
          loading={loading}
          label={submitText}
        />
      </div>
    </form>
  );
}

export const Form = DynamicForm;
export type FormProps<T extends FieldValues> = DynamicFormProps<T>;
