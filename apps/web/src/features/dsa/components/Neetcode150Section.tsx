"use client";

import React, { useState, useEffect, useMemo } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { NEETCODE_150_PROBLEMS, NeetcodeProblem } from "@/data/neetcode150";
import { useAuth } from "@/features/auth/AuthContext";
import { useSaveNeetcodeProgress } from "@/features/dsa/useProblems";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { AnimatedProgressBar } from "@/components/shared/PageTransition";
import { NeetCodeFilters } from "./NeetCodeFilters";
import { NeetCodeCategoryGroup } from "./NeetCodeCategoryGroup";
import posthog from "posthog-js";

const CATEGORIES = Array.from(
  new Set(NEETCODE_150_PROBLEMS.map((p) => p.category))
);

export function Neetcode150Section() {
  const { user } = useAuth();
  const saveNeetcode = useSaveNeetcodeProgress();
  const userId = user?.id || "guest";
  const solvedKey = `prep_os_neetcode_150_solved_${userId}`;
  const starredKey = `prep_os_neetcode_150_starred_${userId}`;

  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>({});
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

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

      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    Object.keys(map).filter((k) => Boolean(map[k]));

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

    // 2. Direct Backend Persistence
    const solvedList = getActiveArray(newSolvedMap);
    const starredList = getActiveArray(starredMap);
    try {
      await saveNeetcode.mutateAsync({ solved: solvedList, starred: starredList });
    } catch (err) {
      console.error("Failed to save NeetCode progress:", err);
    }
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

    // 2. Direct Backend Persistence
    const solvedList = getActiveArray(solvedMap);
    const starredList = getActiveArray(newStarredMap);
    try {
      await saveNeetcode.mutateAsync({ solved: solvedList, starred: starredList });
    } catch (err) {
      console.error("Failed to save NeetCode starred progress:", err);
    }
  };

  // Toggle open/close individual topic group
  const toggleTopicOpen = (cat: string) => {
    setOpenTopics((prev) => ({
      ...prev,
      [cat]: prev[cat] === undefined ? false : !prev[cat],
    }));
  };

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

  const stats = useMemo(() => {
    const total = NEETCODE_150_PROBLEMS.length;
    let solvedCount = 0;
    let starredCount = 0;
    let easyTotal = 0, easySolved = 0;
    let mediumTotal = 0, mediumSolved = 0;
    let hardTotal = 0, hardSolved = 0;

    NEETCODE_150_PROBLEMS.forEach((p) => {
      const isSolved = Boolean(solvedMap[p.id]);
      const isStarred = Boolean(starredMap[p.id]);

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

      const matchingProblems = categoryProblems.filter((p) => {
        const isSolved = Boolean(solvedMap[p.id]);
        const isStarred = Boolean(starredMap[p.id]);

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
        const solved = categoryProblems.filter((p) => Boolean(solvedMap[p.id])).length;
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
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-sky-500" />
              NeetCode 150 Checklist
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Curated master list of the 150 essential patterns for technical coding interviews.
            </p>
          </div>

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

      <NeetCodeFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categories={CATEGORIES}
        stats={stats}
        onExpandAll={expandAllTopics}
        onCollapseAll={collapseAllTopics}
      />

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
          {groupedTopics.map((group) => (
            <NeetCodeCategoryGroup
              key={group.category}
              category={group.category}
              problems={group.problems}
              total={group.total}
              solved={group.solved}
              percent={group.percent}
              isOpen={openTopics[group.category] !== false}
              onToggleOpen={() => toggleTopicOpen(group.category)}
              solvedMap={solvedMap}
              starredMap={starredMap}
              onToggleSolved={toggleSolved}
              onToggleStarred={toggleStarred}
            />
          ))}
        </div>
      )}
    </div>
  );
}
