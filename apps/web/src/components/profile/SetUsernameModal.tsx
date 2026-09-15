"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

export function SetUsernameModal() {
  const { user, setUsername } = useAuth();
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only render if the user is authenticated and hasn't chosen a username yet
  if (!user || user.username) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = handle.trim().toLowerCase();
    if (clean.length < 3 || clean.length > 20) {
      setError("Username must be between 3 and 20 characters long");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
      setError("Only letters, numbers, and underscores are allowed");
      return;
    }

    setLoading(true);
    try {
      await setUsername(clean);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to set username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-7 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 rounded-2xl bg-xblue/10 text-xblue mb-1">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">Welcome to Prep OS!</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Choose your unique handle to personalize your roadmaps, placement cards, and profile identity.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username-input" className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Choose your handle
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground select-none">
                @
              </span>
              <Input
                id="username-input"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="John Doe"
                className="pl-8 bg-background rounded-xl border-border h-11 text-sm font-semibold"
                autoFocus
                disabled={loading}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              3–20 characters. Letters, numbers, and underscores only.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !handle.trim()}
            className="w-full h-11 rounded-xl bg-xblue hover:bg-xhover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Claiming Handle...
              </>
            ) : (
              <>
                Claim Username <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
