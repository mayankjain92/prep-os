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
import { FolderKanban, ExternalLink, Plus, Trash2, Code } from "lucide-react";

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    createMutation.mutate({
      name: name.trim(),
      techStack,
      status: "in-progress",
      repoUrl: repoUrl.trim(),
      notes: notes.trim(),
    });

    setName("");
    setTechStackInput("");
    setRepoUrl("");
    setNotes("");
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-10 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <FolderKanban className="h-8 w-8 text-xblue" /> Dev Project Logger
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track portfolio software projects, tech stacks, GitHub repositories, & architecture notes.
            </p>
          </div>

          <Button onClick={() => setDialogOpen(!dialogOpen)} className="rounded-full bg-xblue hover:bg-xhover text-white font-bold text-xs px-5">
            <Plus className="h-4 w-4 mr-2" /> Log Project
          </Button>
        </div>

        {/* Create Dialog Form */}
        {dialogOpen && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-md">
            <h3 className="text-lg font-black text-foreground">Add New Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground font-semibold">Project Name</label>
                  <Input
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
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="bg-background border-border text-foreground text-xs rounded-full px-4"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted-foreground font-semibold">Tech Stack (comma separated)</label>
                <Input
                  placeholder="Next.js, Node.js, Express, Redis, MongoDB"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="bg-background border-border text-foreground text-xs rounded-full px-4"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted-foreground font-semibold">Notes / Highlights</label>
                <Input
                  placeholder="System design key points..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-background border-border text-foreground text-xs rounded-full px-4"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="rounded-full border-border text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full bg-xblue hover:bg-xhover text-white font-bold text-xs px-4">
                  Save Project
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Project Grid */}
        {isPending ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-16 text-center">
            <p className="text-muted-foreground text-sm font-semibold">No projects logged yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Log Project" above to track your first software build!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm transition hover:border-xblue/50"
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
                        ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/10 rounded-full"
                        : proj.status === "in-progress"
                        ? "border-xblue/40 text-xblue bg-xblue/10 rounded-full"
                        : "border-border text-muted-foreground bg-background rounded-full"
                    }
                  >
                    {proj.status}
                  </Badge>
                </div>

                {proj.notes && <p className="text-xs text-muted-foreground">{proj.notes}</p>}

                {proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-background border border-border px-2 py-1 text-[11px] font-bold text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(proj._id)}
                    className="rounded-full text-muted-foreground hover:text-rose-500 hover:bg-background"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
