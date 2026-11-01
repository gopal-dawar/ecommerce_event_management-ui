"use client";

import * as React from "react";
import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";
import { useAuthStore } from "@/store/authStore";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initialize);

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryProvider>
      {children}
      <ToastProvider />
    </QueryProvider>
  );
}
