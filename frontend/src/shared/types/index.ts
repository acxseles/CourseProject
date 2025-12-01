// User Types
export type UserRole = 'Student' | 'Teacher' | 'Admin';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

// Course Types
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: number;
  title: string;
  description: string;
  level: CourseLevel;
  price: number;
  durationHours: number;
  teacherId?: number;
  teacherName: string;
  createdAt?: string;
}

// Auth DTOs
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: User;
  token: string;
}

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
