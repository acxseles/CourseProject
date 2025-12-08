import { useState } from 'react';
import { useGetCourses, useDeleteCourse } from '@/features/courses';
import { useAuth } from '@/features/auth';
import { Card, CardContent, Button, Input } from '@/shared/ui';
import { Loader, AlertCircle, Trash2, Plus } from 'lucide-react';
import { CourseFormModal } from '@/components/CourseFormModal';

export const DashboardCoursesPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null); // выбранный курс для редактирования
  const pageSize = 10;

  const isTeacher = user?.role === 'Teacher';
  const isAdmin = user?.role === 'Admin';

  const { data, isLoading, error } = useGetCourses(
    { page, pageSize, search: search || undefined },
    { scope: isTeacher ? 'teacher' : 'all' }
  );

  

  const filteredData = data
    ? {
        ...data,
        items: isTeacher
          ? data.items.filter((course) => course.teacherId === user?.id)
          : data.items,
        totalCount: isTeacher
          ? data.items.filter((course) => course.teacherId === user?.id).length
          : data.items.length,
      }
    : null;

  const deleteMutation = useDeleteCourse();
  const totalPages = filteredData ? Math.ceil(filteredData.totalCount / pageSize) : 0;

  const handleDelete = (courseId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот курс?')) {
      deleteMutation.mutate(courseId);
    }
  };

  const handleCreateClick = () => {
    setEditingCourse(null); // создаём новый курс
    setIsModalOpen(true);
  };

  const handleEditClick = (course: any) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isTeacher ? 'Мои курсы' : 'Курсы'}
        </h1>
        <p className="text-lg text-gray-700">
          {isTeacher
            ? 'Управляйте вашими курсами и отслеживайте студентов'
            : 'Создавайте и удаляйте курсы'}
        </p>
      </div>

      {/* Create Course Button */}
      <div>
        {(isTeacher || isAdmin) && (
          <Button
            onClick={handleCreateClick}
            className="text-blue-600 bg-blue-100 hover:bg-blue-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать новый курс
          </Button>
        )}
      </div>

      {/* Modal */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={editingCourse} // передаём выбранный курс для редактирования
      />

      {/* Courses List */}
      {!isLoading && filteredData && filteredData.items.length > 0 && (
        <div className="space-y-4">
          {filteredData.items.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                  </div>

                  {/* Actions */}
                  {(isTeacher || isAdmin) && (
                    <div className="flex gap-2 flex-shrink-0 mt-2 md:mt-0">
                      <Button
                        onClick={() => handleEditClick(course)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        Редактировать
                      </Button>
                      <Button
                        onClick={() => handleDelete(course.id)}
                        disabled={deleteMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
