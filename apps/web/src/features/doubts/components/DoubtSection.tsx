"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Code2,
  BookOpen,
  Search,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import {
  useDoubts,
  useCreateDoubt,
  useUpdateDoubt,
  useDeleteDoubt,
} from "@/features/doubts/useDoubts";
import type { DoubtType, PriorityLevel } from "@/features/doubts/api";
import { NEETCODE_150_PROBLEMS } from "@/data/neetcode150";

const CANONICAL_TOPICS = [
  ...Array.from(new Set(NEETCODE_150_PROBLEMS.map((p) => p.category))),
  "Operating Systems",
  "DBMS",
  "Computer Networks",
  "OOP & Design",
  "Aptitude",
  "General",
];

export function DoubtSection() {
  const { data: doubts = [], isLoading, error } = useDoubts();
  const createMutation = useCreateDoubt();
  const updateMutation = useUpdateDoubt();
  const deleteMutation = useDeleteDoubt();

  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DoubtType>("leetcode");
  const [topic, setTopic] = useState(CANONICAL_TOPICS[0] || "Arrays & Hashing");
  const [url, setUrl] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [notes, setNotes] = useState("");

  // Dismiss on Escape key
  useEffect(() => {
    if (!isFormOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFormOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen]);

  const handleAddDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createMutation.mutate({
      title: title.trim(),
      type,
      topic: topic.trim() || "General",
      url: url.trim() || undefined,
      priority,
      notes: notes.trim() || undefined,
    });

    // Reset Form
    setTitle("");
    setUrl("");
    setNotes("");
    setIsFormOpen(false);
  };

  const toggleResolved = (id: string, currentResolved: boolean) => {
    updateMutation.mutate({
      id,
      data: { resolved: !currentResolved },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Filtered List
  const filteredDoubts = doubts.filter((d) => {
    if (filter === "unresolved" && d.resolved) return false;
    if (filter === "resolved" && !d.resolved) return false;
    if (
      searchQuery.trim() &&
      !d.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.topic.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const unresolvedCount = doubts.filter((d) => !d.resolved).length;
  const resolvedCount = doubts.filter((d) => d.resolved).length;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-12 text-center text-xs font-semibold text-slate-500 dark:text-neutral-400 animate-pulse">
        Loading Doubt Queue...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-xs font-semibold text-rose-600 dark:text-rose-400">
        Error loading doubts: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* BEGIN: Doubts KPI & Quick Action Banner */}
      <section
        className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs dark:shadow-none"
        data-purpose="doubts-kpi-banner"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-neutral-900 p-0.5 flex items-center justify-center text-amber-500 shrink-0">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-semibold text-slate-900 dark:text-white">
                Active Revision Queue
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
              Flagged questions, edge cases, and tricky concepts waiting for
              second-pass review
            </p>
          </div>
        </div>

        <div className="h-px md:h-12 w-full md:w-px bg-slate-200 dark:bg-white/[0.06]" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] rounded-xl px-6 py-3 items-center">
            <div className="text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">
                Total
              </div>
              <div className="text-xl font-bold text-sky-600 dark:text-sky-400 font-mono">
                <AnimatedNumber value={doubts.length} />
              </div>
            </div>
            <div className="text-center border-l border-slate-200 dark:border-white/[0.06] pl-3 sm:pl-6">
              <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">
                Pending
              </div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                <AnimatedNumber value={unresolvedCount} />
              </div>
            </div>
            <div className="text-center border-l border-slate-200 dark:border-white/[0.06] pl-3 sm:pl-6">
              <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">
                Resolved
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                <AnimatedNumber value={resolvedCount} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-sm shadow-sky-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Log Doubt</span>
          </button>
        </div>
      </section>
      {/* END: Doubts KPI Banner */}

      {/* BEGIN: Log Doubt Modal Popup with Blur Background */}
      <AnimatePresence>
        {isFormOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsFormOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="doubt-modal-title"
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] shadow-2xl flex flex-col max-h-[90vh] text-slate-800 dark:text-neutral-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#161616] px-6 py-4.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3
                      id="doubt-modal-title"
                      className="text-base font-bold text-slate-900 dark:text-white"
                    >
                      Log a New Doubt or Target Problem
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Add tricky questions, edge cases, and concepts to your
                      revision queue
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800/60 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form
                onSubmit={handleAddDoubt}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-neutral-300">
                        Doubt Title / Problem Name *
                      </label>
                      <input
                        autoComplete="off"
                        placeholder="e.g. LeetCode 215 - Kth Largest Element or LRU Cache Eviction"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-neutral-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-neutral-300">
                        Category Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as DoubtType)}
                        className="w-full bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-neutral-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                      >
                        <option value="leetcode">LeetCode Question</option>
                        <option value="topic">Core Topic / Concept</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-neutral-300">
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) =>
                          setPriority(e.target.value as PriorityLevel)
                        }
                        className="w-full bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-neutral-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-neutral-300">
                        Topic Tag *
                      </label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-neutral-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                      >
                        {CANONICAL_TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-neutral-300">
                        Problem / Resource URL (Optional)
                      </label>
                      <input
                        autoComplete="off"
                        placeholder="https://leetcode.com/problems/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-neutral-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-neutral-600"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-neutral-300">
                        Notes / Sticking Points
                      </label>
                      <textarea
                        autoComplete="off"
                        rows={3}
                        placeholder="Describe why you got stuck, edge cases that failed, or what approach to test..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-neutral-200 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-neutral-600 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#161616]/50">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0e0e0e] text-xs font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-sm shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {createMutation.isPending
                      ? "Saving..."
                      : "Save Doubt to Queue"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* END: Log Doubt Modal Popup */}

      {/* BEGIN: Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#121212] p-3 rounded-xl border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-none">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-neutral-500" />
          <input
            type="text"
            autoComplete="off"
            placeholder="Search doubts or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] text-xs text-slate-900 dark:text-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400 dark:placeholder:text-neutral-600"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] rounded-xl self-start sm:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filter === "all"
                ? "bg-sky-500 text-white shadow-sm shadow-sky-500/20"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All ({doubts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unresolved")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filter === "unresolved"
                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Pending ({unresolvedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("resolved")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filter === "resolved"
                ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>
      </div>
      {/* END: Filter & Search Bar */}

      {/* BEGIN: Doubts Grid */}
      {filteredDoubts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/[0.08] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-white/[0.06] flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {filter === "resolved"
              ? "No resolved doubts yet"
              : filter === "unresolved"
                ? "All doubts resolved!"
                : "No doubts found"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto">
            {filter === "unresolved"
              ? "Great job! All logged items have been mastered. Click 'Log Doubt' to add new questions."
              : "Use '+ Log Doubt' to queue tricky DSA problems or CS Theory concepts for revision."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoubts.map((doubt) => (
            <article
              key={doubt.id}
              className={`rounded-xl border p-5 transition-all flex flex-col justify-between gap-4 shadow-xs dark:shadow-none group ${
                doubt.resolved
                  ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 hover:border-emerald-500/50"
                  : "border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] hover:border-slate-300 dark:hover:border-white/[0.16]"
              }`}
            >
              <div className="space-y-3">
                {/* Top Badges & Delete */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Type badge */}
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

                    {/* Topic badge */}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/[0.08]">
                      {doubt.topic}
                    </span>

                    {/* Priority badge */}
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
                    onClick={() => handleDelete(doubt.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                    title="Delete Doubt"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Title */}
                <h3
                  className={`text-sm sm:text-base font-bold tracking-tight ${
                    doubt.resolved
                      ? "text-slate-600 dark:text-neutral-400 line-through"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {doubt.title}
                </h3>

                {/* Notes */}
                {doubt.notes && (
                  <p className="text-xs text-slate-600 dark:text-neutral-300 bg-slate-50 dark:bg-[#0e0e0e] p-3 rounded-xl border border-slate-200 dark:border-white/[0.06] leading-relaxed whitespace-pre-wrap">
                    {doubt.notes}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/[0.06] gap-2">
                {doubt.url ? (
                  <a
                    href={doubt.url}
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
                  onClick={() => toggleResolved(doubt.id, doubt.resolved)}
                  disabled={updateMutation.isPending}
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
          ))}
        </div>
      )}
      {/* END: Doubts Grid */}
    </div>
  );
}
