"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/features/auth/AuthContext";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  User as UserIcon,
  Flame,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  ExternalLink,
  RotateCw,
  Code2,
} from "lucide-react";
import { useLeetCodeProfile, useSyncLeetCode } from "@/features/dsa/useProblems";
import posthog from "posthog-js";

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data: dbLeetcodeProfile } = useLeetCodeProfile();
  const syncMutation = useSyncLeetCode();
  const activeProfile = syncMutation.data?.profile || dbLeetcodeProfile;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const streak = user.currentStreak || 0;
  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button in Header (Rounded Rectangle aligned with navbar theme) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-neutral-800/60 transition-all text-slate-700 dark:text-neutral-300 cursor-pointer group focus:outline-none shadow-xs"
        title="Account & Profile"
      >
        {/* User Avatar Circle */}
        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-xs text-slate-800 dark:text-white shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="Avatar"
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-semibold text-[11px]">{initial}</span>
          )}
        </div>

        {/* User Handle */}
        <span className="text-xs font-medium text-slate-800 dark:text-neutral-200 hidden sm:inline max-w-[120px] truncate">
          @{user.username || user.email.split("@")[0]}
        </span>

        {/* Streak: Clean logo and count without background or border */}
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-400">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{streak}</span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-neutral-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Stitch-Styled Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#161616] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl p-4 z-50 text-slate-800 dark:text-neutral-200 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info & Streak Header */}
          <div className="flex items-start gap-3 pb-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-white shrink-0 border border-slate-300 dark:border-white/15 shadow-sm mt-0.5">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="Avatar"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                @{user.username || user.email.split("@")[0]}
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-400 truncate mt-0.5">
                {user.email}
              </div>
              {/* Streak Display without yellow background */}
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{streak} Days Daily Streak</span>
              </div>
            </div>
          </div>

          {/* LeetCode Detailed Status & 1-Click Sync */}
          {activeProfile?.username && (
            <div className="mb-2 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Code2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200 truncate">
                    LeetCode Stats
                  </span>
                  {activeProfile.ranking ? (
                    <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                      #{activeProfile.ranking.toLocaleString()}
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    syncMutation.mutate(
                      { username: activeProfile.username, force: false },
                      {
                        onSuccess: (data) => {
                          posthog.capture("leetcode_profile_synced_dropdown", {
                            total_solved: data.profile?.totalSolved,
                          });
                        },
                      },
                    );
                  }}
                  disabled={syncMutation.isPending}
                  title="Sync LeetCode profile"
                  className="p-1 rounded-md text-slate-400 hover:text-sky-500 dark:text-neutral-500 dark:hover:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCw
                    className={`w-3 h-3 ${
                      syncMutation.isPending ? "animate-spin text-sky-500" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="bg-white dark:bg-[#121212] rounded-lg py-1 px-1 border border-slate-200/60 dark:border-white/[0.04]">
                  <div className="text-[9px] uppercase font-semibold text-slate-500 dark:text-neutral-500">
                    Total
                  </div>
                  <div className="text-xs font-bold font-mono text-sky-600 dark:text-sky-400">
                    {activeProfile.totalSolved ?? 0}
                  </div>
                </div>
                <div className="bg-white dark:bg-[#121212] rounded-lg py-1 px-1 border border-slate-200/60 dark:border-white/[0.04]">
                  <div className="text-[9px] uppercase font-semibold text-slate-500 dark:text-neutral-500">
                    Easy
                  </div>
                  <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {activeProfile.easySolved ?? 0}
                  </div>
                </div>
                <div className="bg-white dark:bg-[#121212] rounded-lg py-1 px-1 border border-slate-200/60 dark:border-white/[0.04]">
                  <div className="text-[9px] uppercase font-semibold text-slate-500 dark:text-neutral-500">
                    Med
                  </div>
                  <div className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                    {activeProfile.mediumSolved ?? 0}
                  </div>
                </div>
                <div className="bg-white dark:bg-[#121212] rounded-lg py-1 px-1 border border-slate-200/60 dark:border-white/[0.04]">
                  <div className="text-[9px] uppercase font-semibold text-slate-500 dark:text-neutral-500">
                    Hard
                  </div>
                  <div className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400">
                    {activeProfile.hardSolved ?? 0}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-white/[0.08] my-2.5 -mx-4" />

          {/* Menu Actions */}
          <div className="space-y-1">
            {/* Theme Mode Toggle Row */}
            <div
              onClick={toggleTheme}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTheme();
                }
              }}
              className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors text-xs text-slate-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 text-sky-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="font-medium text-slate-800 dark:text-neutral-200">
                  Theme Mode ({theme === "dark" ? "Dark" : "Light"})
                </span>
              </div>
              <div className="w-11 h-6 bg-slate-300 dark:bg-neutral-800 border border-slate-300 dark:border-white/[0.1] rounded-full p-0.5 flex items-center transition-colors">
                <div
                  className={`w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md transition-transform duration-200 ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="w-3 h-3 text-neutral-900" />
                  ) : (
                    <Sun className="w-3 h-3 text-amber-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Profile & Activity Item */}
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors text-xs text-slate-700 dark:text-neutral-300 group"
            >
              <div className="flex items-center gap-2.5">
                <UserIcon className="w-4 h-4 text-slate-500 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-neutral-200 transition-colors" />
                <span className="font-medium text-slate-800 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Profile & Activity
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 dark:text-neutral-500 group-hover:text-slate-700 dark:group-hover:text-neutral-300" />
            </Link>

            <div className="border-t border-slate-200 dark:border-white/[0.08] my-1 -mx-4" />

            {/* Sign Out Item */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
