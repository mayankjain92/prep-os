"use client";

import React, { useState } from "react";
import { FolderKanban } from "lucide-react";
import { Modal } from "@/components/ui/modal";

import type { ProjectItem } from "../api";

export interface ProjectFormData {
  name: string;
  repoUrl: string;
  notes: string;
  customTags: string[];
  status: ProjectItem["status"];
}

export interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  isPending: boolean;
}

interface ProjectFormInnerProps {
  isEditing: boolean;
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  onClose: () => void;
  isPending: boolean;
}

function ProjectFormInner({
  isEditing,
  initialData,
  onSubmit,
  onClose,
  isPending,
}: ProjectFormInnerProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repoUrl || "");
  const [techStackInput, setTechStackInput] = useState(
    (initialData?.customTags || []).join(", ")
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [status, setStatus] = useState<ProjectItem["status"]>(
    initialData?.status || "in-progress"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const customTags = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      name: name.trim(),
      repoUrl: repoUrl.trim(),
      notes: notes.trim(),
      customTags,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="p-6 space-y-4.5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300">
              Project Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Prep OS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 text-xs rounded-xl px-3.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300">
              Repo URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full h-10 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 text-xs rounded-xl px-3.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300">
              Tech Stack Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="Next.js, Node.js, Express, Redis, MongoDB"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              className="w-full h-10 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 text-xs rounded-xl px-3.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300">
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectItem["status"])}
              className="w-full h-10 bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white text-xs rounded-xl px-3.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-neutral-300">
            Architecture Notes / Key Achievements
          </label>
          <textarea
            rows={3}
            placeholder="System design key points, performance benchmarks, challenging problems solved..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 text-xs rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none"
          />
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
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow-sm shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-60"
        >
          {isEditing ? "Update Project" : "Save Project"}
        </button>
      </div>
    </form>
  );
}

export function ProjectFormModal({
  isOpen,
  onClose,
  isEditing,
  initialData,
  onSubmit,
  isPending,
}: ProjectFormModalProps) {
  const titleNode = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
        <FolderKanban className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {isEditing ? "Edit Project" : "Log New Engineering Project"}
        </h3>
        <p className="text-xs text-slate-500 dark:text-neutral-400">
          {isEditing
            ? "Update tech stack, architecture notes, and repository info"
            : "Track technical achievements, tech stack tags, and repository links"}
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
      <ProjectFormInner
        key={initialData?.name || "new-project"}
        isEditing={isEditing}
        initialData={initialData}
        onSubmit={onSubmit}
        onClose={onClose}
        isPending={isPending}
      />
    </Modal>
  );
}
