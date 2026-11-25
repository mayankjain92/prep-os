import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/AuthContext";
import {
  syncLeetCode,
  disconnectLeetCode,
  fetchLeetCodeProfile,
  saveNeetcodeProgressApi,
  LeetCodeProfileStats,
  SyncLeetCodeResult,
  SyncLeetCodeParams,
} from "./api";

export function useLeetCodeProfile() {
  const { user } = useAuth();
  return useQuery<LeetCodeProfileStats | null, Error>({
    queryKey: ["leetcodeProfile", user?.id],
    queryFn: fetchLeetCodeProfile,
    enabled: Boolean(user?.id),
  });
}

export function useSyncLeetCode() {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();

  return useMutation<SyncLeetCodeResult, Error, SyncLeetCodeParams | string | undefined>({
    mutationFn: syncLeetCode,
    onSuccess: (data) => {
      queryClient.setQueryData(["leetcodeProfile", user?.id], data.profile ?? null);
      queryClient.invalidateQueries({ queryKey: ["leetcodeProfile"] });
      refreshProfile();
    },
  });
}

export function useDisconnectLeetCode() {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();

  return useMutation<{ message: string; profile: null }, Error>({
    mutationFn: disconnectLeetCode,
    onSuccess: () => {
      queryClient.setQueryData(["leetcodeProfile", user?.id], null);
      queryClient.invalidateQueries({ queryKey: ["leetcodeProfile"] });
      refreshProfile();
    },
  });
}

export function useSaveNeetcodeProgress() {
  const { refreshProfile } = useAuth();

  return useMutation({
    mutationFn: ({ solved, starred }: { solved: string[]; starred: string[] }) =>
      saveNeetcodeProgressApi(solved, starred),
    onSuccess: () => {
      refreshProfile();
    },
  });
}


