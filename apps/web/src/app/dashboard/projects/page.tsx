"use client";

import { useState } from "react";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/features/projects/useProjects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { PageTransition, FadeInCard } from "@/components/shared/PageTransition";
import { GitHubSyncModal, GitHubRepo } from "@/features/projects/components/GitHubSyncModal";
import { FolderKanban, ExternalLink, Plus, Trash2, Code, CheckCircle2, Pencil } from "lucide-react";
import posthog from "posthog-js";

function GitHubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function ProjectsDashboardPage() {
  const { data: projects = [], isPending } = useProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [name, setName] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [importNotification, setImportNotification] = useState("");
  const [inlineTagInput, setInlineTagInput] = useState<{ id: string; value: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const customTags = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProjectId) {
      updateMutation.mutate({
        id: editingProjectId,
        data: {
          name: name.trim(),
          customTags,
          repoUrl: repoUrl.trim(),
          notes: notes.trim(),
        }
      });
      setEditingProjectId(null);
    } else {
      createMutation.mutate({
        name: name.trim(),
        customTags,
        status: "in-progress",
        repoUrl: repoUrl.trim(),
        notes: notes.trim(),
      });
      posthog.capture("project_created", {
        has_repo_url: Boolean(repoUrl.trim()),
        tag_count: customTags.length,
      });
    }

    setName("");
    setTechStackInput("");
    setRepoUrl("");
    setNotes("");
    setDialogOpen(false);
  };

  const handleAddInlineTag = (e: React.FormEvent, proj: any) => {
    e.preventDefault();
    if (!inlineTagInput || !inlineTagInput.value.trim()) {
      setInlineTagInput(null);
      return;
    }
    const newTag = inlineTagInput.value.trim();
    const currentTags = proj.customTags || [];
    if (!currentTags.includes(newTag)) {
      updateMutation.mutate({
        id: proj._id,
        data: { customTags: [...currentTags, newTag] }
      });
    }
    setInlineTagInput(null);
  };

  const handleGitHubImport = (items: { repo: GitHubRepo; status: "in-progress" | "completed" }[]) => {
    let count = 0;
    items.forEach(({ repo, status }) => {
      // Build tech stack list from primary language and GitHub topics
      const stackSet = new Set<string>();
      if (repo.language) stackSet.add(repo.language);
      if (repo.topics) {
        repo.topics.forEach((t) => stackSet.add(t.charAt(0).toUpperCase() + t.slice(1)));
      }

      createMutation.mutate({
        name: repo.name,
        techStack: Array.from(stackSet),
        status,
        repoUrl: repo.html_url,
        notes: repo.description || `Synced public GitHub repository: ${repo.full_name}`,
      });
      count++;
    });

    posthog.capture("github_repos_imported", { count });
    setImportNotification(`Successfully imported ${count} GitHub repository project(s)!`);
    setTimeout(() => setImportNotification(""), 4000);
  };

  const existingRepoUrls = projects.map((p) => p.repoUrl).filter(Boolean);
  const inProgressCount = projects.filter((p) => p.status === "in-progress").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;

  return (
    <PageTransition className="min-h-screen bg-background p-6 sm:p-10 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold text-xblue uppercase tracking-widest">Portfolio & Engineering</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <FolderKanban className="h-8 w-8 text-xblue" /> Software Projects Portfolio
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Document software engineering projects, tech stack architecture, and sync directly with public GitHub repositories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setGithubModalOpen(true)}
              variant="outline"
              className="rounded-full border-border bg-card hover:bg-background text-foreground font-bold text-xs px-4 h-9"
            >
              <GitHubIcon className="h-4 w-4 mr-2 text-foreground" /> Sync GitHub Repos
            </Button>
            <Button
              onClick={() => {
                setEditingProjectId(null);
                setName("");
                setTechStackInput("");
                setRepoUrl("");
                setNotes("");
                setDialogOpen(!dialogOpen);
              }}
              className="rounded-full bg-xblue hover:bg-xhover text-white font-bold text-xs px-5 h-9"
            >
              <Plus className="h-4 w-4 mr-2" /> Log Project
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <FadeInCard delay={0.05} className="rounded-2xl border border-border bg-card p-4 text-center">
            <span className="text-2xl font-black text-foreground">
              <AnimatedNumber value={projects.length} />
            </span>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">Total Projects</p>
          </FadeInCard>
          <FadeInCard delay={0.1} className="rounded-2xl border border-border bg-card p-4 text-center">
            <span className="text-2xl font-black text-amber-500">
              <AnimatedNumber value={inProgressCount} />
            </span>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">In Progress</p>
          </FadeInCard>
          <FadeInCard delay={0.15} className="rounded-2xl border border-border bg-card p-4 text-center">
            <span className="text-2xl font-black text-emerald-500">
              <AnimatedNumber value={completedCount} />
            </span>
            <p className="text-xs text-muted-foreground font-semibold mt-0.5">Completed</p>
          </FadeInCard>
        </div>

        {importNotification && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-500 font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{importNotification}</span>
          </div>
        )}

        {/* Create Dialog Form */}
        {dialogOpen && (
          <FadeInCard className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-md">
            <h3 className="text-lg font-black text-foreground">{editingProjectId ? "Edit Project" : "Add New Project"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground font-semibold">Project Name</label>
                  <Input
                    autoComplete="off"
                    placeholder="e.g. Prep OS"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-background border-border text-foreground text-xs rounded-full px-4"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground font-semibold">Repo URL</label>
                  <Input
                    type="url"
                    autoComplete="off"
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="bg-background border-border text-foreground text-xs rounded-full px-4"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted-foreground font-semibold">Custom Tech Stack Tags (comma separated)</label>
                <Input
                  autoComplete="off"
                  placeholder="Next.js, Node.js, Express, Redis, MongoDB"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="bg-background border-border text-foreground text-xs rounded-full px-4"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted-foreground font-semibold">Notes / Highlights</label>
                <Input
                  autoComplete="off"
                  placeholder="System design key points..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-background border-border text-foreground text-xs rounded-full px-4"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); setEditingProjectId(null); }} className="rounded-full border-border text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full bg-xblue hover:bg-xhover text-white font-bold text-xs px-4">
                  {editingProjectId ? "Update Project" : "Save Project"}
                </Button>
              </div>
            </form>
          </FadeInCard>
        )}

        {/* Project Grid */}
        {isPending ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-16 text-center space-y-3">
            <FolderKanban className="h-10 w-10 text-xblue mx-auto opacity-70" />
            <div>
              <p className="text-muted-foreground text-sm font-semibold">No projects logged yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Click &quot;Sync GitHub Repos&quot; to select public repos or &quot;Log Project&quot; to manually add one!</p>
            </div>
            <Button
              onClick={() => setGithubModalOpen(true)}
              size="sm"
              className="rounded-full bg-xblue text-white font-bold text-xs px-5"
            >
              <GitHubIcon className="h-4 w-4 mr-2" /> Select From GitHub Repos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((proj, i) => (
              <FadeInCard
                key={proj._id}
                delay={0.05 * i}
                className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                      <Code className="h-5 w-5 text-xblue" /> {proj.name}
                    </h3>
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center text-xs text-xblue hover:underline font-bold"
                      >
                        {proj.repoUrl} <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      proj.status === "completed"
                        ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full"
                        : proj.status === "in-progress"
                        ? "border-xblue/40 text-xblue dark:text-sky-400 bg-xblue/10 dark:bg-xblue/20 rounded-full"
                        : "border-border text-muted-foreground bg-background dark:bg-zinc-900/60 rounded-full"
                    }
                  >
                    {proj.status}
                  </Badge>
                </div>

                {proj.notes && <p className="text-xs text-muted-foreground">{proj.notes}</p>}

                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {/* Primary Auto-detected Language */}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <span className="rounded-md bg-xblue/10 dark:bg-xblue/20 border border-xblue/20 px-2 py-1 text-[11px] font-bold text-xblue dark:text-sky-400">
                      {proj.techStack[0]}
                    </span>
                  )}
                  {/* Custom Tags */}
                  {(proj.customTags || []).map((tech: string) => (
                    <span
                      key={tech}
                      className="rounded-md bg-background dark:bg-zinc-900/60 border border-border px-2 py-1 text-[11px] font-bold text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {/* Add Tag Affordance */}
                  {inlineTagInput?.id === proj._id ? (
                    <form onSubmit={(e) => handleAddInlineTag(e, proj)} className="inline-block">
                      <Input
                        autoFocus
                        value={inlineTagInput.value}
                        onChange={(e) => setInlineTagInput({ id: proj._id, value: e.target.value })}
                        onBlur={() => setInlineTagInput(null)}
                        className="h-6 w-24 text-[10px] px-2 rounded-md bg-background border-border text-foreground inline-flex ml-1 focus-visible:ring-1 focus-visible:ring-xblue"
                        placeholder="Tag name..."
                      />
                    </form>
                  ) : (
                    <button
                      onClick={() => setInlineTagInput({ id: proj._id, value: "" })}
                      className="rounded-md border border-dashed border-border px-2 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:border-muted-foreground transition ml-1"
                    >
                      + Add tag
                    </button>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-border gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProjectId(proj._id);
                      setName(proj.name);
                      setRepoUrl(proj.repoUrl || "");
                      setNotes(proj.notes || "");
                      setTechStackInput((proj.customTags || []).join(", "));
                      setDialogOpen(true);
                    }}
                    className="rounded-full text-muted-foreground hover:text-xblue hover:bg-background"
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      deleteMutation.mutate(proj._id);
                      posthog.capture("project_deleted");
                    }}
                    className="rounded-full text-muted-foreground hover:text-rose-500 hover:bg-background"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </FadeInCard>
            ))}
          </div>
        )}

        {/* GitHub Sync Modal */}
        <GitHubSyncModal
          isOpen={githubModalOpen}
          onClose={() => setGithubModalOpen(false)}
          onImport={handleGitHubImport}
          existingRepoUrls={existingRepoUrls}
        />
      </div>
    </PageTransition>
  );
}
