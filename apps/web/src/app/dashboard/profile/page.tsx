"use client";

import { useAuth } from "@/features/auth/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { LoginHeatmap } from "@/components/profile/LoginHeatmap";
import { ShareableProgressCard } from "@/components/profile/ShareableProgressCard";
import {
  Sun,
  Moon,
  Flame,
  ArrowLeft,
  ShieldCheck,
  Mail,
  GitBranch,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  const streak = user.currentStreak || 0;
  const longestStreak = user.longestStreak || 0;
  const loginDates = user.loginDates || [];
  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Action Bar & Header Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors group mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center text-sky-500 shrink-0 shadow-xs">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-neutral-100">
                Student Profile & Placement Card
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
                Track active study streaks, view your GitHub activity heatmap, and generate shareable placement progress cards.
              </p>
            </div>
          </div>
        </div>

        {/* Segmented Mode Control (Theme Toggle Aligned) */}
        <div className="p-1 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 flex items-center gap-1 shadow-xs shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
              theme === "light"
                ? "bg-white text-slate-950 font-bold shadow-xs border border-slate-200/80"
                : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
              theme === "dark"
                ? "bg-neutral-800 text-white font-bold shadow-xs border border-white/10"
                : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200 font-medium"
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-sky-400" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Unified Profile Banner & Streak Summary Card */}
      <div className="rounded-2xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all hover:border-slate-300 dark:hover:border-white/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* User Metadata Info */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center font-black text-white text-2xl sm:text-3xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-neutral-100">
                  @{user.username || user.email.split("@")[0]}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  <Image src="/logo.svg" alt="PrepOS Logo" width={12} height={12} className="h-3 w-3 object-contain" />
                  PrepOS Scholar
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-slate-700 dark:text-neutral-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                  {user.authProvider ? `${user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1)} Verified` : "Google Verified"}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-slate-700 dark:text-neutral-300 font-medium">
                  <GitBranch className="w-3.5 h-3.5 text-amber-500" />
                  GitHub Synced
                </span>
              </div>
            </div>
          </div>

          {/* Highlight Streak Widget */}
          <div className="rounded-2xl border border-amber-500/30 p-4 sm:px-6 sm:py-4 flex items-center gap-4 shrink-0 shadow-sm bg-amber-500/5 dark:bg-[#181613]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0">
              <Flame className="w-7 h-7 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-amber-500 dark:text-amber-400">
                  <AnimatedNumber value={streak} />
                </span>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-300">Days</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Active Login Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Daily Login Heatmap */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-900 dark:text-neutral-200">
            Daily Login Activity & Heatmap
          </h2>
        </div>

        <LoginHeatmap
          loginDates={loginDates}
          currentStreak={streak}
          longestStreak={longestStreak}
        />
      </div>

      {/* Section 2: Shareable Progress Card */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-sky-500/20 flex items-center justify-center text-sky-500 font-bold text-xs">
            P
          </div>
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-900 dark:text-neutral-200">
            Shareable Progress Card
          </h2>
        </div>

        <ShareableProgressCard user={user} />
      </div>
    </div>
  );
}
