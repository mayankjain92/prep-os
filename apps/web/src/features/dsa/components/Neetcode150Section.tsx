"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ExternalLink,
  Search,
  Trophy,
  Check,
  BookOpen,
  Star,
  ChevronDown,
  ChevronRight,
  Layers,
  Database,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { AnimatedProgressBar } from "@/components/shared/PageTransition";
import { NEETCODE_150_PROBLEMS, NeetcodeProblem } from "@/data/neetcode150";
import { useAuth } from "@/features/auth/AuthContext";
import posthog from "posthog-js";

const CATEGORIES = Array.from(
  new Set(NEETCODE_150_PROBLEMS.map((p) => p.category))
);

export function Neetcode150Section() {
  const { user, saveNeetcodeProgress } = useAuth();
  const userId = user?.id || "guest";
  const solvedKey = `prep_os_neetcode_150_solved_${userId}`;
  const starredKey = `prep_os_neetcode_150_starred_${userId}`;

  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>({});
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unsolved" | "solved" | "starred">("all");

  // Initial load from user profile (MongoDB) & localStorage fallback
  useEffect(() => {
    try {
      const savedSolved = localStorage.getItem(solvedKey);
      const localSolved: Record<string, boolean> = savedSolved ? JSON.parse(savedSolved) : {};

      const savedStarred = localStorage.getItem(starredKey);
      const localStarred: Record<string, boolean> = savedStarred ? JSON.parse(savedStarred) : {};

      const mergedSolved: Record<string, boolean> = { ...localSolved };
      const mergedStarred: Record<string, boolean> = { ...localStarred };

      // Load DB progress from user profile
      if (user?.neetcodeProgress) {
        if (Array.isArray(user.neetcodeProgress.solved)) {
          user.neetcodeProgress.solved.forEach((id) => {
            mergedSolved[id] = true;
          });
        }
        if (Array.isArray(user.neetcodeProgress.starred)) {
          user.neetcodeProgress.starred.forEach((id) => {
            mergedStarred[id] = true;
          });
        }
      }

      setSolvedMap(mergedSolved);
      setStarredMap(mergedStarred);

      if (userId && userId !== "guest") {
        localStorage.setItem(solvedKey, JSON.stringify(mergedSolved));
        localStorage.setItem(starredKey, JSON.stringify(mergedStarred));
      }
    } catch (e) {
      console.error("Failed to load NeetCode 150 state:", e);
    } finally {
      setIsLoaded(true);
    }
  }, [user?.neetcodeProgress, userId, solvedKey, starredKey]);

  // Helper to extract true keys as array
  const getActiveArray = (map: Record<string, boolean>) =>
    Object.keys(map).filter((k) => !!map[k]);

  // Toggle solved state with DB persistence
  const toggleSolved = async (id: string) => {
    const prob = NEETCODE_150_PROBLEMS.find((p) => p.id === id);
    if (!prob) return;

    const nextSolvedState = !solvedMap[id];
    const newSolvedMap = { ...solvedMap, [id]: nextSolvedState };

    // 1. Optimistic Local Update
    setSolvedMap(newSolvedMap);
    localStorage.setItem(solvedKey, JSON.stringify(newSolvedMap));

    if (nextSolvedState) {
      posthog.capture("neetcode_problem_solved", {
        category: prob.category,
        difficulty: prob.difficulty,
        total_solved: getActiveArray(newSolvedMap).length,
      });
    }

    // 2. MongoDB Direct User Update
    const solvedList = getActiveArray(newSolvedMap);
    const starredList = getActiveArray(starredMap);
    await saveNeetcodeProgress(solvedList, starredList);
  };

  // Toggle starred / revision state with DB persistence
  const toggleStarred = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const prob = NEETCODE_150_PROBLEMS.find((p) => p.id === id);
    if (!prob) return;

    const nextStarredState = !starredMap[id];
    const newStarredMap = { ...starredMap, [id]: nextStarredState };

    // 1. Optimistic Local Update
    setStarredMap(newStarredMap);
    localStorage.setItem(starredKey, JSON.stringify(newStarredMap));

    if (nextStarredState) {
      posthog.capture("neetcode_problem_starred", {
        category: prob.category,
        difficulty: prob.difficulty,
      });
    }

    // 2. MongoDB Direct User Update
    const solvedList = getActiveArray(solvedMap);
    const starredList = getActiveArray(newStarredMap);
    await saveNeetcodeProgress(solvedList, starredList);
  };

  // Toggle open/close individual topic group
  const toggleTopicOpen = (cat: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [cat]: prev[cat] === undefined ? false : !prev[cat],
    }));
  };

  // Expand all / Collapse all topics
  const expandAllTopics = () => {
    const allOpen: Record<string, boolean> = {};
    CATEGORIES.forEach((c) => (allOpen[c] = true));
    setOpenTopics(allOpen);
  };

  const collapseAllTopics = () => {
    const allClosed: Record<string, boolean> = {};
    CATEGORIES.forEach((c) => (allClosed[c] = false));
    setOpenTopics(allClosed);
  };

  // Total Stats calculation
  const stats = useMemo(() => {
    const total = NEETCODE_150_PROBLEMS.length;
    let solvedCount = 0;
    let starredCount = 0;
    let easyTotal = 0, easySolved = 0;
    let mediumTotal = 0, mediumSolved = 0;
    let hardTotal = 0, hardSolved = 0;

    NEETCODE_150_PROBLEMS.forEach((p) => {
      const isSolved = !!solvedMap[p.id];
      const isStarred = !!starredMap[p.id];

      if (isSolved) solvedCount++;
      if (isStarred) starredCount++;

      if (p.difficulty === "Easy") {
        easyTotal++;
        if (isSolved) easySolved++;
      } else if (p.difficulty === "Medium") {
        mediumTotal++;
        if (isSolved) mediumSolved++;
      } else if (p.difficulty === "Hard") {
        hardTotal++;
        if (isSolved) hardSolved++;
      }
    });

    const percent = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

    return {
      total,
      solvedCount,
      starredCount,
      percent,
      easyTotal,
      easySolved,
      mediumTotal,
      mediumSolved,
      hardTotal,
      hardSolved,
    };
  }, [solvedMap, starredMap]);

  // Group problems by topic with individual topic stats
  const groupedTopics = useMemo(() => {
    const groups: {
      category: string;
      total: number;
      solved: number;
      percent: number;
      problems: NeetcodeProblem[];
    }[] = [];

    CATEGORIES.forEach((cat) => {
      if (selectedCategory !== "all" && cat !== selectedCategory) return;

      const categoryProblems = NEETCODE_150_PROBLEMS.filter((p) => p.category === cat);

      // Filter category problems based on filters
      const matchingProblems = categoryProblems.filter((p) => {
        const isSolved = !!solvedMap[p.id];
        const isStarred = !!starredMap[p.id];

        if (statusFilter === "solved" && !isSolved) return false;
        if (statusFilter === "unsolved" && isSolved) return false;
        if (statusFilter === "starred" && !isStarred) return false;

        if (selectedDifficulty !== "all" && p.difficulty !== selectedDifficulty) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return p.title.toLowerCase().includes(q);
        }

        return true;
      });

      if (matchingProblems.length > 0) {
        const total = categoryProblems.length;
        const solved = categoryProblems.filter((p) => !!solvedMap[p.id]).length;
        const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

        groups.push({
          category: cat,
          total,
          solved,
          percent,
          problems: matchingProblems,
        });
      }
    });

    return groups;
  }, [selectedCategory, selectedDifficulty, statusFilter, searchQuery, solvedMap, starredMap]);

  if (!isLoaded) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-12 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400 animate-pulse">
        Loading NeetCode 150 practice roadmap...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & KPI Overview */}
      <section
        className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-5 space-y-5 shadow-xs dark:shadow-none"
        data-purpose="neetcode-kpi-banner"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-neutral-900 p-0.5 flex items-center justify-center text-amber-500 shrink-0">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  NeetCode 150 Practice Roadmap
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  150 Curated Problems
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Database className="h-2.5 w-2.5" />
                  DB Synced
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Handpicked problem set covering every core pattern. Track completion, bookmark tricky questions, and sync live to MongoDB.
              </p>
            </div>
          </div>

          <div className="h-px md:h-12 w-full md:w-px bg-slate-200 dark:bg-white/[0.06]" />

          {/* KPI Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] rounded-xl px-5 py-3 items-center shrink-0">
            <div className="text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">
                Completed
              </div>
              <div className="text-lg sm:text-xl font-bold text-sky-600 dark:text-sky-400 font-mono">
                <AnimatedNumber value={stats.solvedCount} />
                <span className="text-xs text-slate-400 dark:text-neutral-500 font-normal"> / {stats.total}</span>
              </div>
            </div>
            <div className="text-center border-l border-slate-200 dark:border-white/[0.06] pl-3 sm:pl-6">
              <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">
                Revision
              </div>
              <div className="text-lg sm:text-xl font-bold text-amber-500 font-mono">
                <AnimatedNumber value={stats.starredCount} />
              </div>
            </div>
            <div className="text-center border-l border-slate-200 dark:border-white/[0.06] pl-3 sm:pl-6">
              <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">
                Progress
              </div>
              <div className="text-lg sm:text-xl font-bold text-emerald-500 font-mono">
                <AnimatedNumber value={stats.percent} />%
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar & Difficulty Sub-gauges */}
        <div className="space-y-3 bg-slate-50 dark:bg-[#0e0e0e] p-4 rounded-xl border border-slate-200 dark:border-white/[0.06]">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              Overall NeetCode Completion
            </span>
            <span className="font-mono text-sky-600 dark:text-sky-400">
              <AnimatedNumber value={stats.solvedCount} /> of {stats.total} Solved ({stats.percent}%)
            </span>
          </div>

          <AnimatedProgressBar
            pct={stats.percent}
            className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden"
            color="bg-sky-500"
          />

          {/* Difficulty breakdown gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="py-2 px-3 rounded-lg bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Easy</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold">
                <AnimatedNumber value={stats.easySolved} /> / {stats.easyTotal}
                <span className="text-[10px] font-normal text-slate-500 dark:text-neutral-400 ml-1.5">
                  ({stats.easyTotal > 0 ? Math.round((stats.easySolved / stats.easyTotal) * 100) : 0}%)
                </span>
              </span>
            </div>

            <div className="py-2 px-3 rounded-lg bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Medium</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold">
                <AnimatedNumber value={stats.mediumSolved} /> / {stats.mediumTotal}
                <span className="text-[10px] font-normal text-slate-500 dark:text-neutral-400 ml-1.5">
                  ({stats.mediumTotal > 0 ? Math.round((stats.mediumSolved / stats.mediumTotal) * 100) : 0}%)
                </span>
              </span>
            </div>

            <div className="py-2 px-3 rounded-lg bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-rose-600 dark:text-rose-400 font-semibold">Hard</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold">
                <AnimatedNumber value={stats.hardSolved} /> / {stats.hardTotal}
                <span className="text-[10px] font-normal text-slate-500 dark:text-neutral-400 ml-1.5">
                  ({stats.hardTotal > 0 ? Math.round((stats.hardSolved / stats.hardTotal) * 100) : 0}%)
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filter & Search Controls */}
      <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-4 space-y-3 shadow-xs dark:shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] p-1 rounded-lg self-start flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white dark:bg-[#1e1e1e] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("unsolved")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "unsolved"
                  ? "bg-white dark:bg-[#1e1e1e] text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Unsolved ({stats.total - stats.solvedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("solved")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "solved"
                  ? "bg-white dark:bg-[#1e1e1e] text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Solved ({stats.solvedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("starred")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === "starred"
                  ? "bg-white dark:bg-[#1e1e1e] text-amber-500 shadow-xs"
                  : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              Revision ({stats.starredCount})
            </button>
          </div>

          {/* Expand / Collapse Actions */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              onClick={expandAllTopics}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] transition cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={collapseAllTopics}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] transition cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Search & Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
          {/* Search Input */}
          <div className="relative sm:col-span-6 lg:col-span-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
            <Input
              autoComplete="off"
              placeholder="Search problem title or pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-slate-50 dark:bg-[#0e0e0e] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white text-xs rounded-lg focus-visible:ring-1 focus-visible:ring-sky-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3 lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0e0e0e] px-3 text-xs font-medium text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="all">All Topics ({CATEGORIES.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="sm:col-span-3 lg:col-span-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0e0e0e] px-3 text-xs font-medium text-slate-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. TOPIC WISE ACCORDION LIST */}
      {groupedTopics.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] space-y-2">
          <BookOpen className="h-8 w-8 text-slate-400 dark:text-neutral-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No questions matched your filters</h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Try adjusting your search terms or clearing the active filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {groupedTopics.map((group) => {
            const isOpen = openTopics[group.category] !== false; // default true

            return (
              <div
                key={group.category}
                className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] overflow-hidden shadow-xs dark:shadow-none transition-all"
              >
                {/* Topic Header Bar */}
                <div
                  onClick={() => toggleTopicOpen(group.category)}
                  className="px-4 py-3 bg-white dark:bg-[#121212] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-center gap-2.5">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-sky-500 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400 dark:text-neutral-500 shrink-0" />
                    )}
                    <Layers className="h-4 w-4 text-slate-400 dark:text-neutral-400 shrink-0" />
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {group.category}
                    </h3>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-white/[0.06]">
                      {group.problems.length} {group.problems.length === 1 ? "problem" : "problems"}
                    </span>
                  </div>

                  {/* Topic Progress Bar */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <div className="w-36 sm:w-48 space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold">
                        <span className="text-slate-500 dark:text-neutral-400">Completion</span>
                        <span className="font-mono text-sky-600 dark:text-sky-400">
                          <AnimatedNumber value={group.solved} />/{group.total} ({group.percent}%)
                        </span>
                      </div>
                      <AnimatedProgressBar
                        pct={group.percent}
                        className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"
                        color="bg-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                {isOpen && (
                  <div className="p-3 pt-2 space-y-2 bg-slate-50/50 dark:bg-[#0e0e0e]/50 border-t border-slate-100 dark:border-white/[0.04]">
                    {group.problems.map((prob) => {
                      const isDone = !!solvedMap[prob.id];
                      const isStarred = !!starredMap[prob.id];

                      return (
                        <div
                          key={prob.id}
                          className={`group rounded-lg border px-3.5 py-2.5 transition-all flex items-center justify-between gap-3 text-xs ${
                            isDone
                              ? "bg-emerald-500/[0.04] dark:bg-emerald-950/20 border-emerald-500/25"
                              : "bg-white dark:bg-[#121212] border-slate-200 dark:border-white/[0.06] hover:border-sky-500/40 hover:shadow-xs"
                          }`}
                        >
                          {/* Checkbox & Problem Title */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => toggleSolved(prob.id)}
                              className={`w-5 h-5 shrink-0 rounded-md flex items-center justify-center transition-all cursor-pointer border ${
                                isDone
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-xs"
                                  : "border-slate-300 dark:border-white/20 bg-white dark:bg-neutral-900 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20"
                              }`}
                              title={isDone ? "Mark as Unsolved" : "Mark as Solved"}
                            >
                              {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </button>

                            <span
                              className={`font-medium truncate text-xs sm:text-sm ${
                                isDone
                                  ? "text-slate-400 dark:text-neutral-500 line-through decoration-slate-300 dark:decoration-neutral-600"
                                  : "text-slate-900 dark:text-white"
                              }`}
                              title={prob.title}
                            >
                              {prob.title}
                            </span>
                          </div>

                          {/* Actions: Revision Star, Difficulty Badge & LeetCode Link */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Star / Revision Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleStarred(prob.id, e)}
                              className={`p-1.5 rounded-md transition cursor-pointer ${
                                isStarred
                                  ? "text-amber-500 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"
                                  : "text-slate-400 dark:text-neutral-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-transparent"
                              }`}
                              title={isStarred ? "Remove from Revision" : "Mark for Revision"}
                            >
                              <Star className={`h-3.5 w-3.5 ${isStarred ? "fill-amber-500" : ""}`} />
                            </button>

                            {/* Clean Difficulty Label - No border, no background/gradient */}
                            <span
                              className={`text-xs font-mono font-medium shrink-0 w-14 text-center ${
                                prob.difficulty === "Easy"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : prob.difficulty === "Medium"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {prob.difficulty}
                            </span>

                            {/* LeetCode Link */}
                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-md text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition"
                              title="Solve on LeetCode"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
