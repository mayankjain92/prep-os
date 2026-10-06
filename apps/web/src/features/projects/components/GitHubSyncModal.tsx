"use client";

import { useState } from "react";
import { Search, Check, Star, GitFork, Loader2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  onImport: (
    repos: { repo: GitHubRepo; status: "in-progress" | "completed" }[],
  ) => void;
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
  const [selectedStatus, setSelectedStatus] = useState<
    Record<number, "in-progress" | "completed">
  >({});

  const fetchRepos = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const handle = username.trim();
    if (!handle) return;

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.github.com/users/${handle}/repos?sort=updated&per_page=50`,
      );
      if (!res.ok) {
        if (res.status === 404)
          throw new Error(`GitHub user "@${handle}" not found.`);
        throw new Error("Failed to fetch public repositories from GitHub.");
      }
      const data: GitHubRepo[] = await res.json();
      setRepos(data);

      const initialStatus: Record<number, "in-progress" | "completed"> = {};
      data.forEach((r) => {
        initialStatus[r.id] = "completed";
      });
      setSelectedStatus(initialStatus);
    } catch (err: unknown) {
      setError(
        (err as Error).message ||
          "An error occurred while fetching GitHub repositories.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedRepoIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleImportSelected = () => {
    const selected = repos.filter((r) => selectedRepoIds[r.id]);
    const payload = selected.map((r) => ({
      repo: r,
      status: selectedStatus[r.id] || "completed",
    }));

    onImport(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121212] shadow-2xl flex flex-col max-h-[85vh] text-slate-800 dark:text-neutral-200"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-[#161616] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white">
                <GitHubIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Sync GitHub Repositories
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Import your public engineering projects directly into PrepOS
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800/60 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search Form */}
          <div className="p-6 border-b border-slate-100 dark:border-white/[0.06] bg-white dark:bg-[#121212] space-y-3">
            <form onSubmit={fetchRepos} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-neutral-500" />
                <input
                  type="text"
                  placeholder="Enter GitHub handle (e.g. torvalds)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-[#0e0e0e] border border-slate-200 dark:border-white/[0.08] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow-sm shadow-sky-500/20 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>Fetch Repos</span>
              </button>
            </form>

            {error && (
              <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {/* Repositories List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {repos.length === 0 && !isLoading && !error && (
              <div className="text-center py-12 space-y-2">
                <GitHubIcon className="h-8 w-8 text-slate-400 dark:text-neutral-600 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Search a GitHub username above to discover public repositories.
                </p>
              </div>
            )}

            {repos.map((repo) => {
              const isAlreadyAdded = existingRepoUrls.includes(repo.html_url);
              const isSelected = selectedRepoIds[repo.id] || false;

              return (
                <div
                  key={repo.id}
                  onClick={() => !isAlreadyAdded && toggleSelect(repo.id)}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAlreadyAdded
                      ? "opacity-50 bg-slate-100/50 dark:bg-[#0e0e0e]/50 border-slate-200 dark:border-white/[0.04] cursor-not-allowed"
                      : isSelected
                      ? "border-sky-500/50 bg-sky-50 dark:bg-sky-500/[0.05] cursor-pointer"
                      : "border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0e0e0e] hover:border-slate-300 dark:hover:border-white/20 cursor-pointer"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      disabled={isAlreadyAdded}
                      checked={isSelected || isAlreadyAdded}
                      onChange={() => !isAlreadyAdded && toggleSelect(repo.id)}
                      className="mt-1 rounded border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sky-500 focus:ring-0 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {repo.name}
                        </span>
                        {isAlreadyAdded && (
                          <span className="text-[10px] bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 px-2 py-0.5 rounded-full border border-slate-300 dark:border-white/[0.06]">
                            Already Logged
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {repo.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-neutral-400 mt-2">
                        {repo.language && (
                          <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 dark:text-amber-400" />{" "}
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3 text-slate-400 dark:text-neutral-500" />{" "}
                          {repo.forks_count}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Picker & Action */}
                  {!isAlreadyAdded && (
                    <div
                      className="flex items-center gap-2 shrink-0 self-end sm:self-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={selectedStatus[repo.id] || "completed"}
                        onChange={(e) =>
                          setSelectedStatus((prev) => ({
                            ...prev,
                            [repo.id]: e.target.value as
                              | "in-progress"
                              | "completed",
                          }))
                        }
                        className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-neutral-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
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
          <div className="border-t border-slate-100 dark:border-white/[0.06] px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-[#161616]">
            <span className="text-xs text-slate-500 dark:text-neutral-400">
              {Object.values(selectedRepoIds).filter(Boolean).length} repository(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-transparent text-xs text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSelected}
                disabled={
                  Object.values(selectedRepoIds).filter(Boolean).length === 0
                }
                className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow-sm shadow-sky-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Import Selected
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
