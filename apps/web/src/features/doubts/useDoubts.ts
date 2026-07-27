import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDoubts,
  createDoubt,
  updateDoubt,
  deleteDoubt,
  DoubtItem,
} from "./api";
import type { CreateDoubtInput, UpdateDoubtInput } from "@prep-os/shared";

export function useDoubts() {
  return useQuery<DoubtItem[], Error>({
    queryKey: ["doubts"],
    queryFn: fetchDoubts,
  });
}

export function useCreateDoubt() {
  const queryClient = useQueryClient();
  return useMutation<DoubtItem, Error, CreateDoubtInput>({
    mutationFn: createDoubt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubts"] });
    },
  });
}

export function useUpdateDoubt() {
  const queryClient = useQueryClient();
  return useMutation<DoubtItem, Error, { id: string; data: UpdateDoubtInput }>({
    mutationFn: ({ id, data }) => updateDoubt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubts"] });
    },
  });
}

export function useDeleteDoubt() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteDoubt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doubts"] });
    },
  });
}
