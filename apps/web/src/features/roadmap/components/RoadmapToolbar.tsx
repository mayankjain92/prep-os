"use client";

import React from "react";
import { Sparkles, ChevronsUpDown } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { AnimatedProgressBar } from "@/components/shared/PageTransition";
import type { FilterType } from "../tree-algorithms";

interface RoadmapToolbarProps {
  title: string;
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  totalCount: number;
  doneCount: number;
  inProgressCount: number;
  pendingCount: number;
  progressPercentage: number;
  hasSubNodes: boolean;
  allCollapsed: boolean;
  onToggleAll: () => void;
}

export function RoadmapToolbar({
  title,
  filter,
  onFilterChange,
  totalCount,
  doneCount,
  inProgressCount,
  pendingCount,
  progressPercentage,
  hasSubNodes,
  allCollapsed,
  onToggleAll,
}: RoadmapToolbarProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-slate-100 dark:border-white/[0.06]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-neutral-400">
          Visual interactive tree: click any node box to toggle status (○ Pending → ◉ Learning → ● Done).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 flex-wrap">
        <div
          className="inline-flex items-center gap-1 bg-slate-100 dark:bg-[#0e0e0e] p-1 rounded-xl border border-slate-200 dark:border-white/[0.06] flex-wrap"
          role="tablist"
        >
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            role="tab"
            aria-selected={filter === "all"}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
              filter === "all"
                ? "bg-white dark:bg-neutral-800 text-slate-900 dark:text-white border-slate-200 dark:border-white/10 shadow-xs font-semibold"
                : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.04]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-neutral-400 shrink-0" />
            <span>All</span>
            <span className="text-[10px] font-mono opacity-80">
              (<AnimatedNumber value={totalCount} />)
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange("done")}
            role="tab"
            aria-selected={filter === "done"}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
              filter === "done"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-xs font-semibold"
                : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-white/[0.04]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" />
            <span>Done</span>
            <span className="text-[10px] font-mono opacity-80">
              (<AnimatedNumber value={doneCount} />)
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange("in-progress")}
            role="tab"
            aria-selected={filter === "in-progress"}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
              filter === "in-progress"
                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30 shadow-xs font-semibold"
                : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/60 dark:hover:bg-white/[0.04]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 shrink-0" />
            <span>Learning</span>
            <span className="text-[10px] font-mono opacity-80">
              (<AnimatedNumber value={inProgressCount} />)
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange("pending")}
            role="tab"
            aria-selected={filter === "pending"}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
              filter === "pending"
                ? "bg-slate-200/80 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 border-slate-300 dark:border-neutral-700 shadow-xs font-semibold"
                : "border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-300 hover:bg-white/60 dark:hover:bg-white/[0.04]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-neutral-500 shrink-0" />
            <span>Pending</span>
            <span className="text-[10px] font-mono opacity-80">
              (<AnimatedNumber value={pendingCount} />)
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
          {hasSubNodes && (
            <button
              type="button"
              onClick={onToggleAll}
              className="px-2 py-1 rounded-lg text-[11px] font-medium inline-flex items-center gap-1 transition-all cursor-pointer border border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-[#0e0e0e] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white shadow-2xs"
              title={allCollapsed ? "Expand all sub-topics" : "Collapse all sub-topics"}
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              <span>{allCollapsed ? "Expand All" : "Collapse All"}</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/[0.02] px-2.5 py-1 rounded-lg border border-slate-200/70 dark:border-white/[0.06]">
            <AnimatedProgressBar
              pct={progressPercentage}
              color="bg-sky-500 dark:bg-sky-400"
              className="w-16 sm:w-20 bg-slate-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden"
            />
            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 font-mono whitespace-nowrap">
              <AnimatedNumber value={progressPercentage} />% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
