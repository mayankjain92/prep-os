/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/features/auth/AuthContext";

import { LoginHeatmap } from "./LoginHeatmap";
import { ShareableProgressCard } from "./ShareableProgressCard";
import { X, User as UserIcon, Sparkles, Flame, Shield } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  const streak = user.currentStreak || 0;
  const longestStreak = user.longestStreak || 0;
  const loginDates = user.loginDates || [];
  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 px-6 py-4 border-b border-border bg-card/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-xblue/10 text-xblue">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-foreground">User Profile & Activity</h2>
              <p className="text-xs text-muted-foreground">Manage your preferences, track streaks & share your stats</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          {/* User Banner Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-xblue/10 via-card to-amber-500/10 border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-xblue to-cyan-500 flex items-center justify-center font-black text-white text-2xl shadow-lg ring-4 ring-background">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-16 w-16 rounded-2xl object-cover" />
                ) : (
                  initial
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-lg font-black text-foreground">@{user.username || user.email.split("@")[0]}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-xblue/20 text-xblue border border-xblue/30">
                    Prep OS Member
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 justify-center sm:justify-start">
                  <span>{user.email}</span> • <Shield className="h-3.5 w-3.5 text-xblue" /> {user.authProvider || "email"}
                </p>
              </div>
            </div>

            {/* Streak & Theme Toggle Quick Controls */}
            <div className="flex items-center gap-4">
              {/* Daily Streak Highlight Pill */}
              <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center gap-2.5">
                <Flame className="h-6 w-6 fill-amber-400 animate-pulse" />
                <div>
                  <div className="text-sm font-black tracking-tight">{streak} Days</div>
                  <div className="text-[10px] font-semibold text-amber-500/80">Daily Streak</div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 1: Daily Login Heatmap */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Daily Login Activity & Streak</span>
            </h3>

            <LoginHeatmap
              loginDates={loginDates}
              currentStreak={streak}
              longestStreak={longestStreak}
            />
          </div>

          {/* Section 2: Shareable Progress Card */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-xblue" />
              <span>Shareable Progress Card</span>
            </h3>

            <ShareableProgressCard user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
