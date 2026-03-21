import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  listAssignments,
  getAssignment,
  createAssignment,
  deleteAssignment,
  regenerateAssignment,
  generatePdf,
  type ListAssignmentsParams,
} from "@/services/api";

const ASSIGNMENTS_KEY = "assignments";

export function useAssignments(params: ListAssignmentsParams = {}) {
  return useQuery({
    queryKey: [ASSIGNMENTS_KEY, params],
    queryFn: () => listAssignments(params),
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: [ASSIGNMENTS_KEY, id],
    queryFn: () => getAssignment(id),
    enabled: !!id,
    // Fallback when Socket.IO is misconfigured or disconnected (API + WS on different ports, etc.)
    refetchInterval: (query) => {
      const a = query.state.data;
      if (!a) return false;
      if (a.status === "queued" || a.status === "processing") {
        return 2500;
      }
      return false;
    },
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ASSIGNMENTS_KEY] });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ASSIGNMENTS_KEY] });
    },
  });
}

export function useRegenerateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateAssignment,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: [ASSIGNMENTS_KEY, id],
      });
    },
  });
}

export function useGeneratePdf() {
  return useMutation({
    mutationFn: generatePdf,
  });
}
