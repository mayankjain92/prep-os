import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Code2, ShieldCheck, Zap, Database, ArrowRight, BookOpen, FolderKanban } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-200">
      {/* Navigation */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-xblue">
            <Code2 className="h-7 w-7" /> Prep OS
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" className="border-border text-muted-foreground hover:bg-card hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-xblue hover:bg-xhover text-white font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-5xl px-6 py-20 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-xblue/30 bg-xblue/10 px-4 py-1.5 text-xs font-semibold text-xblue">
          <Zap className="h-3.5 w-3.5" /> High Performance Placement Prep Tracker
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          Master LeetCode, CS Theory & Software Projects in One OS.
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-muted-foreground">
          Prep OS is built for high-stakes software engineering interviews. Features cached LeetCode sync, MongoDB aggregation theory checklists, and portfolio project tracking.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="bg-xblue hover:bg-xhover text-white font-bold px-8 h-12">
              Launch Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="border-border text-muted-foreground hover:bg-card hover:text-foreground px-8 h-12">
              Create Free Account
            </Button>
          </Link>
        </div>

        {/* System Features Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 w-full text-left pt-12">
          <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-sm transition hover:border-xblue/50">
            <div className="h-10 w-10 rounded-lg bg-xblue/10 flex items-center justify-center text-xblue">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">DSA & LeetCode Sync</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track problem status pipelines, topics, and external LeetCode submissions with Redis cache-aside speed.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-sm transition hover:border-xblue/50">
            <div className="h-10 w-10 rounded-lg bg-xblue/10 flex items-center justify-center text-xblue">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">CS Theory Progress</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Checklists for OS, DBMS, Networks, and Aptitude powered by MongoDB aggregation pipelines.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-sm transition hover:border-xblue/50">
            <div className="h-10 w-10 rounded-lg bg-xblue/10 flex items-center justify-center text-xblue">
              <FolderKanban className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Project Portfolio</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Log software development projects, tech stack tags, repository URLs, and architecture decisions.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6 text-center text-xs text-muted-foreground">
        Prep OS — Placement Preparation Platform © 2026
      </footer>
    </div>
  );
}
