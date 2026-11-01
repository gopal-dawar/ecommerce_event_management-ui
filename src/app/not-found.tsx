import * as React from "react";
import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { ActionButton } from "@/components/common/ActionButtons";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="p-4 rounded-2xl bg-muted text-muted-foreground">
        <FileQuestion className="h-12 w-12 stroke-1" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
        404 - Page Not Found
      </h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        The screen or resource you are looking for does not exist, or you may lack
        access permissions.
      </p>
      <Link href="/dashboard">
        <ActionButton
          variant="primary"
          icon={<Home className="h-4 w-4" />}
          label="Back to Dashboard"
        />
      </Link>
    </div>
  );
}
