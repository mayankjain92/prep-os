/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialAuthButtons } from "@/components/shared/SocialAuthButtons";
import { Logo } from "@/components/shared/Logo";
import { apiFetch } from "@/lib/api-client";
import { Check, X, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounced username check state
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [usernameMsg, setUsernameMsg] = useState("");

  useEffect(() => {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setUsernameStatus("idle");
      setUsernameMsg("");
      return;
    }

    if (cleanUsername.length < 3 || cleanUsername.length > 20) {
      setUsernameStatus("invalid");
      setUsernameMsg("Must be 3-20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setUsernameStatus("invalid");
      setUsernameMsg("Only letters, numbers, and underscores allowed");
      return;
    }

    setUsernameStatus("checking");
    setUsernameMsg("Checking availability...");

    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch<{ available: boolean; message: string }>(
          `/api/auth/check-username?username=${encodeURIComponent(cleanUsername)}`
        );
        if (res.available) {
          setUsernameStatus("available");
          setUsernameMsg(`@${cleanUsername} is available!`);
        } else {
          setUsernameStatus("taken");
          setUsernameMsg(res.message || "Username already taken");
        }
      } catch {
        setUsernameStatus("idle");
        setUsernameMsg("");
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      setError("Please choose a valid & available username.");
      return;
    }

    setLoading(true);

    try {
      await register({ username: username.trim().toLowerCase(), email, password });
    } catch (err: unknown) {
      setError((err as Error).message || "Registration failed");
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
            <h1 className="text-2xl font-black tracking-tight text-foreground">Create Account</h1>
            <p className="text-xs font-semibold text-muted-foreground">Join PrepOS to track your placement prep</p>
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
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Unique Username
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="alex_dev"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  required
                  minLength={3}
                  maxLength={20}
                  className="bg-background text-foreground border-border rounded-xl pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  {usernameStatus === "available" && <Check className="h-4 w-4 text-emerald-500" />}
                  {(usernameStatus === "taken" || usernameStatus === "invalid") && <X className="h-4 w-4 text-rose-500" />}
                </div>
              </div>
              {usernameMsg && (
                <p
                  className={`mt-1 text-[11px] font-bold ${
                    usernameStatus === "available"
                      ? "text-emerald-500"
                      : usernameStatus === "checking"
                      ? "text-muted-foreground"
                      : "text-rose-500"
                  }`}
                >
                  {usernameMsg}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background text-foreground border-border rounded-xl"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password (min 6 chars)
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background text-foreground border-border rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || usernameStatus === "checking" || usernameStatus === "taken"}
              className="w-full rounded-xl font-bold bg-xblue hover:bg-xhover text-white"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <p className="text-center text-xs font-semibold text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-xblue hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
