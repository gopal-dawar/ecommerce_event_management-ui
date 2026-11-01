"use client";

import * as React from "react";
import {
  Menu as MenuIcon,
  Bell,
  Search,
  User,
  LogOut,
  Shield,
  ExternalLink,
} from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useAuthStore } from "@/store/authStore";

export const AppHeader: React.FC = () => {
  const { toggleMobile } = useSidebarStore();
  const { user, logout } = useAuthStore();

  const userMenuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: <User className="h-4 w-4" />,
      onClick: () => {
        // Navigate or open profile modal
      },
    },
    {
      id: "swagger",
      label: "Swagger API Docs",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: () => {
        window.open("http://localhost:8080/swagger-ui.html", "_blank");
      },
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut className="h-4 w-4" />,
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger & search */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobile}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          title="Toggle Menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Global Search Hint */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
          <Search className="h-3.5 w-3.5" />
          <span>Search resources, users, menus...</span>
          <kbd className="ml-4 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Swagger Shortcut */}
        <a
          href="http://localhost:8080/swagger-ui.html"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Open Backend Swagger UI"
        >
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>Swagger</span>
        </a>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-muted transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {user?.fullName || user?.username || "Admin User"}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {user?.roleName || user?.roleCode || "Administrator"}
                </span>
              </div>
            </div>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
};
