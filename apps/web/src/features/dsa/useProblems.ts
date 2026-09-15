import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProblems,
  syncLeetCode,
  fetchLeetCodeProfile,
  Problem,
  LeetCodeProfileStats,
  SyncLeetCodeResult,
  SyncLeetCodeParams,
} from "./api";

export function useProblems() {
  return useQuery<Problem[], Error>({
    queryKey: ["problems"],
    queryFn: fetchProblems,
  });
}

export function useLeetCodeProfile() {
  return useQuery<LeetCodeProfileStats | null, Error>({
    queryKey: ["leetcodeProfile"],
    queryFn: fetchLeetCodeProfile,
  });
}

export function useSyncLeetCode() {
  const queryClient = useQueryClient();

  return useMutation<SyncLeetCodeResult, Error, SyncLeetCodeParams | string | undefined>({
    mutationFn: syncLeetCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["leetcodeProfile"] });
    },
  });
}

