/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/features/auth/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { LoginHeatmap } from "@/components/profile/LoginHeatmap";
import { ShareableProgressCard } from "@/components/profile/ShareableProgressCard";
import { User as UserIcon, Sun, Moon, Flame, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const streak = user.currentStreak || 0;
  const longestStreak = user.longestStreak || 0;
  const loginDates = user.loginDates || [];
  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <UserIcon className="h-7 w-7 text-xblue" /> User Profile & Activity
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track your daily login streaks, heatmap calendar, and customize your shareable progress card
          </p>
        </div>

        {/* Theme Selector (Relocated inside Profile) */}
        <div className="p-1 rounded-2xl bg-card border border-border flex items-center gap-1">
          <button
            onClick={() => theme === "dark" && toggleTheme()}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              theme === "light"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="h-4 w-4 text-amber-300" />
            <span>Light Mode</span>
          </button>

          <button
            onClick={() => theme === "light" && toggleTheme()}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              theme === "dark"
                ? "bg-xblue text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon className="h-4 w-4 text-xblue" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* User Header Profile Card */}
      <div className="p-7 rounded-3xl bg-gradient-to-r from-xblue/10 via-card to-amber-500/10 border border-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-xblue to-cyan-500 flex items-center justify-center font-black text-white text-3xl shadow-lg ring-4 ring-background">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-20 w-20 rounded-3xl object-cover" />
            ) : (
              initial
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl font-black text-foreground">@{user.username || user.email.split("@")[0]}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-xblue/20 text-xblue border border-xblue/30 shadow-xs">
                <img src="/logo.svg" alt="PrepOS Cutout Logo" className="h-3.5 w-3.5 object-contain" />
                PrepOS Scholar
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 justify-center sm:justify-start">
              <span>{user.email}</span> • <Shield className="h-3.5 w-3.5 text-xblue" /> {user.authProvider || "email"}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center gap-3.5 shadow-xs">
          <Flame className="h-8 w-8 fill-amber-400 animate-pulse" />
          <div>
            <div className="text-2xl font-black tracking-tight">{streak} Days</div>
            <div className="text-xs font-bold text-amber-500/80">Active Login Streak</div>
          </div>
        </div>
      </div>

      {/* Section 1: Daily Login Heatmap */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500" />
          <span>Daily Login Activity & Heatmap</span>
        </h2>

        <LoginHeatmap
          loginDates={loginDates}
          currentStreak={streak}
          longestStreak={longestStreak}
        />
      </div>

      {/* Section 2: Shareable Progress Card */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-foreground uppercase tracking-wider flex items-center gap-2">
          <img src="/logo.svg" alt="PrepOS Logo" className="h-5 w-5 object-contain" />
          <span>Shareable Progress Card</span>
        </h2>

        <ShareableProgressCard user={user} />
      </div>
    </div>
  );
}
