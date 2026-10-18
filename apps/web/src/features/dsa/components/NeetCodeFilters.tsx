"use client";

import React from "react";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";

export interface NeetCodeFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (diff: string) => void;
  statusFilter: "all" | "unsolved" | "solved" | "starred";
  onStatusFilterChange: (status: "all" | "unsolved" | "solved" | "starred") => void;
  categories: string[];
  stats: {
    total: number;
    solvedCount: number;
    starredCount: number;
  };
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function NeetCodeFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  statusFilter,
  onStatusFilterChange,
  categories,
  stats,
  onExpandAll,
  onCollapseAll,
}: NeetCodeFiltersProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-4 space-y-3 shadow-xs dark:shadow-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] p-1 rounded-lg self-start flex-wrap">
          <button
            type="button"
            onClick={() => onStatusFilterChange("all")}
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
            onClick={() => onStatusFilterChange("unsolved")}
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
            onClick={() => onStatusFilterChange("solved")}
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
            onClick={() => onStatusFilterChange("starred")}
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

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            onClick={onExpandAll}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] transition cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={onCollapseAll}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] transition cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
        <div className="relative sm:col-span-6 lg:col-span-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-neutral-500" />
          <Input
            autoComplete="off"
            placeholder="Search problem title or pattern..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-slate-50 dark:bg-[#0e0e0e] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white text-xs rounded-lg focus-visible:ring-1 focus-visible:ring-sky-500"
          />
        </div>

        <div className="sm:col-span-3 lg:col-span-3">
          <CustomSelect
            value={selectedCategory}
            onChange={onCategoryChange}
            options={[
              { value: "all", label: `All Topics (${categories.length})` },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
          />
        </div>

        <div className="sm:col-span-3 lg:col-span-3">
          <CustomSelect
            value={selectedDifficulty}
            onChange={onDifficultyChange}
            options={[
              { value: "all", label: "All Difficulties" },
              {
                value: "Easy",
                label: "Easy",
                badge: (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                ),
              },
              {
                value: "Medium",
                label: "Medium",
                badge: (
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                ),
              },
              {
                value: "Hard",
                label: "Hard",
                badge: (
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
