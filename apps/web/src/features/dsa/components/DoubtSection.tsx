"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Code2,
  BookOpen,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useDoubts,
  useCreateDoubt,
  useUpdateDoubt,
  useDeleteDoubt,
} from "../../doubts/useDoubts";
import type { DoubtType, PriorityLevel } from "../../doubts/api";

export function DoubtSection() {
  const { data: doubts = [], isLoading, error } = useDoubts();
  const createMutation = useCreateDoubt();
  const updateMutation = useUpdateDoubt();
  const deleteMutation = useDeleteDoubt();

  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DoubtType>("leetcode");
  const [topic, setTopic] = useState("Arrays & Hashing");
  const [url, setUrl] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [notes, setNotes] = useState("");

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
    return <div className="text-center py-12 text-sm font-semibold text-muted-foreground animate-pulse">Loading Doubt Queue...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-sm font-semibold text-destructive">Error loading doubts: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <HelpCircle className="h-6 w-6 text-xblue" />
            <h2 className="text-xl font-black text-foreground">DSA Doubts & Future Targets Queue</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Keep track of tricky DSA concepts, questions to revise, and target LeetCode problems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full border border-border text-xs">
            <span className="text-amber-500 font-bold">{unresolvedCount} Pending</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-emerald-500 font-bold">{resolvedCount} Mastered</span>
          </div>

          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="rounded-full bg-foreground hover:bg-muted-foreground text-background font-bold text-xs gap-1.5 px-4"
          >
            <Plus className="h-4 w-4" /> Add Doubt
          </Button>
        </div>
      </div>

      {/* Add Form Drawer */}
      {isFormOpen && (
        <form
          onSubmit={handleAddDoubt}
          className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-md animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-xblue" /> Log a New Doubt or Target Problem
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-muted-foreground hover:text-foreground text-xs font-bold px-2 py-1 bg-background rounded-full border border-border"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Doubt Title / Problem Name *</label>
              <Input
                placeholder="e.g. LeetCode 215 or Segment Tree Lazy Propagation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-background border-border text-foreground text-xs rounded-full px-4"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Category Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DoubtType)}
                className="w-full h-9 rounded-full border border-border bg-background px-4 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-xblue"
              >
                <option value="leetcode">LeetCode Question</option>
                <option value="topic">DSA Topic / Concept</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">DSA Topic Tag</label>
              <Input
                placeholder="e.g. Dynamic Programming, Trees, Graphs"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background border-border text-foreground text-xs rounded-full px-4"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full h-9 rounded-full border border-border bg-background px-4 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-xblue"
              >
                <option value="high">🔥 High Priority</option>
                <option value="medium">⚡ Medium Priority</option>
                <option value="low">📌 Low Priority</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Problem / Resource URL (Optional)</label>
              <Input
                placeholder="https://leetcode.com/problems/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-background border-border text-foreground text-xs rounded-full px-4"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Notes / Specific Doubt Details</label>
              <textarea
                rows={3}
                placeholder="Describe what part is tricky or what approach you want to try later..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background p-4 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-xblue"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(false)}
              className="rounded-full border-border text-muted-foreground text-xs"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              size="sm" 
              className="rounded-full bg-xblue hover:bg-xhover text-white font-bold text-xs px-5"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving..." : "Save Doubt to Queue"}
            </Button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doubts or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border text-foreground text-xs rounded-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filter === "all" ? "bg-xblue text-white" : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
          >
            All ({doubts.length})
          </button>
          <button
            onClick={() => setFilter("unresolved")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filter === "unresolved" ? "bg-amber-500 text-white" : "text-amber-500 hover:bg-amber-500/10"
            }`}
          >
            Pending ({unresolvedCount})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filter === "resolved" ? "bg-emerald-500 text-white" : "text-emerald-500 hover:bg-emerald-500/10"
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>
      </div>

      {/* Doubts List */}
      {filteredDoubts.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border space-y-3">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-black text-foreground">No doubts found in queue</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click "Add Doubt" to add topics or LeetCode questions you want to solve in the future.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoubts.map((doubt) => (
            <div
              key={doubt.id}
              className={`rounded-2xl border p-5 transition space-y-3 flex flex-col justify-between shadow-sm ${
                doubt.resolved
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-border bg-card hover:border-xblue/50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold rounded-full ${
                        doubt.type === "leetcode"
                          ? "border-xblue/40 text-xblue bg-xblue/10"
                          : "border-purple-500/40 text-purple-500 bg-purple-500/10"
                      }`}
                    >
                      {doubt.type === "leetcode" ? (
                        <span className="flex items-center gap-1">
                          <Code2 className="h-3 w-3" /> LeetCode
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Concept
                        </span>
                      )}
                    </Badge>

                    <Badge variant="outline" className="border-border text-foreground bg-background text-[10px] font-bold rounded-full">
                      {doubt.topic}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold rounded-full ${
                        doubt.priority === "high"
                          ? "border-rose-500/40 text-rose-500 bg-rose-500/10"
                          : doubt.priority === "medium"
                          ? "border-amber-500/40 text-amber-500 bg-amber-500/10"
                          : "border-border text-muted-foreground bg-background"
                      }`}
                    >
                      {doubt.priority === "high"
                        ? "🔥 High"
                        : doubt.priority === "medium"
                        ? "⚡ Medium"
                        : "📌 Low"}
                    </Badge>
                  </div>

                  <button
                    onClick={() => handleDelete(doubt.id)}
                    className="text-muted-foreground hover:text-rose-500 transition"
                    title="Delete Doubt"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3
                  className={`text-base font-black ${
                    doubt.resolved ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {doubt.title}
                </h3>

                {doubt.notes && (
                  <p className="text-xs text-muted-foreground bg-background p-3 rounded-2xl border border-border leading-relaxed">
                    {doubt.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                {doubt.url ? (
                  <a
                    href={doubt.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-xblue hover:underline flex items-center gap-1 font-bold"
                  >
                    Solve on LeetCode <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">No URL link attached</span>
                )}

                <Button
                  onClick={() => toggleResolved(doubt.id, doubt.resolved)}
                  size="sm"
                  variant={doubt.resolved ? "outline" : "default"}
                  disabled={updateMutation.isPending}
                  className={`text-xs font-bold gap-1.5 rounded-full px-4 ${
                    doubt.resolved
                      ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {doubt.resolved ? "Mastered" : "Mark Resolved"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
