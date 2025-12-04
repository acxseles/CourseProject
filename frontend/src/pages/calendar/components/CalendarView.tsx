import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card,  } from '@/shared/ui/Card';
import { useMonthSessions } from '../hooks/useCalendar';
import { format, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data, isLoading, error } = useMonthSessions(year, month);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

 if (isLoading) {
    return (
      <Card>
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold">Календарь занятий</h2>
        </div>
        <div className="p-6 text-center">Загрузка...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold">Календарь занятий</h2>
        </div>
        <div className="p-6 text-center text-red-500">Ошибка загрузки</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h2 className="text-xl font-bold">Календарь занятий</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-32 text-center">
              {format(currentDate, 'LLLL yyyy', { locale: ru })}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-7 gap-2">
          {/* ... календарная сетка остается без изменений ... */}
        </div>
      </div>
    </Card>
  );
};