// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// API Response
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  status: number;
}