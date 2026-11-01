"use client";

import * as React from "react";
import { AppSidebar } from "./Sidebar";
import { AppHeader } from "./Header";
import { AppFooter } from "./Footer";
import { useSidebarStore } from "@/store/sidebarStore";
import { cn } from "@/utils/cn";

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Dynamic App Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          isCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        {/* Sticky App Header */}
        <AppHeader />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <AppFooter />
      </div>
    </div>
  );
};
