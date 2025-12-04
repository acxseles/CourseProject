export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content?: string;
  videoUrl?: string;
  orderIndex: number;
  createdAt?: string;
}

export interface CreateLessonDto {
  title: string;
  content?: string;
  videoUrl?: string;
  orderIndex: number;
}

export interface UpdateLessonDto {
  title?: string;
  content?: string;
  videoUrl?: string;
  orderIndex?: number;
}
