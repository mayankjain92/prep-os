"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { SetUsernameModal } from "@/components/profile/SetUsernameModal";
import { Logo } from "@/components/shared/Logo";
import {
  LayoutGrid,
  Code2,
  BookOpen,
  FolderKanban,
  Menu,
  X,
} from "lucide-react";
import { AgentCopilot } from "@/components/agent/AgentCopilot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-neutral-200 flex flex-col items-center justify-center transition-colors duration-200">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-2 border-transparent border-t-sky-500 border-r-cyan-400 animate-spin" />
          <div className="absolute flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Loading"
              width={28}
              height={28}
              priority
              className="h-7 w-7 object-contain animate-pulse drop-shadow-[0_0_10px_rgba(0,212,255,0.7)]"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/dashboard/dsa", label: "DSA Roadmap", icon: Code2 },
    { href: "/dashboard/theory", label: "CS Theory", icon: BookOpen },
    { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-neutral-200 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-300 transition-colors duration-200">
      {/* BEGIN: MainNavbar - Stitch Style with Original PrepOS Logo */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/[0.08] bg-white/85 dark:bg-[#0A0A0A]/85 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
          {/* Brand Logo */}
          <div className="flex items-center shrink-0">
            <Logo href="/dashboard" size="md" />
          </div>

          {/* Desktop Navigation Links (Centered) */}
          <nav
            aria-label="Global Navigation"
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-neutral-400"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-sky-500 text-white font-semibold shadow-sm shadow-sky-500/20"
                      : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] font-medium"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Profile & Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs px-4 shadow-sm shadow-sky-500/20"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0A0A0A] px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150 shadow-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? "bg-sky-500 text-white font-semibold shadow-sm shadow-sky-500/20"
                      : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] font-medium"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>
      {/* END: MainNavbar */}

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-neutral-200 transition-colors duration-200">
        {children}
      </main>
      <AgentCopilot />
      <SetUsernameModal />
    </div>
  );
}
