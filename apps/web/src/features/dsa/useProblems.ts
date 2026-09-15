import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  syncLeetCode,
  fetchLeetCodeProfile,
  LeetCodeProfileStats,
  SyncLeetCodeResult,
  SyncLeetCodeParams,
} from "./api";

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
      queryClient.invalidateQueries({ queryKey: ["leetcodeProfile"] });
    },
  });
}

