import * as React from "react";
import { Sparkles } from "lucide-react";

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevation">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground max-w-xs">{subtitle}</p>
          )}
        </div>

        {/* Auth Form Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-elevation">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          College E-Commerce & Event Management System © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
