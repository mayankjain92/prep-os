"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Code2, BookOpen, FolderKanban, LogOut, User, Sun, Moon, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
            <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl tracking-tight text-xblue">
              <Sparkles className="h-6 w-6 text-xblue" />
              <span>Prep OS</span>
            </Link>

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
            {/* Dark / Light Mode Toggle Button */}
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="rounded-full border-border bg-card hover:bg-accent text-foreground text-xs font-semibold gap-1.5 px-3"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-xblue" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </Button>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-card px-3 py-1.5 rounded-full border border-border">
                  <User className="h-3.5 w-3.5 text-xblue" />
                  {user.email}
                </span>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border hover:bg-card text-xs font-semibold"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </div>
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
    </div>
  );
}
