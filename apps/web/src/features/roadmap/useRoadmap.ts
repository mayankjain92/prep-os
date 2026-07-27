import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoadmapProgress, updateRoadmapProgress, NodeStatus } from "./api";
import type { UpdateRoadmapProgressInput } from "@prep-os/shared";

export function useRoadmapProgress(key: string) {
  return useQuery<Record<string, NodeStatus>, Error>({
    queryKey: ["roadmap", key],
    queryFn: () => fetchRoadmapProgress(key),
  });
}

export function useUpdateRoadmapProgress() {
  const queryClient = useQueryClient();
  return useMutation<
    Record<string, NodeStatus>,
    Error,
    { key: string; data: UpdateRoadmapProgressInput },
    { previous?: Record<string, NodeStatus> }
  >({
    mutationFn: ({ key, data }) => updateRoadmapProgress(key, data),
    onMutate: async ({ key, data }) => {
      await queryClient.cancelQueries({ queryKey: ["roadmap", key] });
      const previous = queryClient.getQueryData<Record<string, NodeStatus>>(["roadmap", key]);
      queryClient.setQueryData<Record<string, NodeStatus>>(["roadmap", key], (old = {}) => ({
        ...old,
        ...data.nodeStatuses,
      }));
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["roadmap", variables.key], context.previous);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["roadmap", variables.key], data);
    },
  });
}
