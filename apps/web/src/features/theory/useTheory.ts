import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTheoryTopics,
  fetchTheoryStats,
  seedRoadmap,
  createTheoryTopic,
  updateTheoryTopic,
  deleteTheoryTopic,
  type TheoryTopic,
} from "./api";
import type {
  CreateTheoryTopicInput,
  UpdateTheoryTopicInput,
} from "@prep-os/shared";

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

function upsertTheoryTopicInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  topic: TheoryTopic,
) {
  const cachedQueries = queryClient.getQueriesData<TheoryTopic[]>({
    queryKey: ["theoryTopics"],
    exact: false,
  });

  cachedQueries.forEach(([queryKey, old = []]) => {
    const querySubject =
      typeof queryKey[1] === "string" ? queryKey[1] : undefined;

    queryClient.setQueryData<TheoryTopic[]>(queryKey, () => {
      const nextList = old.filter((item) => item._id !== topic._id);

      if (!querySubject || querySubject === topic.subject) {
        return [...nextList, topic].sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        );
      }

      return nextList;
    });
  });
}

function removeTheoryTopicFromCache(
  queryClient: ReturnType<typeof useQueryClient>,
  topicId: string,
) {
  const cachedQueries = queryClient.getQueriesData<TheoryTopic[]>({
    queryKey: ["theoryTopics"],
    exact: false,
  });

  cachedQueries.forEach(([queryKey, old = []]) => {
    queryClient.setQueryData<TheoryTopic[]>(
      queryKey,
      old.filter((item) => item._id !== topicId),
    );
  });
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
    onSuccess: (topic) => {
      upsertTheoryTopicInCache(queryClient, topic);
      invalidateTheory(queryClient);
    },
  });
}

export function useUpdateTheoryTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTheoryTopicInput }) =>
      updateTheoryTopic(id, data),
    onSuccess: (topic) => {
      upsertTheoryTopicInCache(queryClient, topic);
      invalidateTheory(queryClient);
    },
  });
}

export function useDeleteTheoryTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTheoryTopic(id),
    onSuccess: (_data, topicId) => {
      removeTheoryTopicFromCache(queryClient, topicId);
      invalidateTheory(queryClient);
    },
  });
}
