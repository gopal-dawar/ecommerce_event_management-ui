"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { ActionButton } from "@/components/common/ActionButtons";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Something went wrong!
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        {error.message || "An unexpected error occurred while rendering this page."}
      </p>
      <ActionButton
        variant="primary"
        onClick={reset}
        icon={<RotateCcw className="h-4 w-4" />}
        label="Try Again"
      />
    </div>
  );
}
