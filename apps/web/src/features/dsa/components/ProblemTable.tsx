"use client";

import { Problem } from "../api";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUpdateProblem, useDeleteProblem } from "../useProblems";
import { ExternalLink, Edit2, Trash2 } from "lucide-react";
import posthog from "posthog-js";

interface ProblemTableProps {
  problems: Problem[];
  onEdit: (problem: Problem) => void;
}

export function ProblemTable({ problems, onEdit }: ProblemTableProps) {
  const updateMutation = useUpdateProblem();
  const deleteMutation = useDeleteProblem();

  const handleStatusChange = (problem: Problem, newStatus: Problem["status"]) => {
    updateMutation.mutate({
      id: problem._id,
      data: { status: newStatus },
    });
    posthog.capture("dsa_problem_status_updated", {
      previous_status: problem.status,
      new_status: newStatus,
      difficulty: problem.difficulty,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      deleteMutation.mutate(id);
      posthog.capture("dsa_problem_deleted");
    }
  };

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-border">
        <p className="text-sm font-medium text-muted-foreground">No problems tracked yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Click &quot;Add Problem&quot; to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Topics</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
            <TableRow key={problem._id}>
              <TableCell className="font-medium text-foreground">
                {problem.title}
                {problem.notes && (
                  <div className="text-xs text-muted-foreground font-normal truncate max-w-xs">
                    {problem.notes}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    problem.difficulty.toLowerCase() as "easy" | "medium" | "hard"
                  }
                >
                  {problem.difficulty}
                </Badge>
              </TableCell>
              <TableCell>
                <select
                  value={problem.status}
                  onChange={(e) =>
                    handleStatusChange(problem, e.target.value as Problem["status"])
                  }
                  className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none cursor-pointer text-foreground"
                >
                  <option value="todo">Todo</option>
                  <option value="attempted">Attempted</option>
                  <option value="solved">Solved</option>
                  <option value="revisit">Revisit</option>
                </select>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {problem.topics.slice(0, 3).map((topic, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                      {topic}
                    </Badge>
                  ))}
                  {problem.topics.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{problem.topics.length - 3}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {problem.url ? (
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Link <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onEdit(problem)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(problem._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
