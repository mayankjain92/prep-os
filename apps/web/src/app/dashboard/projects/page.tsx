"use client";

import React, { useState, useMemo } from "react";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/features/projects/useProjects";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { GitHubSyncModal, type GitHubRepo } from "@/features/projects/components/GitHubSyncModal";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { ProjectFormModal, type ProjectFormData } from "@/features/projects/components/ProjectFormModal";
import type { ProjectItem } from "@/features/projects/api";
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Search,
} from "lucide-react";
import posthog from "posthog-js";

function GitHubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function ProjectsDashboardPage() {
  const { data: projects = [], isPending } = useProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [importNotification, setImportNotification] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectItem["status"]>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      if (editingProject) {
        await updateMutation.mutateAsync({
          id: editingProject._id,
          data: {
            name: data.name,
            customTags: data.customTags,
            status: data.status,
            repoUrl: data.repoUrl,
            notes: data.notes,
          },
        });
        setEditingProject(null);
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          customTags: data.customTags,
          status: data.status,
          repoUrl: data.repoUrl,
          notes: data.notes,
        });
        posthog.capture("project_created", {
          has_repo_url: Boolean(data.repoUrl),
          tag_count: data.customTags.length,
        });
      }
      setDialogOpen(false);
    } catch (err) {
      console.error("Failed to save project:", err);
    }
  };

  const handleAddInlineTag = (proj: ProjectItem, newTag: string) => {
    const currentTags = proj.customTags || [];
    if (!currentTags.includes(newTag)) {
      updateMutation.mutate({
        id: proj._id,
        data: { customTags: [...currentTags, newTag] },
      });
    }
  };

  const handleGitHubImport = async (
    items: { repo: GitHubRepo; status: "in-progress" | "completed" }[],
  ) => {
    const results = await Promise.allSettled(
      items.map(({ repo, status }) => {
        const stackSet = new Set<string>();
        if (repo.language) stackSet.add(repo.language);
        if (repo.topics) {
          repo.topics.forEach((t) =>
            stackSet.add(t.charAt(0).toUpperCase() + t.slice(1)),
          );
        }

        return createMutation.mutateAsync({
          name: repo.name,
          techStack: Array.from(stackSet),
          status,
          repoUrl: repo.html_url,
          notes:
            repo.description ||
            `Synced public GitHub repository: ${repo.full_name}`,
        });
      }),
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    if (succeeded > 0) {
      posthog.capture("github_repos_imported", { count: succeeded });
      setImportNotification(
        `Successfully imported ${succeeded} GitHub repository project(s)!`,
      );
      setTimeout(() => setImportNotification(""), 4000);
    }
  };

  const existingRepoUrls = projects.map((p) => p.repoUrl).filter(Boolean);
  const inProgressCount = projects.filter((p) => p.status === "in-progress").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchNotes = p.notes?.toLowerCase().includes(q);
      const matchTags = (p.customTags || []).some((t) =>
        t.toLowerCase().includes(q),
      );
      const matchStack = (p.techStack || []).some((s) =>
        s.toLowerCase().includes(q),
      );
      return matchName || matchNotes || matchTags || matchStack;
    });
  }, [projects, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-800 dark:text-neutral-200 pb-28 transition-colors duration-200">
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <section
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          data-purpose="header-section"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
              PORTFOLIO & ENGINEERING
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Software Projects Portfolio
            </h1>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-3xl">
              Document software engineering projects, tech stack architecture, and sync directly with public GitHub repositories.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setGithubModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0e0e0e] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.04] text-xs font-semibold text-slate-700 dark:text-neutral-200 transition-all flex items-center gap-2 shadow-xs dark:shadow-none cursor-pointer"
            >
              <GitHubIcon className="h-4 w-4 text-slate-800 dark:text-white" />
              <span>Sync GitHub Repos</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingProject(null);
                setDialogOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-sm shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Log Project</span>
            </button>
          </div>
        </section>

        <section
          className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs dark:shadow-none"
          data-purpose="projects-kpi-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-neutral-900 p-0.5 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-semibold text-slate-900 dark:text-white">
                  Engineering Showcase
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Showcase technical complexity, system design, and production code for interviewers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 self-start md:self-auto border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/[0.06] pt-4 md:pt-0 md:pl-6">
            <div className="text-left">
              <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-400 tracking-wider block">
                Total Projects
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                <AnimatedNumber value={projects.length} />
              </span>
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-400 tracking-wider block">
                In Progress
              </span>
              <span className="text-xl font-bold text-sky-600 dark:text-sky-400 font-mono">
                <AnimatedNumber value={inProgressCount} />
              </span>
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-neutral-400 tracking-wider block">
                Completed
              </span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                <AnimatedNumber value={completedCount} />
              </span>
            </div>
          </div>
        </section>

        {importNotification && (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{importNotification}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/20"
                  : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              All ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("in-progress")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                statusFilter === "in-progress"
                  ? "bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/40"
                  : "text-slate-600 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
              In Progress ({inProgressCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                statusFilter === "completed"
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                  : "text-slate-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Completed ({completedCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Filter by name or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.06] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {isPending ? (
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] py-16 text-center text-sm font-semibold text-slate-400 dark:text-neutral-400 animate-pulse shadow-xs dark:shadow-none">
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] py-16 text-center space-y-4 shadow-xs dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-neutral-500 mx-auto">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white text-sm font-semibold">
                No projects found.
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Sync from public GitHub repositories or manually log a project to showcase your engineering work.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGithubModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-sm shadow-sky-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <GitHubIcon className="h-4 w-4" />
              <span>Select From GitHub Repos</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((proj) => (
              <ProjectCard
                key={proj._id}
                project={proj}
                onEdit={(p) => {
                  setEditingProject(p);
                  setDialogOpen(true);
                }}
                onDelete={(id) => deleteMutation.mutate(id)}
                onAddTag={handleAddInlineTag}
              />
            ))}
          </div>
        )}

        <ProjectFormModal
          isOpen={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingProject(null);
          }}
          isEditing={Boolean(editingProject)}
          initialData={
            editingProject
              ? {
                  name: editingProject.name,
                  repoUrl: editingProject.repoUrl || "",
                  notes: editingProject.notes || "",
                  customTags: editingProject.customTags || [],
                  status: editingProject.status,
                }
              : undefined
          }
          onSubmit={handleFormSubmit}
          isPending={createMutation.isPending || updateMutation.isPending}
        />

        <GitHubSyncModal
          isOpen={githubModalOpen}
          onClose={() => setGithubModalOpen(false)}
          onImport={handleGitHubImport}
          existingRepoUrls={existingRepoUrls}
        />
      </main>
    </div>
  );
}
