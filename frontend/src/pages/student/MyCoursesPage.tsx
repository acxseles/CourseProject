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
        // Получаем все курсы
        const allCoursesResponse = await apiClient.get('/courses');
        const allCoursesList = allCoursesResponse.data?.items || [];
        
        // Получаем ID записанных курсов
        const enrollmentsResponse = await apiClient.get(`/enrollments/student/${user.id}`);
        let enrollments = [];
        if (Array.isArray(enrollmentsResponse.data)) {
          enrollments = enrollmentsResponse.data;
        } else if (enrollmentsResponse.data?.items) {
          enrollments = enrollmentsResponse.data.items;
        }
        const enrolledIds = enrollments.map((e: any) => e.courseId || e.course?.id);
        
        // Фильтруем только записанные курсы
        allCourses = allCoursesList.filter((c: Course) => enrolledIds.includes(c.id));
        
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
      await apiClient.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c.id !== courseId));
      alert('Курс удалён');
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Не удалось удалить курс');
    }
  };

  const getLevelName = (level: string) => {
    const levels: Record<string, string> = {
      'Beginner': 'Начинающий',
      'Intermediate': 'Средний',
      'Advanced': 'Продвинутый'
    };
    return levels[level] || level;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Beginner': '#4caf50',
      'Intermediate': '#ff9800',
      'Advanced': '#f44336'
    };
    return colors[level] || '#666';
  };

  if (loading) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                padding: '24px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                <div style={{ height: '24px', backgroundColor: '#e0e0e0', borderRadius: '8px', marginBottom: '12px', width: '60%' }} />
                <div style={{ height: '16px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '16px', backgroundColor: '#e0e0e0', borderRadius: '4px', width: '80%' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Ошибка</h2>
          <p style={{ color: '#666' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Заголовок */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            color: '#0A2F5A', 
            marginBottom: '12px',
            fontFamily: "'Soyuz Grotesk', 'Montserrat', sans-serif"
          }}>
            {user?.role === 'Student' ? 'Мои курсы' : user?.role === 'Teacher' ? 'Мои курсы' : 'Управление курсами'}
          </h1>
          <p style={{ fontSize: '16px', color: '#555' }}>
            {user?.role === 'Student' 
              ? 'Продолжите обучение на любом из курсов' 
              : 'Управляйте вашими курсами'}
          </p>
        </div>

        {/* Кнопка создания курса */}
        {(user?.role === 'Teacher' || user?.role === 'Admin') && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/course/new">
              <button style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                + Создать новый курс
              </button>
            </Link>
          </div>
        )}

        {courses.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px', 
            backgroundColor: 'white', 
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              {user?.role === 'Student' ? 'У вас пока нет курсов' : 'У вас пока нет курсов'}
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
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
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  + Создать курс
                </button>
              </Link>
            )}
            {user?.role === 'Student' && (
              <Link to="/courses">
                <button style={{
                  padding: '12px 32px',
                  backgroundColor: '#2f70d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Перейти в каталог
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {courses.map(course => (
              <div 
                key={course.id} 
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '24px', 
                  padding: '28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                }}
              >
                {/* Уровень */}
                <div style={{ marginBottom: '12px' }}>
                  <span style={{
                    backgroundColor: `${getLevelColor(course.level)}20`,
                    color: getLevelColor(course.level),
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'inline-block'
                  }}>
                    {getLevelName(course.level)}
                  </span>
                </div>

                {/* Заголовок */}
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: '#0A2F5A', 
                  marginBottom: '12px'
                }}>
                  {course.title}
                </h2>

                {/* Описание */}
                <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.5', marginBottom: '16px' }}>
                  {course.description.length > 200 
                    ? course.description.substring(0, 200) + '...' 
                    : course.description}
                </p>

                {/* Детали */}
                <div style={{ 
                  display: 'flex', 
                  gap: '24px', 
                  flexWrap: 'wrap', 
                  marginBottom: '20px',
                  color: '#888',
                  fontSize: '14px'
                }}>
                  <span>👨‍🏫 {course.teacherName}</span>
                  <span>💰 {course.price.toLocaleString()} ₽</span>
                  <span>⏱ {course.durationHours} часов</span>
                </div>

                {/* Кнопки действий */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link to={`/course/${course.id}/lessons`}>
                    <button style={{
                      padding: '10px 24px',
                      background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                      📚 Перейти к урокам
                    </button>
                  </Link>
                  
                  {(user?.role === 'Teacher' || user?.role === 'Admin') && (
                    <>
                      <Link to={`/course/edit/${course.id}`}>
                        <button style={{
                          padding: '10px 24px',
                          backgroundColor: 'white',
                          color: '#2f70d2',
                          border: '1px solid #2f70d2',
                          borderRadius: '30px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e8f0fe';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}>
                          ✏️ Редактировать
                        </button>
                      </Link>
                      {user?.role === 'Admin' && (
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          style={{
                            padding: '10px 24px',
                            backgroundColor: 'white',
                            color: '#e74c3c',
                            border: '1px solid #e74c3c',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}>
                          🗑️ Удалить
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};