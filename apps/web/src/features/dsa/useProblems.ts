import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProblems,
  fetchProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  syncLeetCode,
  Problem,
  SyncLeetCodeResult,
} from "./api";
import type { CreateProblemInput, UpdateProblemInput } from "@prep-os/shared";

export function useProblems() {
  return useQuery<Problem[], Error>({
    queryKey: ["problems"],
    queryFn: fetchProblems,
  });
}

export function useProblem(id: string) {
  return useQuery<Problem, Error>({
    queryKey: ["problems", id],
    queryFn: () => fetchProblem(id),
    enabled: Boolean(id),
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();

  return useMutation<Problem, Error, CreateProblemInput>({
    mutationFn: createProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();

  return useMutation<Problem, Error, { id: string; data: UpdateProblemInput }>({
    mutationFn: ({ id, data }) => updateProblem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["problems", variables.id] });
    },
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}

export function useSyncLeetCode() {
  const queryClient = useQueryClient();

  return useMutation<SyncLeetCodeResult, Error, string | undefined>({
    mutationFn: syncLeetCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}
