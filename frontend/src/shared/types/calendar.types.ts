export interface SpecialCourseDto {
  id: number;
  title: string;
  description: string;
  maxParticipants: number;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface CalendarSessionDto {
  id: number;
  specialCourseId: number;
  teacherId: number;
  teacherName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
  isBooked: boolean;
  createdAt: string;
}

export interface CalendarMonthDto {
  year: number;
  month: number;
  days: CalendarDayDto[];
}

export interface CalendarDayDto {
  date: string;
  sessions: SessionShortDto[];
  hasAvailableSlots: boolean;
}

export interface SessionShortDto {
  id: number;
  courseTitle: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
  teacherName: string;
}

export interface CreateSessionDto {
  teacherId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  availableSlots: number;
}

export interface CreateBookingDto {
  notes?: string;
}

export interface BookWithTeacherDto {
  teacherId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}