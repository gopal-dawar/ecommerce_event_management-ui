import { ApiResponse, CommonFilterParams, PageResponse } from "@/types/api";

/**
 * Universal Base API Service providing typed HTTP methods
 */
export const ApiService = {
  get: <T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> => {
    return apiClient.get<T>(NEXT_BASE_URL, params);
  },

  post: <T, B = unknown>(url: string, body?: B): Promise<ApiResponse<T>> => {
    return apiClient.post<T, B>(url, body);
  },

  put: <T, B = unknown>(url: string, body?: B): Promise<ApiResponse<T>> => {
    return apiClient.put<T, B>(url, body);
  },

  patch: <T, B = unknown>(url: string, body?: B): Promise<ApiResponse<T>> => {
    return apiClient.patch<T, B>(url, body);
  },

  delete: <T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> => {
    return apiClient.delete<T>(url, params);
  },

  /**
   * Helper to fetch paginated master tables with SearchTerm, PageSize=-1, SortBy, etc.
   */
  fetchPaged: <T>(
    endpoint: string,
    filter: CommonFilterParams
  ): Promise<ApiResponse<PageResponse<T>>> => {
    return apiClient.get<PageResponse<T>>(endpoint, filter as Record<string, unknown>);
  },
};
