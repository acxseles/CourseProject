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