"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProblem, useUpdateProblem } from "../useProblems";
import { Problem } from "../api";
import { DSA_TOPICS } from "@prep-os/shared";
import posthog from "posthog-js";

interface ProblemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problemToEdit?: Problem | null;
}

export function ProblemFormDialog({
  open,
  onOpenChange,
  problemToEdit,
}: ProblemFormDialogProps) {
  const createMutation = useCreateProblem();
  const updateMutation = useUpdateProblem();

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [status, setStatus] = useState<"todo" | "attempted" | "solved" | "revisit">("todo");
  const [topicsStr, setTopicsStr] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (problemToEdit) {
      // eslint-disable-next-line
      setTitle(problemToEdit.title);
      setDifficulty(problemToEdit.difficulty);
      setStatus(problemToEdit.status);
      setTopicsStr(problemToEdit.topics?.join(", ") || "");
      setUrl(problemToEdit.url || "");
      setNotes(problemToEdit.notes || "");
    } else {
      setTitle("");
      setDifficulty("Easy");
      setStatus("todo");
      setTopicsStr("");
      setUrl("");
      setNotes("");
    }
  }, [problemToEdit, open]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const topics = topicsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      difficulty,
      status,
      topics,
      url,
      notes,
    };

    if (problemToEdit) {
      await updateMutation.mutateAsync({ id: problemToEdit._id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
      posthog.capture("dsa_problem_added", {
        difficulty: payload.difficulty,
        status: payload.status,
        topic_count: payload.topics.length,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{problemToEdit ? "Edit Problem" : "Add New Problem"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Title</label>
          <Input
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Two Sum"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Difficulty</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Status</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
              value={status}
              onChange={(e) => setStatus(e.target.value as "todo" | "attempted" | "solved" | "revisit")}
            >
              <option value="todo">Todo</option>
              <option value="attempted">Attempted</option>
              <option value="solved">Solved</option>
              <option value="revisit">Revisit</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Topics (comma separated)</label>
          <Input
            autoComplete="off"
            value={topicsStr}
            onChange={(e) => setTopicsStr(e.target.value)}
            placeholder="Array, Hash Table"
          />
          <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-muted-foreground">
            Common: {DSA_TOPICS.slice(0, 6).join(", ")}...
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">URL</label>
          <Input
            type="url"
            autoComplete="off"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://leetcode.com/problems/two-sum"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground">Notes</label>
          <textarea
            autoComplete="off"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key insights, time/space complexity..."
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : problemToEdit ? "Update Problem" : "Add Problem"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
