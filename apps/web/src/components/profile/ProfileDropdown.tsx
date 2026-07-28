/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { User as UserIcon, Flame, Sun, Moon, LogOut, ChevronDown, Trophy, ExternalLink } from "lucide-react";

interface ProfileDropdownProps {
  onOpenModal: () => void;
}

export function ProfileDropdown({ onOpenModal }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
      {/* Profile Trigger Button in Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-border bg-card hover:bg-accent transition-all cursor-pointer shadow-2xs group"
        title="Account & Profile"
      >
        {/* User Avatar Circle */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-xblue to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-xs">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            initial
          )}
        </div>

        {/* User Email & Streak Pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-foreground">
          <span className="max-w-[110px] truncate">@{user.username || user.email.split("@")[0]}</span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-extrabold text-[10px] border border-amber-500/20">
            <Flame className="h-3 w-3 fill-amber-400" />
            {streak}
          </span>
        </div>

        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-card shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info Header */}
          <div className="p-3 rounded-xl bg-muted/40 mb-2 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-xblue to-cyan-500 flex items-center justify-center font-extrabold text-white text-sm">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-xs text-foreground truncate">@{user.username || user.email.split("@")[0]}</div>
                <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-bold mt-0.5">
                  <Flame className="h-3 w-3 fill-amber-400" /> {streak} Days Daily Streak
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggle Section (Moved inside Profile Menu as requested!) */}
          <div className="p-2 mb-2 rounded-xl border border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-xblue" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
              <span>Theme Mode</span>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-muted hover:bg-accent text-foreground transition-colors cursor-pointer border border-border"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-xblue" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Actions */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent transition-colors text-left cursor-pointer"
            >
              <UserIcon className="h-4 w-4 text-xblue" />
              <span>View Full Profile & Stats</span>
            </button>

            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent transition-colors text-left"
            >
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Open Profile Page</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
            </Link>

            <div className="h-px bg-border my-1" />

            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
