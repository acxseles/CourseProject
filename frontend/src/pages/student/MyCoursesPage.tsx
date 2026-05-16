import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  price: number;
  durationHours: number;
  teacherId: number;
  teacherName: string;
}

export const MyCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      
      let allCourses: Course[] = [];
      
      if (user?.role === 'Student') {
        // Используем правильный эндпоинт /enrollments/student/{studentId}
        const response = await apiClient.get(`/enrollments/student/${user.id}`);
        console.log('Ответ /enrollments/student:', response.data);
        
        let enrollments = [];
        if (Array.isArray(response.data)) {
          enrollments = response.data;
        } else if (response.data?.items) {
          enrollments = response.data.items;
        }
        
        allCourses = enrollments.map((e: any) => ({
          id: e.courseId || e.course?.id,
          title: e.course?.title || e.courseTitle || 'Курс',
          description: e.course?.description || '',
          level: e.course?.level || 'Beginner',
          price: e.course?.price || 0,
          durationHours: e.course?.durationHours || 0,
          teacherId: e.course?.teacherId || 0,
          teacherName: e.course?.teacherName || e.teacherName || 'Преподаватель'
        }));
        
      } else if (user?.role === 'Teacher') {
        const response = await apiClient.get('/courses');
        allCourses = (response.data?.items || []).filter((c: Course) => c.teacherId === user.id);
      } else if (user?.role === 'Admin') {
        const response = await apiClient.get('/courses');
        allCourses = response.data?.items || [];
      }
      
      setCourses(allCourses);
    } catch (err) {
      console.error('Ошибка:', err);
      setError('Не удалось загрузить курсы');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Удалить курс? Все уроки и тесты тоже удалятся.')) return;
    try {
     // Удаление курса (URL правильный)
await apiClient.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c.id !== courseId));
      alert('Курс удалён');
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Не удалось удалить курс');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📚</div>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
          {user?.role === 'Student' ? 'У вас пока нет курсов' : 'У вас пока нет курсов'}
        </h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          {user?.role === 'Student' 
            ? 'Запишитесь на курс, чтобы начать обучение' 
            : 'Создайте свой первый курс'}
        </p>
        {(user?.role === 'Teacher' || user?.role === 'Admin') && (
          <Link to="/course/new">
            <button style={{
              padding: '12px 32px',
              backgroundColor: '#2f70d2',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              + Создать курс
            </button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '8px' }}>
          {user?.role === 'Student' ? 'Мои курсы' : user?.role === 'Teacher' ? 'Мои курсы' : 'Управление курсами'}
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          {user?.role === 'Student' 
            ? 'Продолжите обучение на любом из курсов' 
            : 'Управляйте вашими курсами'}
        </p>
      </div>

      {(user?.role === 'Teacher' || user?.role === 'Admin') && (
        <Link to="/course/new">
          <button style={{
            padding: '12px 24px',
            backgroundColor: '#2f70d2',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            + Создать новый курс
          </button>
        </Link>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {courses.map(course => (
          <div key={course.id} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{course.title}</h2>
            <p style={{ color: '#666', marginBottom: '12px' }}>{course.description}</p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span>📚 {course.level === 'Beginner' ? 'Начинающий' : course.level === 'Intermediate' ? 'Средний' : 'Продвинутый'}</span>
              <span>💰 {course.price} ₽</span>
              <span>⏱ {course.durationHours} часов</span>
              <span>👨‍🏫 {course.teacherName}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to={`/course/${course.id}/lessons`}>
                <button style={{ padding: '8px 16px', backgroundColor: '#2f70d2', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                  📚 Уроки
                </button>
              </Link>
              
              {(user?.role === 'Teacher' || user?.role === 'Admin') && (
                <>
                  <Link to={`/course/edit/${course.id}`}>
                    <button style={{ padding: '8px 16px', backgroundColor: '#e8f0fe', color: '#2f70d2', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                      ✏️ Редактировать
                    </button>
                  </Link>
                  {user?.role === 'Admin' && (
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      style={{ padding: '8px 16px', backgroundColor: '#fee', color: 'red', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
                    >
                      🗑️ Удалить
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};