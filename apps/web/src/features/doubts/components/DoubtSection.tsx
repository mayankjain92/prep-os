"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  Search,
} from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import {
  useDoubts,
  useCreateDoubt,
  useUpdateDoubt,
  useDeleteDoubt,
} from "@/features/doubts/useDoubts";
import { NEETCODE_150_PROBLEMS } from "@/data/neetcode150";
import { DoubtCard } from "./DoubtCard";
import { DoubtFormModal, type DoubtFormData } from "./DoubtFormModal";

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

  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddDoubt = async (data: DoubtFormData) => {
    try {
      await createMutation.mutateAsync(data);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to create doubt:", err);
    }
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

  const filteredDoubts = doubts.filter((d) => {
    if (filter === "unresolved" && d.resolved) return false;
    if (filter === "resolved" && !d.resolved) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchTopic = d.topic.toLowerCase().includes(q);
      const matchNotes = d.notes?.toLowerCase().includes(q);
      return matchTitle || matchTopic || matchNotes;
    }
    return true;
  });

  const unresolvedCount = doubts.filter((d) => !d.resolved).length;
  const resolvedCount = doubts.filter((d) => d.resolved).length;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] py-16 text-center text-sm font-semibold text-slate-400 dark:text-neutral-500 animate-pulse">
        Loading technical doubts queue...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-50/20 dark:bg-rose-950/20 p-6 text-center text-xs text-rose-500">
        Failed to fetch doubts repository. Please refresh or try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-sky-500" />
              Technical Doubts & Weak Spots
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Personalized revision list for tricky DSA questions and theory concepts before interviews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] rounded-xl px-4 py-2.5 items-center shrink-0">
              <div className="text-center">
                <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">
                  Pending
                </div>
                <div className="text-base sm:text-lg font-bold text-amber-500 font-mono">
                  <AnimatedNumber value={unresolvedCount} />
                </div>
              </div>
              <div className="text-center border-l border-slate-200 dark:border-white/[0.06] pl-3">
                <div className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-500 tracking-wider">
                  Mastered
                </div>
                <div className="text-base sm:text-lg font-bold text-emerald-500 font-mono">
                  <AnimatedNumber value={resolvedCount} />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-sm shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Log Doubt</span>
            </button>
          </div>
        </div>
      </section>

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
            <DoubtCard
              key={doubt.id}
              doubt={doubt}
              onToggleResolved={toggleResolved}
              onDelete={handleDelete}
              isUpdating={updateMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      <DoubtFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        canonicalTopics={CANONICAL_TOPICS}
        onSubmit={handleAddDoubt}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
