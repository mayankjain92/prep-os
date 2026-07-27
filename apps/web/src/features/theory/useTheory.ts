import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTheoryTopics,
  fetchTheoryStats,
  seedRoadmap,
  createTheoryTopic,
  updateTheoryTopic,
  deleteTheoryTopic,
} from "./api";
import type { CreateTheoryTopicInput, UpdateTheoryTopicInput } from "@prep-os/shared";

export function useTheoryTopics(subject?: string) {
  return useQuery({
    queryKey: ["theoryTopics", subject],
    queryFn: () => fetchTheoryTopics(subject),
  });
}

export function useTheoryStats() {
  return useQuery({
    queryKey: ["theoryStats"],
    queryFn: fetchTheoryStats,
  });
}

function invalidateTheory(queryClient: ReturnType<typeof useQueryClient>) {
  // exact: false cascades to all ["theoryTopics", *] keys
  queryClient.invalidateQueries({ queryKey: ["theoryTopics"], exact: false });
  queryClient.invalidateQueries({ queryKey: ["theoryStats"] });
}

export function useSeedRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subject?: string) => seedRoadmap(subject),
    onSuccess: () => invalidateTheory(queryClient),
  });
}

export function useCreateTheoryTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTheoryTopicInput) => createTheoryTopic(data),
    onSuccess: () => invalidateTheory(queryClient),
  });
}

export function useUpdateTheoryTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTheoryTopicInput }) =>
      updateTheoryTopic(id, data),
    onSuccess: () => invalidateTheory(queryClient),
  });
}

export function useDeleteTheoryTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTheoryTopic(id),
    onSuccess: () => invalidateTheory(queryClient),
  });
}
