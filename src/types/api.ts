/**
 * Standard API Response matching Spring Boot ApiResponse<T>
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  errors?: Record<string, string> | string[] | null;
  timestamp: string;
}

/**
 * Standard Paginated Response matching Spring Boot PageResponse<T>
 */
export interface PageResponse<T = unknown> {
  items: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

/**
 * Common Query Parameters matching Spring Boot CommonFilterDTO
 */
export interface CommonFilterParams {
  id?: number | string;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number; // Pass -1 to retrieve all records
  sortBy?: string;
  sortOrder?: "ASC" | "DESC" | "asc" | "desc";
  isActive?: boolean;
}
