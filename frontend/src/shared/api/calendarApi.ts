import client from './client';
import type { 
  SpecialCourseDto, 
  CalendarMonthDto, 
  CalendarSessionDto,
  CreateSessionDto,
  CreateBookingDto,
  BookWithTeacherDto 
} from '@/shared/types';

export const calendarApi = {
  // Получить все особые курсы
  getSpecialCourses: () => 
    client.get<SpecialCourseDto[]>('/calendar/special-courses'),

  // Получить преподавателей курса
  getCourseTeachers: (courseId: number) =>
    client.get(`/calendar/special-courses/${courseId}/teachers`),

  // Получить расписание преподавателя
  getTeacherSchedule: (teacherId: number, date?: string) =>
    client.get(`/calendar/teachers/${teacherId}/schedule`, { 
      params: { date } 
    }),

  // Записаться на курс с выбором преподавателя
  bookWithTeacher: (courseId: number, data: BookWithTeacherDto) =>
    client.post(`/calendar/special-courses/${courseId}/book-with-teacher`, data),

  // Получить сессии на месяц
  getMonthSessions: (year: number, month: number) =>
    client.get<CalendarMonthDto>(`/calendar/month/${year}/${month}`),

  // Создать сессию (Teacher/Admin)
  createSession: (data: CreateSessionDto) =>
    client.post<CalendarSessionDto>('/calendar/sessions', data),

  // Забронировать сессию (Student)
  bookSession: (sessionId: number, data: CreateBookingDto) =>
    client.post(`/calendar/sessions/${sessionId}/book`, data),

  // Получить мои бронирования
  getMyBookings: () =>
    client.get('/calendar/my-bookings'),
};