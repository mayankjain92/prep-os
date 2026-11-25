"use client";

import React, { useState } from "react";
import { Code, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { safeExternalUrl } from "@/lib/utils";
import type { ProjectItem } from "../api";

export interface ProjectCardProps {
  project: ProjectItem;
  onEdit: (project: ProjectItem) => void;
  onDelete: (id: string) => void;
  onAddTag: (project: ProjectItem, tag: string) => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onAddTag,
}: ProjectCardProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim()) {
      onAddTag(project, tagInput.trim());
      setTagInput("");
    }
    setIsAddingTag(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-5 space-y-3.5 hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col justify-between group shadow-xs dark:shadow-none">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
              <Code className="h-4 w-4 text-sky-500 dark:text-sky-400 shrink-0" />
              <span className="truncate">{project.name}</span>
            </h3>
            {safeExternalUrl(project.repoUrl) && (
              <a
                href={safeExternalUrl(project.repoUrl)!}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center text-xs text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 font-mono transition-colors"
              >
                <span className="truncate max-w-[280px]">
                  {project.repoUrl.replace(/^https?:\/\/github\.com\//, "")}
                </span>
                <ExternalLink className="ml-1 h-3 w-3 shrink-0" />
              </a>
            )}
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 capitalize ${
              project.status === "completed"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : project.status === "planning"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : project.status === "archived"
                    ? "bg-slate-500/10 text-slate-600 dark:text-neutral-400 border border-slate-500/20"
                    : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
            }`}
          >
            {project.status.replace("-", " ")}
          </span>
        </div>

        {project.notes && (
          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed bg-slate-50 dark:bg-[#0e0e0e] p-3 rounded-xl border border-slate-100 dark:border-white/[0.04]">
            {project.notes}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {(project.techStack || []).map((stack) => (
            <span
              key={stack}
              className="rounded-md bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[11px] font-mono font-medium text-sky-600 dark:text-sky-400"
            >
              {stack}
            </span>
          ))}

          {(project.customTags || []).map((tech: string) => (
            <span
              key={tech}
              className="rounded-md bg-slate-100 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] px-2 py-0.5 text-[11px] font-mono font-medium text-slate-700 dark:text-neutral-300"
            >
              {tech}
            </span>
          ))}

          {isAddingTag ? (
            <form onSubmit={handleTagSubmit} className="inline-block">
              <input
                autoFocus
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onBlur={() => setIsAddingTag(false)}
                className="h-6 w-24 text-[10px] px-2 rounded-md bg-slate-50 dark:bg-[#0e0e0e] border border-sky-500 text-slate-900 dark:text-white inline-flex ml-1 focus:outline-none"
                placeholder="Tag..."
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTag(true)}
              className="rounded-md border border-dashed border-slate-300 dark:border-neutral-700 hover:border-slate-500 dark:hover:border-neutral-500 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white transition ml-1 cursor-pointer"
            >
              + Add tag
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-white/[0.06] gap-2">
        <button
          type="button"
          onClick={() => onEdit(project)}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(project._id)}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
