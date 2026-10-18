import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  syncLeetCode,
  fetchLeetCodeProfile,
  saveNeetcodeProgressApi,
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

export function useSaveNeetcodeProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ solved, starred }: { solved: string[]; starred: string[] }) =>
      saveNeetcodeProgressApi(solved, starred),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}


