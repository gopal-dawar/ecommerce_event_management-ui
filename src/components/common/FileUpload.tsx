"use client";

import * as React from "react";
import { UploadCloud, File, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DynamicFileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  value?: File[] | File;
  onChange?: (files: File[] | File | null) => void;
  error?: string;
  helperText?: string;
  className?: string;
}

export const DynamicFileUpload: React.FC<DynamicFileUploadProps> = ({
  label,
  accept,
  multiple = false,
  maxSizeMb = 10,
  value,
  onChange,
  error,
  helperText,
  className,
}) => {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedFiles: File[] = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const validFiles: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size <= maxSizeMb * 1024 * 1024) {
        validFiles.push(file);
      }
    }

    if (multiple) {
      onChange?.([...selectedFiles, ...validFiles]);
    } else {
      onChange?.(validFiles[0] || null);
    }
  };

  const removeFile = (index: number) => {
    if (multiple) {
      const updated = selectedFiles.filter((_, i) => i !== index);
      onChange?.(updated.length > 0 ? updated : null);
    } else {
      onChange?.(null);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
          {label}
        </span>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 bg-background",
          error && "border-destructive"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2 stroke-1" />
        <p className="text-sm font-medium text-foreground">
          Click to upload <span className="font-normal text-muted-foreground">or drag and drop</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Max file size: {maxSizeMb}MB {accept ? `(${accept})` : ""}
        </p>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          {selectedFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-2 rounded-md border border-border bg-muted/30 text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <File className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate text-foreground font-medium">{file.name}</span>
                <span className="text-muted-foreground text-[10px]">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="p-1 hover:text-destructive rounded transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <span className="text-xs text-destructive font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
    </div>
  );
};

export const FileUpload = DynamicFileUpload;
export type FileUploadProps = DynamicFileUploadProps;
