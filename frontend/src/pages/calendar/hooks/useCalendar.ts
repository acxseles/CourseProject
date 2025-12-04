import { useQuery } from '@tanstack/react-query';
import { calendarApi } from '@/shared/api';

export const useSpecialCourses = () => {
  return useQuery({
    queryKey: ['specialCourses'],
    queryFn: () => calendarApi.getSpecialCourses(),
  });
};

export const useMonthSessions = (year: number, month: number) => {
  return useQuery({
    queryKey: ['monthSessions', year, month],
    queryFn: () => calendarApi.getMonthSessions(year, month),
  });
};