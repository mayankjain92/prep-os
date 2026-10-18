"use client";

import React from "react";
import { ChevronDown, ChevronRight, Layers, Check, Star, ExternalLink } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { AnimatedProgressBar } from "@/components/shared/PageTransition";
import type { NeetcodeProblem } from "@/data/neetcode150";

export interface NeetCodeCategoryGroupProps {
  category: string;
  problems: NeetcodeProblem[];
  total: number;
  solved: number;
  percent: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  solvedMap: Record<string, boolean>;
  starredMap: Record<string, boolean>;
  onToggleSolved: (id: string) => void;
  onToggleStarred: (id: string, e: React.MouseEvent) => void;
}

export function NeetCodeCategoryGroup({
  category,
  problems,
  total,
  solved,
  percent,
  isOpen,
  onToggleOpen,
  solvedMap,
  starredMap,
  onToggleSolved,
  onToggleStarred,
}: NeetCodeCategoryGroupProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] overflow-hidden shadow-xs dark:shadow-none transition-all">
      <div
        onClick={onToggleOpen}
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
            {category}
          </h3>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-white/[0.06]">
            {problems.length} {problems.length === 1 ? "problem" : "problems"}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <div className="w-36 sm:w-48 space-y-1">
            <div className="flex justify-between text-[10px] font-semibold">
              <span className="text-slate-500 dark:text-neutral-400">Completion</span>
              <span className="font-mono text-sky-600 dark:text-sky-400">
                <AnimatedNumber value={solved} />/{total} ({percent}%)
              </span>
            </div>
            <AnimatedProgressBar
              pct={percent}
              className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"
              color="bg-sky-500"
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="p-3 pt-2 space-y-2 bg-slate-50/50 dark:bg-[#0e0e0e]/50 border-t border-slate-100 dark:border-white/[0.04]">
          {problems.map((prob) => {
            const isDone = Boolean(solvedMap[prob.id]);
            const isStarred = Boolean(starredMap[prob.id]);

            return (
              <div
                key={prob.id}
                className={`group rounded-lg border px-3.5 py-2.5 transition-all flex items-center justify-between gap-3 text-xs ${
                  isDone
                    ? "bg-emerald-500/[0.04] dark:bg-emerald-950/20 border-emerald-500/25"
                    : "bg-white dark:bg-[#121212] border-slate-200 dark:border-white/[0.06] hover:border-sky-500/40 hover:shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onToggleSolved(prob.id)}
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

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => onToggleStarred(prob.id, e)}
                    className={`p-1.5 rounded-md transition cursor-pointer ${
                      isStarred
                        ? "text-amber-500 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"
                        : "text-slate-400 dark:text-neutral-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-transparent"
                    }`}
                    title={isStarred ? "Remove from Revision" : "Mark for Revision"}
                  >
                    <Star className={`h-3.5 w-3.5 ${isStarred ? "fill-amber-500" : ""}`} />
                  </button>

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
}
