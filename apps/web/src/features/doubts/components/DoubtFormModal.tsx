"use client";

import React, { useState } from "react";
import { HelpCircle, Code2, BookOpen } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { CustomSelect } from "@/components/ui/custom-select";
import type { DoubtType, PriorityLevel } from "../api";

export interface DoubtFormData {
  title: string;
  type: DoubtType;
  topic: string;
  url?: string;
  priority: PriorityLevel;
  notes?: string;
}

export interface DoubtFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  canonicalTopics: string[];
  onSubmit: (data: DoubtFormData) => void;
  isPending: boolean;
}

export function DoubtFormModal({
  isOpen,
  onClose,
  canonicalTopics,
  onSubmit,
  isPending,
}: DoubtFormModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DoubtType>("leetcode");
  const [topic, setTopic] = useState(canonicalTopics[0] || "Arrays & Hashing");
  const [url, setUrl] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      type,
      topic: topic.trim() || "General",
      url: url.trim() || undefined,
      priority,
      notes: notes.trim() || undefined,
    });

    setTitle("");
    setUrl("");
    setNotes("");
  };

  const titleNode = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
        <HelpCircle className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Log Technical Doubt / Sticking Point
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400">
          Save problem patterns or theory concepts for deep revision
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titleNode}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="p-6 space-y-4.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                Doubt Title / Problem Name *
              </label>
              <input
                autoComplete="off"
                placeholder="e.g. LeetCode 215 - Kth Largest Element or LRU Cache Eviction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full h-10 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-neutral-200 text-xs rounded-xl px-3.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder:text-slate-400 dark:placeholder:text-neutral-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                Category Type
              </label>
              <div className="grid grid-cols-2 gap-2 h-10 p-1 bg-slate-100 dark:bg-[#0e0e0e] rounded-xl border border-slate-200 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setType("leetcode")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    type === "leetcode"
                      ? "bg-white dark:bg-neutral-800 text-sky-600 dark:text-sky-400 shadow-xs font-semibold"
                      : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>LeetCode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType("topic")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    type === "topic"
                      ? "bg-white dark:bg-neutral-800 text-purple-600 dark:text-purple-400 shadow-xs font-semibold"
                      : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Concept</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-1.5 h-10 p-1 bg-slate-100 dark:bg-[#0e0e0e] rounded-xl border border-slate-200 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setPriority("high")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    priority === "high"
                      ? "bg-white dark:bg-neutral-800 text-rose-600 dark:text-rose-400 shadow-xs font-semibold"
                      : "text-slate-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>High</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("medium")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    priority === "medium"
                      ? "bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 shadow-xs font-semibold"
                      : "text-slate-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Med</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("low")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    priority === "low"
                      ? "bg-white dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 shadow-xs font-semibold"
                      : "text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span>Low</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                Topic Tag *
              </label>
              <CustomSelect
                value={topic}
                onChange={setTopic}
                options={canonicalTopics}
                placeholder="Select topic..."
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                Problem / Resource URL (Optional)
              </label>
              <input
                autoComplete="off"
                placeholder="https://leetcode.com/problems/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full h-10 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-neutral-200 text-xs rounded-xl px-3.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder:text-slate-400 dark:placeholder:text-neutral-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                Notes / Sticking Points
              </label>
              <textarea
                autoComplete="off"
                rows={3}
                placeholder="Describe why you got stuck, edge cases that failed, or what approach to test..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-neutral-200 text-xs rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 placeholder:text-slate-400 dark:placeholder:text-neutral-600 resize-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#161616]/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0e0e0e] text-xs font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-sm shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Doubt to Queue"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
