import axios, { AxiosError } from "axios";
import type {
  ApiResponse,
  Assignment,
  AssignmentListItem,
  AssignmentStatus,
  CreateAssignmentResponse,
  DeleteAssignmentResponse,
  GeneratePdfResponse,
  PaginationMeta,
  RegenerateAssignmentResponse,
} from "@/types/assignment";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

api.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse<unknown>;
    if (!body.success) {
      throw new ApiError(
        body.error?.message ?? "Request failed",
        response.status,
      );
    }
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message =
      error.response?.data?.error?.message ??
      error.message ??
      "Network error";
    const status = error.response?.status ?? 500;
    throw new ApiError(message, status);
  },
);

export interface ListAssignmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AssignmentStatus;
  sort?: string;
}

export interface ListAssignmentsResult {
  items: AssignmentListItem[];
  pagination: PaginationMeta;
}

export async function listAssignments(
  params: ListAssignmentsParams = {},
): Promise<ListAssignmentsResult> {
  const { data } = await api.get<ApiResponse<AssignmentListItem[]>>(
    "/assignments",
    { params },
  );
  return {
    items: data.data,
    pagination: data.meta as PaginationMeta,
  };
}

export async function getAssignment(id: string): Promise<Assignment> {
  const { data } = await api.get<ApiResponse<Assignment>>(
    `/assignments/${id}`,
  );
  return data.data;
}

export async function createAssignment(
  formData: FormData,
): Promise<CreateAssignmentResponse> {
  const { data } = await api.post<ApiResponse<CreateAssignmentResponse>>(
    "/assignments",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function deleteAssignment(
  id: string,
): Promise<DeleteAssignmentResponse> {
  const { data } = await api.delete<ApiResponse<DeleteAssignmentResponse>>(
    `/assignments/${id}`,
  );
  return data.data;
}

export async function regenerateAssignment(
  id: string,
): Promise<RegenerateAssignmentResponse> {
  const { data } = await api.post<ApiResponse<RegenerateAssignmentResponse>>(
    `/assignments/${id}/regenerate`,
  );
  return data.data;
}

export async function generatePdf(
  id: string,
): Promise<GeneratePdfResponse> {
  const { data } = await api.post<ApiResponse<GeneratePdfResponse>>(
    `/assignments/${id}/pdf`,
  );
  return data.data;
}

export function downloadPdfUrl(id: string): string {
  return `${API_URL}/assignments/${id}/pdf`;
}

export { api, ApiError };
