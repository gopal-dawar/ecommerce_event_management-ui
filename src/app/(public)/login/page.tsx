"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/common/Input";
import { ActionButton } from "@/components/common/ActionButtons";
import { useAuthStore } from "@/store/authStore";
import { API_ENDPOINTS } from "@/lib/constants/endpoints";
import { AuthResponse } from "@/types/auth";
import { ApiService } from "@/service/api.Service";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please provide both username and password");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call Spring Boot auth API
      const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        username: username.trim(),
        password,
      });

      if (res.success && res.data) {
        login(res.data.token, res.data.user, res.data.menus);
        toast.success(res.message || "Logged in successfully!");
        router.push("/dashboard");
      } else {
        setError(res.message || "Login failed");
        toast.error(res.message || "Login failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in with your administrative or user credentials"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
            {error}
          </div>
        )}

        <Input
          label="Username / Email"
          kind="text"
          placeholder="Enter your username or email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Password"
          kind="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground select-none">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring"
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          label="Sign In"
          className="mt-2"
        />

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
