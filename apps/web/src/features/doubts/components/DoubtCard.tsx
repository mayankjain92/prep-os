"use client";

import React from "react";
import { CheckCircle2, Trash2, ExternalLink, Code2, BookOpen } from "lucide-react";
import { safeExternalUrl } from "@/lib/utils";
import type { DoubtItem } from "../api";

export interface DoubtCardProps {
  doubt: DoubtItem;
  onToggleResolved: (id: string, currentResolved: boolean) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function DoubtCard({
  doubt,
  onToggleResolved,
  onDelete,
  isUpdating,
  isDeleting,
}: DoubtCardProps) {
  return (
    <article
      className={`rounded-xl border p-5 transition-all flex flex-col justify-between gap-4 shadow-xs dark:shadow-none group ${
        doubt.resolved
          ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 hover:border-emerald-500/50"
          : "border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] hover:border-slate-300 dark:hover:border-white/[0.16]"
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                doubt.type === "leetcode"
                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
              }`}
            >
              {doubt.type === "leetcode" ? (
                <>
                  <Code2 className="h-3 w-3" />
                  LeetCode
                </>
              ) : (
                <>
                  <BookOpen className="h-3 w-3" />
                  Concept
                </>
              )}
            </span>

            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/[0.08]">
              {doubt.topic}
            </span>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                doubt.priority === "high"
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  : doubt.priority === "medium"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : "bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-white/[0.08]"
              }`}
            >
              {doubt.priority === "high"
                ? "High Priority"
                : doubt.priority === "medium"
                ? "Medium Priority"
                : "Low Priority"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onDelete(doubt.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Delete Doubt"
            disabled={isDeleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <h3
          className={`text-sm sm:text-base font-bold tracking-tight ${
            doubt.resolved
              ? "text-slate-600 dark:text-neutral-400 line-through"
              : "text-slate-900 dark:text-white"
          }`}
        >
          {doubt.title}
        </h3>

        {doubt.notes && (
          <p className="text-xs text-slate-600 dark:text-neutral-300 bg-slate-50 dark:bg-[#0e0e0e] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06] leading-relaxed whitespace-pre-wrap">
            {doubt.notes}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/[0.06] gap-2">
        {safeExternalUrl(doubt.url) ? (
          <a
            href={safeExternalUrl(doubt.url)!}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open Problem</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-[11px] text-slate-400 dark:text-neutral-500">
            No link attached
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggleResolved(doubt.id, doubt.resolved)}
          disabled={isUpdating}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            doubt.resolved
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-800 dark:text-neutral-200 border border-slate-200 dark:border-white/[0.08]"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{doubt.resolved ? "Mastered" : "Mark Resolved"}</span>
        </button>
      </div>
    </article>
  );
}
