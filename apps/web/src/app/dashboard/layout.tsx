/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { Logo } from "@/components/shared/Logo";
import { LayoutDashboard, Code2, BookOpen, FolderKanban } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-2 border-transparent border-t-xblue border-r-cyan-400 animate-spin" />
          <div className="absolute flex items-center justify-center">
            <img src="/logo.svg" alt="Loading" className="h-7 w-7 object-contain animate-pulse drop-shadow-[0_0_10px_rgba(0,212,255,0.7)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/dsa", label: "DSA Roadmap", icon: Code2 },
    { href: "/dashboard/theory", label: "CS Theory", icon: BookOpen },
    { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Header - Twitter/X Style */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-8">
            <Logo href="/dashboard" size="md" />

            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all ${
                      isActive
                        ? "bg-xblue text-white font-extrabold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-card"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <ProfileDropdown onOpenModal={() => setIsProfileModalOpen(true)} />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="rounded-full border-border text-xs font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full bg-xblue hover:bg-xhover text-white font-bold text-xs px-4">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-background text-foreground">{children}</main>
      <ScrollToTop />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
