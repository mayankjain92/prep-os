"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useProblems, useLeetCodeProfile } from "@/features/dsa/useProblems";
import { useProjects } from "@/features/projects/useProjects";
import { useRoadmapProgress } from "@/features/roadmap/useRoadmap";
import { useDoubts } from "@/features/doubts/useDoubts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DSA_ROADMAP_SECTIONS } from "@/data/dsa-roadmap";
import { THEORY_ROADMAP_SECTIONS } from "@/data/theory-roadmap";
import type { RoadmapNodeItem } from "@/components/shared/RoadmapFlowChart";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { PageTransition, FadeInCard, AnimatedProgressBar } from "@/components/shared/PageTransition";
import {
  Code2,
  BookOpen,
  FolderKanban,
  ExternalLink,
  CircleDashed,
  Zap,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

// ─── helpers ───────────────────────────────────────────────────────────────

function LeetCodeStatPill({
  total,
  easy,
  medium,
  hard,
  delay = 0,
}: {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  delay?: number;
}) {
  return (
    <FadeInCard delay={delay} className="rounded-2xl border border-border bg-card p-5 flex flex-col shadow-sm">
      <div className="flex justify-between items-start mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">LeetCode</span>
        <div className="flex gap-1 text-[9px] font-bold">
          <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded-sm">E: {easy}</span>
          <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 px-1.5 py-0.5 rounded-sm">M: {medium}</span>
          <span className="text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 px-1.5 py-0.5 rounded-sm">H: {hard}</span>
        </div>
      </div>
      <span className="text-3xl font-black text-foreground leading-none">
        <AnimatedNumber value={total} duration={1200} />
      </span>
      <span className="text-xs text-muted-foreground mt-1">problems solved</span>
    </FadeInCard>
  );
}

function StatPill({
  label,
  value,
  sub,
  accent,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub: string;
  accent: string;
  delay?: number;
}) {
  const numericVal = typeof value === "number" ? value : parseFloat(value.toString().replace("%", ""));
  const isPercent = typeof value === "string" && value.endsWith("%");

  return (
    <FadeInCard delay={delay} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-1.5 shadow-sm">
      <span className={`text-[10px] font-bold uppercase tracking-widest ${accent}`}>{label}</span>
      <span className="text-3xl font-black text-foreground leading-none">
        {!isNaN(numericVal) ? (
          <>
            <AnimatedNumber value={numericVal} duration={1200} />
            {isPercent && "%"}
          </>
        ) : (
          value
        )}
      </span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </FadeInCard>
  );
}

function SectionHeader({
  icon,
  title,
  href,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="text-base font-black text-foreground">{title}</h2>
      </div>
      <Link href={href}>
        <button className={`text-xs font-bold ${accent} hover:underline flex items-center gap-1 transition-all hover:translate-x-0.5`}>
          Open <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </Link>
    </div>
  );
}

function EmptyState({ message, hint, icon, action }: { message: string; hint: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center flex flex-col items-center justify-center min-h-[160px]">
      {icon && <div className="mb-3">{icon}</div>}
      <p className="text-xs text-muted-foreground font-medium">{message}</p>
      <p className="text-[10px] text-muted-foreground/70 mt-1 max-w-[220px]">{hint}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── page ──────────────────────────────────────────────────────────────────

export default function UnifiedDashboardPage() {
  const { data: problems = [] } = useProblems();
  const { data: projects = [] } = useProjects();
  const { data: dsaFlowchartStatus = {} } = useRoadmapProgress("prep_os_dsa_roadmap_v2");
  const { data: theoryFlowchartStatus = {} } = useRoadmapProgress("prep_os_theory_roadmap");
  const { data: doubts = [] } = useDoubts();

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries();
    setIsRefreshing(false);
  };

  // ── DSA ────────────────────────────────────────────────────────────────
  const { totalDsaNodes, doneDsaNodes, inProgressDsaNodes } = useMemo(() => {
    const inProgressDsaNodes: { title: string; section: string }[] = [];

    const gatherNodeStats = (nodes?: RoadmapNodeItem[], sectionName = "") => {
      if (!nodes) return { total: 0, completed: 0 };
      let t = 0, c = 0;
      const traverse = (list: RoadmapNodeItem[]) => {
        list.forEach((n) => {
          t++;
          const st = dsaFlowchartStatus[n.id];
          if (st === "done") c++;
          if (st === "in-progress") inProgressDsaNodes.push({ title: n.title, section: sectionName });
          if (n.subNodes) traverse(n.subNodes);
        });
      };
      traverse(nodes);
      return { total: t, completed: c };
    };

    const categoryProgress = DSA_ROADMAP_SECTIONS.map((sec) => {
      const name = sec.mainTitle.replace(/^\d+\.\s*/, "");
      const l = gatherNodeStats(sec.leftNodes, name);
      const r = gatherNodeStats(sec.rightNodes, name);
      const tot = l.total + r.total;
      const com = l.completed + r.completed;
      return {
        title: name,
        total: tot,
        completed: com,
        pct: tot > 0 ? Math.round((com / tot) * 100) : 0,
      };
    });

    const totalDsaNodes = categoryProgress.reduce((acc, curr) => acc + curr.total, 0);
    const doneDsaNodes = categoryProgress.reduce((acc, curr) => acc + curr.completed, 0);

    return { totalDsaNodes, doneDsaNodes, inProgressDsaNodes };
  }, [dsaFlowchartStatus]);

  const dsaPct = totalDsaNodes > 0 ? Math.round((doneDsaNodes / totalDsaNodes) * 100) : 0;

  // ── Theory ─────────────────────────────────────────────────────────────
  const { totalTheory, doneTheory, inProgressTheory } = useMemo(() => {
    const inProgressTheory: { title: string; subject: string }[] = [];

    const SUBJECT_MAP: Record<string, string> = {
      "theory-os": "OS",
      "theory-dbms": "DBMS",
      "theory-cn": "CN",
      "theory-oop": "OOP",
      "theory-aptitude": "Aptitude",
    };

    const theorySubjectStats = THEORY_ROADMAP_SECTIONS.map((sec) => {
      const subjectName = SUBJECT_MAP[sec.mainId] || sec.mainTitle;
      let sTotal = 0;
      let sCompleted = 0;

      const traverse = (nodes?: RoadmapNodeItem[]) => {
        nodes?.forEach((n) => {
          sTotal++;
          const st = theoryFlowchartStatus[n.id];
          if (st === "done") {
            sCompleted++;
          }
          if (st === "in-progress") {
            inProgressTheory.push({ title: n.title, subject: subjectName });
          }
          if (n.subNodes) traverse(n.subNodes);
        });
      };

      traverse(sec.leftNodes);
      traverse(sec.rightNodes);

      return {
        subject: subjectName,
        total: sTotal,
        completed: sCompleted,
        percentage: sTotal > 0 ? Math.round((sCompleted / sTotal) * 100) : 0,
      };
    });

    const totalTheory = theorySubjectStats.reduce((acc, curr) => acc + curr.total, 0);
    const doneTheory = theorySubjectStats.reduce((acc, curr) => acc + curr.completed, 0);

    return { totalTheory, doneTheory, inProgressTheory };
  }, [theoryFlowchartStatus]);

  const theoryPct = totalTheory > 0 ? Math.round((doneTheory / totalTheory) * 100) : 0;

  // ── Projects ───────────────────────────────────────────────────────────
  const inProgressProjects = projects.filter((p) => p.status === "in-progress");
  const doneProjects = projects.filter((p) => p.status === "completed").length;

  const { data: dbLeetcodeProfile } = useLeetCodeProfile();

  // ── LeetCode ───────────────────────────────────────────────────────────
  const solvedProblems = problems.filter((p) => p.status === "solved");
  const totalSolved = dbLeetcodeProfile?.totalSolved ?? solvedProblems.length;
  const easy = dbLeetcodeProfile?.easySolved ?? solvedProblems.filter((p) => p.difficulty === "Easy").length;
  const medium = dbLeetcodeProfile?.mediumSolved ?? solvedProblems.filter((p) => p.difficulty === "Medium").length;
  const hard = dbLeetcodeProfile?.hardSolved ?? solvedProblems.filter((p) => p.difficulty === "Hard").length;

  // ── Doubts ─────────────────────────────────────────────────────────────
  const unresolvedDoubts = doubts.filter((d) => !d.resolved);
  const topPendingDoubts = unresolvedDoubts.slice(0, 4);

  return (
    <PageTransition className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 space-y-8">

        {/* ════════════════════════════════════ HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-xblue" />
              <span className="text-[11px] font-extrabold text-xblue uppercase tracking-widest">PrepOS Command Center</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Placement Preparation Overview</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Unified workspace for tracking LeetCode stats, CS core fundamentals, DSA roadmaps, and dev projects.</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="rounded-full border-border text-foreground hover:bg-card text-xs font-bold gap-1.5 px-4 h-8 self-start sm:self-center transition-transform active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-xblue ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh All"}
          </Button>
        </div>

        {/* ════════════════════════════════════ STAT PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <LeetCodeStatPill total={totalSolved} easy={easy} medium={medium} hard={hard} delay={0.05} />
          <StatPill label="DSA Roadmap" value={`${dsaPct}%`} sub={`${doneDsaNodes} / ${totalDsaNodes} nodes`} accent="text-xblue" delay={0.1} />
          <StatPill label="CS Theory" value={`${theoryPct}%`} sub={`${doneTheory} / ${totalTheory} topics`} accent="text-purple-500" delay={0.15} />
          <StatPill label="Projects" value={projects.length} sub={`${doneProjects} completed`} accent="text-emerald-500" delay={0.2} />
        </div>

        {/* ════════════════════════════════════ MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* ── DSA Hub ─────────────────── */}
            <FadeInCard delay={0.25} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
              <SectionHeader
                icon={<div className="h-7 w-7 rounded-xl bg-xblue/10 flex items-center justify-center"><Code2 className="h-4 w-4 text-xblue" /></div>}
                title="DSA Topics In Progress"
                href="/dashboard/dsa"
                accent="text-xblue"
              />

              <div className="flex-1 overflow-y-auto max-h-64 pr-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-background border border-border">
                    <AnimatedProgressBar pct={dsaPct} color="bg-xblue" />
                    <span className="text-xs font-black text-xblue shrink-0">
                      <AnimatedNumber value={dsaPct} />%
                    </span>
                  </div>
                  {inProgressDsaNodes.length === 0 ? (
                    <EmptyState message="No DSA topics in progress yet." hint='Mark any node as "Learning" on the DSA Roadmap.' />
                  ) : (
                    inProgressDsaNodes.slice(0, 6).map((n, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-xblue/20 bg-xblue/5 px-3 py-2.5">
                        <CircleDashed className="h-3.5 w-3.5 text-xblue shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                          <p className="text-[10px] text-muted-foreground">{n.section}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto border-xblue/30 text-xblue bg-xblue/10 text-[10px] font-bold rounded-full shrink-0 px-2">
                          Learning
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </FadeInCard>

            {/* ── Currently Learning: Theory ──────────────── */}
            <FadeInCard delay={0.3} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
              <SectionHeader
                icon={<div className="h-7 w-7 rounded-xl bg-purple-500/10 flex items-center justify-center"><BookOpen className="h-4 w-4 text-purple-500" /></div>}
                title="CS Theory Topics In Progress"
                href="/dashboard/theory"
                accent="text-purple-500"
              />

              {/* mini overall bar */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-background border border-border">
                <AnimatedProgressBar pct={theoryPct} color="bg-purple-500" />
                <span className="text-xs font-black text-purple-500 shrink-0">
                  <AnimatedNumber value={theoryPct} />%
                </span>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto max-h-48 pr-1">
                {inProgressTheory.length === 0 ? (
                  <EmptyState message="No theory topics in progress yet." hint='Mark any node as "Learning" on the CS Theory Roadmap.' />
                ) : (
                  inProgressTheory.slice(0, 6).map((t, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 px-3 py-2.5">
                      <CircleDashed className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{t.title}</p>
                        <p className="text-[10px] text-muted-foreground">{t.subject}</p>
                      </div>
                      <Badge variant="outline" className="ml-auto border-purple-500/30 text-purple-500 bg-purple-500/10 text-[10px] font-bold rounded-full shrink-0 px-2">
                        Learning
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </FadeInCard>

            {/* ── Doubt Queue (NEW) ───────────────────────── */}
            <FadeInCard delay={0.35} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
               <SectionHeader
                icon={<div className="h-7 w-7 rounded-xl bg-rose-500/10 flex items-center justify-center"><HelpCircle className="h-4 w-4 text-rose-500" /></div>}
                title="Doubt Queue"
                href="/dashboard/dsa"
                accent="text-rose-500"
              />

              <div className="flex-1 space-y-3 overflow-y-auto max-h-64 pr-1 min-h-[160px]">
                {topPendingDoubts.length === 0 ? (
                  <EmptyState 
                    message="No doubts queued — nice work" 
                    hint='Go to DSA roadmap to add new targets or doubts.'
                    icon={<CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-80" />}
                  />
                ) : (
                  topPendingDoubts.map((doubt) => (
                    <div key={doubt.id} className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3 hover:border-xblue/50 transition">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-foreground line-clamp-2">{doubt.title}</p>
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold rounded-full shrink-0 ${
                            doubt.priority === "high"
                              ? "border-rose-500/40 text-rose-500 bg-rose-500/10"
                              : doubt.priority === "medium"
                              ? "border-amber-500/40 text-amber-500 bg-amber-500/10"
                              : "border-border text-muted-foreground bg-background"
                          }`}
                        >
                          {doubt.priority === "high" ? "🔥 High" : doubt.priority === "medium" ? "⚡ Med" : "📌 Low"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full border border-border/50">
                          {doubt.type === "leetcode" ? <Code2 className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                          {doubt.topic}
                        </span>
                        {doubt.url && (
                           <a
                           href={doubt.url}
                           target="_blank"
                           rel="noreferrer"
                           className="text-[10px] text-xblue hover:underline flex items-center gap-0.5 font-bold"
                         >
                           Open <ExternalLink className="h-2.5 w-2.5" />
                         </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {unresolvedDoubts.length > 4 && (
                <div className="mt-3 text-center">
                  <Link href="/dashboard/dsa">
                    <span className="text-[10px] font-bold text-muted-foreground hover:text-foreground hover:underline cursor-pointer">
                      +{unresolvedDoubts.length - 4} more pending doubts
                    </span>
                  </Link>
                </div>
              )}
            </FadeInCard>

            {/* ── Active Projects ─────────────────────────── */}
            <FadeInCard delay={0.4} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
              <SectionHeader
                icon={<div className="h-7 w-7 rounded-xl bg-amber-500/10 flex items-center justify-center"><FolderKanban className="h-4 w-4 text-amber-500" /></div>}
                title="Active Projects"
                href="/dashboard/projects"
                accent="text-amber-500"
              />

              {/* mini project stat row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Total", val: projects.length, color: "text-foreground" },
                  { label: "Active", val: inProgressProjects.length, color: "text-amber-500" },
                  { label: "Done", val: doneProjects, color: "text-emerald-500" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="rounded-xl border border-border bg-background p-3 text-center">
                    <p className={`text-lg font-black ${color}`}>
                      <AnimatedNumber value={val} />
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto max-h-48 pr-1">
                {inProgressProjects.length === 0 ? (
                  <EmptyState 
                    message="No active projects yet." 
                    hint='Log a new project and set it as "In Progress".'
                    icon={<FolderKanban className="h-8 w-8 text-amber-500 opacity-80" />}
                    action={
                      <Link href="/dashboard/projects">
                        <Button size="sm" className="rounded-full bg-xblue hover:bg-xhover text-white text-[10px] h-7 px-4">
                          Log Project
                        </Button>
                      </Link>
                    }
                  />
                ) : (
                  inProgressProjects.slice(0, 4).map((proj) => (
                    <div key={proj._id} className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-foreground truncate">{proj.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{proj.techStack?.join(", ")}</p>
                      </div>
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noreferrer"
                          className="text-[10px] text-xblue hover:underline flex items-center gap-0.5 font-bold shrink-0">
                          Repo <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </FadeInCard>

        </div>

      </div>
    </PageTransition>
  );
}
