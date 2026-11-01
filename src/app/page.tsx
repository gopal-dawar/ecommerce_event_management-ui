"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Database, Layout } from "lucide-react";
import { ActionButton } from "@/components/common/ActionButtons";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Spring Boot 4 + Next.js 15 Enterprise Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          College E-Commerce & <br />
          <span className="text-primary">Event Management</span>
        </h1>

        <p className="text-base text-muted-foreground max-w-lg mx-auto">
          Centralized enterprise architecture with RBAC master management, dynamic
          reusable components, and Spring Boot 4 REST API integration.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
          <div className="p-4 rounded-xl border border-border bg-card shadow-subtle space-y-1.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-semibold text-foreground">RBAC Authorization</h3>
            <p className="text-xs text-muted-foreground">
              Dynamic role permissions for VIEW, ADD, EDIT, DELETE.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-subtle space-y-1.5">
            <Layout className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Dynamic UI Library</h3>
            <p className="text-xs text-muted-foreground">
              Single-source ActionButtons, DynamicTable, DynamicForm.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-subtle space-y-1.5">
            <Database className="h-5 w-5 text-sky-600" />
            <h3 className="text-sm font-semibold text-foreground">Spring Boot REST</h3>
            <p className="text-xs text-muted-foreground">
              MySQL 8.0, JPA, HikariCP, and Swagger OpenAPI 3.0.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-3 pt-6">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <ActionButton
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
                label={`Continue to Dashboard (${user?.username || "Admin"})`}
              />
            </Link>
          ) : (
            <>
              <Link href="/login">
                <ActionButton
                  variant="primary"
                  size="lg"
                  label="Login to Portal"
                />
              </Link>
              <Link href="/dashboard">
                <ActionButton
                  variant="outline"
                  size="lg"
                  label="View Dashboard"
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
