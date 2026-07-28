/* eslint-disable @next/next/no-img-element */
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
  Database
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NEETCODE_150_PROBLEMS, NeetcodeProblem } from "@/data/neetcode150";
import { useAuth } from "@/features/auth/AuthContext";

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
  const [statusFilter] = useState<"all" | "solved" | "unsolved" | "starred">("all");

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

      // eslint-disable-next-line
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

    const percent = Math.round((solvedCount / total) * 100);

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
        const percent = Math.round((solved / total) * 100);

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
      <div className="text-center py-8 text-xs font-semibold text-muted-foreground animate-pulse">
        Loading NeetCode 150 tracker...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner & Stats */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-black text-foreground">NeetCode 150 Roadmap</h2>
              <Badge className="bg-xblue/10 text-xblue border border-xblue/20 font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                Curated 150
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-extrabold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Database className="h-2.5 w-2.5" /> DB Synced
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Topic-wise grouped DSA questions synced live with your MongoDB database & LeetCode profile.
            </p>
          </div>

          {/* Solved Stats Counter */}
          <div className="flex items-center gap-3 bg-background px-3.5 py-1.5 rounded-xl border border-border shadow-2xs">
            <div className="text-center">
              <div className="text-[9px] uppercase font-extrabold text-muted-foreground">Completed</div>
              <div className="text-base font-black text-xblue">
                {stats.solvedCount} <span className="text-[10px] font-bold text-muted-foreground">/ {stats.total}</span>
              </div>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-center">
              <div className="text-[9px] uppercase font-extrabold text-muted-foreground">For Revision</div>
              <div className="text-base font-black text-amber-500">{stats.starredCount}</div>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-center">
              <div className="text-[9px] uppercase font-extrabold text-muted-foreground">Progress</div>
              <div className="text-base font-black text-emerald-500">{stats.percent}%</div>
            </div>
          </div>
        </div>

        {/* Section Progress Tracker Bar */}
        <div className="space-y-1.5 bg-background p-3 rounded-xl border border-border">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-foreground flex items-center gap-1.5">
              <img src="/logo.svg" alt="PrepOS Logo" className="h-3.5 w-3.5 object-contain" /> Overall Completion Progress
            </span>
            <span className="text-xblue">{stats.solvedCount} of 150 Solved ({stats.percent}%)</span>
          </div>

          <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-border p-0.5 flex">
            <div
              className="h-full bg-gradient-to-r from-xblue via-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>

          {/* Difficulty breakdown gauges */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
            <div className="py-1 px-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-center flex items-center justify-between">
              <span className="text-emerald-500 font-extrabold">Easy</span>
              <span className="text-foreground font-black">
                {stats.easySolved} / {stats.easyTotal}
              </span>
            </div>

            <div className="py-1 px-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-center flex items-center justify-between">
              <span className="text-amber-500 font-extrabold">Medium</span>
              <span className="text-foreground font-black">
                {stats.mediumSolved} / {stats.mediumTotal}
              </span>
            </div>

            <div className="py-1 px-2 rounded-md bg-rose-500/10 border border-rose-500/20 text-center flex items-center justify-between">
              <span className="text-rose-500 font-extrabold">Hard</span>
              <span className="text-foreground font-black">
                {stats.hardSolved} / {stats.hardTotal}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-card p-3 rounded-xl border border-border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search problem title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-7 bg-background border-border text-foreground text-xs rounded-full"
          />
        </div>

        {/* Filters & Expand/Collapse Toggle */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-7 rounded-full border border-border bg-background px-2.5 text-[11px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-xblue"
          >
            <option value="all">All Topics ({CATEGORIES.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="h-7 rounded-full border border-border bg-background px-2.5 text-[11px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-xblue"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Hard">Hard Only</option>
          </select>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Expand / Collapse buttons */}
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <button
              onClick={expandAllTopics}
              className="px-2 py-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border transition"
            >
              Expand All
            </button>
            <button
              onClick={collapseAllTopics}
              className="px-2 py-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border transition"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* TOPIC WISE GROUPED LIST VIEW */}
      {groupedTopics.length === 0 ? (
        <div className="text-center py-8 bg-card rounded-xl border border-border space-y-1">
          <BookOpen className="h-7 w-7 text-muted-foreground mx-auto" />
          <h3 className="text-xs font-black text-foreground">No questions found</h3>
          <p className="text-[11px] text-muted-foreground">Try clearing filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
          {groupedTopics.map((group) => {
            const isOpen = openTopics[group.category] !== false; // default true

            return (
              <div key={group.category} className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
                {/* TOPIC HEADER BAR WITH TOPIC PROGRESS BAR */}
                <div
                  onClick={() => toggleTopicOpen(group.category)}
                  className="px-3.5 py-2.5 bg-card hover:bg-background/60 border-b border-border/60 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 select-none"
                >
                  <div className="flex items-center gap-2">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-xblue shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <Layers className="h-4 w-4 text-xblue shrink-0" />
                    <h3 className="text-xs font-black text-foreground">{group.category}</h3>
                    <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 rounded-full border-border">
                      {group.problems.length} {group.problems.length === 1 ? "problem" : "problems"}
                    </Badge>
                  </div>

                  {/* TOPIC MINI PROGRESS BAR */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <div className="w-36 sm:w-44 space-y-0.5">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-muted-foreground">Topic Progress</span>
                        <span className="text-xblue">{group.solved}/{group.total} ({group.percent}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-background rounded-full overflow-hidden border border-border p-0.2">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${group.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* TOPIC QUESTIONS LIST */}
                {isOpen && (
                  <div className="p-2.5 space-y-1.5 bg-background/30">
                    {group.problems.map((prob) => {
                      const isDone = !!solvedMap[prob.id];
                      const isStarred = !!starredMap[prob.id];

                      return (
                        <div
                          key={prob.id}
                          className={`group rounded-lg border py-2 px-3.5 transition-all duration-150 flex items-center justify-between gap-3 text-xs ${
                            isDone
                              ? "bg-emerald-500/5 border-emerald-500/25"
                              : "bg-card border-border hover:border-xblue/40"
                          }`}
                        >
                          {/* Checkbox & Problem Info */}
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <button
                              onClick={() => toggleSolved(prob.id)}
                              className={`h-4.5 w-4.5 shrink-0 rounded flex items-center justify-center transition cursor-pointer border ${
                                isDone
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-border hover:border-xblue bg-background"
                              }`}
                              title={isDone ? "Mark Unsolved" : "Mark Solved"}
                            >
                              {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            </button>

                            <span
                              className={`font-bold truncate text-xs sm:text-sm ${
                                isDone ? "text-muted-foreground line-through font-normal" : "text-foreground"
                              }`}
                              title={prob.title}
                            >
                              {prob.title}
                            </span>
                          </div>

                          {/* Right side: Revision Star, Difficulty Badge & LeetCode link */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* REVISION MARK / STAR BUTTON */}
                            <button
                              onClick={(e) => toggleStarred(prob.id, e)}
                              className={`p-1 rounded transition cursor-pointer ${
                                isStarred
                                  ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
                                  : "text-muted-foreground/40 hover:text-amber-400 hover:bg-amber-400/10"
                              }`}
                              title={isStarred ? "Remove Revision Mark" : "Mark for Revision"}
                            >
                              <Star className={`h-4 w-4 ${isStarred ? "fill-amber-400" : ""}`} />
                            </button>

                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold rounded-full py-0.5 px-2 h-5 border ${
                                prob.difficulty === "Easy"
                                  ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                                  : prob.difficulty === "Medium"
                                  ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                                  : "border-rose-500/30 text-rose-500 bg-rose-500/10"
                              }`}
                            >
                              {prob.difficulty}
                            </Badge>

                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-muted-foreground hover:text-xblue hover:bg-xblue/10 transition"
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
