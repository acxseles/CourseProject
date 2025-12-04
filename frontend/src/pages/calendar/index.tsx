import { CalendarView } from './components/CalendarView';

export const CalendarPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Расписание занятий</h1>
        <p className="text-gray-600 mt-2">
          Просматривайте доступные сессии и записывайтесь на занятия
        </p>
      </div>
      <CalendarView />
    </div>
  );
};