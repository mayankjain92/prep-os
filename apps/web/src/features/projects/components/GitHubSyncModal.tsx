"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, Star, GitFork, Loader2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function GitHubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
}

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (repos: { repo: GitHubRepo; status: "in-progress" | "completed" }[]) => void;
  existingRepoUrls: string[];
}

export function GitHubSyncModal({
  isOpen,
  onClose,
  onImport,
  existingRepoUrls,
}: GitHubSyncModalProps) {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRepoIds, setSelectedRepoIds] = useState<Record<number, boolean>>({});
  const [selectedStatus, setSelectedStatus] = useState<Record<number, "in-progress" | "completed">>({});

  const fetchRepos = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const handle = username.trim();
    if (!handle) return;

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.github.com/users/${handle}/repos?sort=updated&per_page=50`);
      if (!res.ok) {
        if (res.status === 404) throw new Error(`GitHub user "@${handle}" not found.`);
        throw new Error("Failed to fetch public repositories from GitHub.");
      }
      const data: GitHubRepo[] = await res.json();
      setRepos(data);
      
      // Default initial status for all repos
      const initialStatus: Record<number, "in-progress" | "completed"> = {};
      data.forEach((r) => {
        initialStatus[r.id] = "completed";
      });
      setSelectedStatus(initialStatus);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching GitHub repositories.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedRepoIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleImportSelected = () => {
    const toImport = repos
      .filter((r) => selectedRepoIds[r.id])
      .map((r) => ({
        repo: r,
        status: selectedStatus[r.id] || "completed",
      }));

    if (toImport.length === 0) return;
    onImport(toImport);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-foreground/10 flex items-center justify-center">
                <GitHubIcon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-base font-black text-foreground">Sync Public GitHub Repositories</h2>
                <p className="text-xs text-muted-foreground">Select which public repositories to import into Prep OS</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search Form */}
          <div className="p-6 border-b border-border bg-background/50">
            <form onSubmit={fetchRepos} className="flex items-center gap-2">
              <div className="relative flex-1">
                <GitHubIcon className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter GitHub username (e.g. octocat)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-background border-border text-foreground text-xs rounded-full"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="rounded-full bg-xblue hover:bg-xhover text-white font-bold text-xs px-5 h-9"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-1.5" />}
                Fetch Repos
              </Button>
            </form>

            {error && (
              <p className="mt-2 text-xs text-rose-500 font-medium px-2">{error}</p>
            )}
          </div>

          {/* Repositories List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {repos.length === 0 && !isLoading && !error && (
              <div className="py-12 text-center text-muted-foreground">
                <Sparkles className="h-8 w-8 text-xblue mx-auto mb-2 opacity-60" />
                <p className="text-xs font-bold">Search for a GitHub user to load public repositories.</p>
              </div>
            )}

            {repos.map((repo) => {
              const isAlreadyAdded = existingRepoUrls.some((url) => url.toLowerCase() === repo.html_url.toLowerCase());
              const isSelected = Boolean(selectedRepoIds[repo.id]);

              return (
                <div
                  key={repo.id}
                  onClick={() => !isAlreadyAdded && toggleSelect(repo.id)}
                  className={`rounded-xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                    isAlreadyAdded
                      ? "border-border bg-muted/20 opacity-60 cursor-not-allowed"
                      : isSelected
                      ? "border-xblue bg-xblue/5 shadow-xs"
                      : "border-border bg-background hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isAlreadyAdded}
                      onChange={() => toggleSelect(repo.id)}
                      className="mt-1 h-4 w-4 accent-xblue rounded"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground truncate">{repo.name}</h4>
                        {isAlreadyAdded && (
                          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
                            Already Imported
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {repo.description || "No description provided."}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mt-2">
                        {repo.language && (
                          <span className="font-semibold text-xblue bg-xblue/10 px-2 py-0.5 rounded-full">
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500" /> {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" /> {repo.forks_count}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Picker & Action */}
                  {!isAlreadyAdded && (
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={selectedStatus[repo.id] || "completed"}
                        onChange={(e) =>
                          setSelectedStatus((prev) => ({
                            ...prev,
                            [repo.id]: e.target.value as "in-progress" | "completed",
                          }))
                        }
                        className="bg-card border border-border text-foreground text-xs rounded-full px-3 py-1 font-semibold"
                      >
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-card">
            <span className="text-xs text-muted-foreground">
              {Object.values(selectedRepoIds).filter(Boolean).length} repository(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose} className="rounded-full text-xs border-border">
                Cancel
              </Button>
              <Button
                onClick={handleImportSelected}
                disabled={Object.values(selectedRepoIds).filter(Boolean).length === 0}
                className="rounded-full bg-xblue hover:bg-xhover text-white font-bold text-xs px-5"
              >
                <Check className="h-4 w-4 mr-1.5" />
                Import Selected
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
