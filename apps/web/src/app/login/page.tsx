"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialAuthButtons } from "@/components/shared/SocialAuthButtons";
import { Logo } from "@/components/shared/Logo";

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email: identifier, password });
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-200">
      <div className="flex items-center justify-between p-6">
        <Logo href="/" size="md" />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="space-y-3 text-center flex flex-col items-center">
            <Logo size="lg" />
            <h1 className="text-2xl font-black tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-xs font-semibold text-muted-foreground">Sign in to your PrepOS account</p>
          </div>

          {error && (
            <div className="rounded-md bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
              {error}
            </div>
          )}

          {/* Google & GitHub Social Buttons */}
          <SocialAuthButtons onError={(err) => setError(err)} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-identifier" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email or Username
              </label>
              <Input
                id="login-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="username or email@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="bg-background text-foreground border-border rounded-xl"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background text-foreground border-border rounded-xl"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl font-bold bg-xblue hover:bg-xhover text-white">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs font-semibold text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-xblue hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
