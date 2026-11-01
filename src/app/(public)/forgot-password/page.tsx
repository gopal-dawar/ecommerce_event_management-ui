"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { DynamicInput } from "@/components/common/DynamicInput";
import { ActionButton } from "@/components/common/ActionButtons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Password reset instructions sent to your email.");
    }, 1200);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your verified email to receive a password reset link"
    >
      {sent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            We have dispatched a password recovery token to{" "}
            <span className="font-semibold text-foreground">{email}</span>. Please
            check your inbox and spam folder.
          </p>
          <Link href="/login">
            <ActionButton
              variant="primary"
              fullWidth
              label="Back to Login"
            />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <DynamicInput
            label="Email Address"
            kind="email"
            placeholder="john.doe@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <ActionButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            label="Send Reset Link"
          />

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
