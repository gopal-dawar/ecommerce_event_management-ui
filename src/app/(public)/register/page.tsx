"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { DynamicInput } from "@/components/common/DynamicInput";
import { ActionButton } from "@/components/common/ActionButtons";

export default function RegisterPage() {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Registration request submitted for approval.");
    }, 1000);
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Register to participate in college events and store access"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <DynamicInput
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />
          <DynamicInput
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />
        </div>

        <DynamicInput
          label="Username"
          placeholder="johndoe"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />

        <DynamicInput
          label="Email Address"
          kind="email"
          placeholder="john.doe@college.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <DynamicInput
          label="Password"
          kind="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <DynamicInput
          label="Confirm Password"
          kind="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
        />

        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          label="Register Account"
          className="mt-3"
        />

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
