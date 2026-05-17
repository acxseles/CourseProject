import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import type { Course } from '../../shared/api/courses';
import { apiClient } from '../../shared/api/client';

interface CourseWithProgress extends Course {
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
}

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      if (user?.role === 'Student') {
        try {
          setLoading(true);
          // Получаем записанные курсы
          const response = await apiClient.get(`/enrollments/student/${user.id}`);
          let enrollments = [];
          if (Array.isArray(response.data)) {
            enrollments = response.data;
          } else if (response.data?.items) {
            enrollments = response.data.items;
          }
          
          // Загружаем детали курсов и прогресс
          const coursesWithProgress = await Promise.all(
            enrollments.map(async (e: any) => {
              const courseId = e.courseId || e.course?.id;
              const courseRes = await apiClient.get(`/courses/${courseId}`);
              const course = courseRes.data;
              
              // Получаем прогресс по курсу
              try {
                const progressRes = await apiClient.get(`/courses/${courseId}/progress`);
                return {
                  ...course,
                  progress: progressRes.data?.progress || 0,
                  completedLessons: progressRes.data?.completedLessonIds?.length || 0,
                  totalLessons: progressRes.data?.totalLessons || 0
                };
              } catch {
                return { ...course, progress: 0, completedLessons: 0, totalLessons: 0 };
              }
            })
          );
          
          setCourses(coursesWithProgress);
          
          // Рассчитываем общий прогресс
          if (coursesWithProgress.length > 0) {
            const totalProgress = coursesWithProgress.reduce((sum, c) => sum + (c.progress || 0), 0);
            setOverallProgress(Math.round(totalProgress / coursesWithProgress.length));
          }
        } catch (err) {
          console.error('Ошибка:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', color: '#666' }}>Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Профиль */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '42px',
            fontWeight: 'bold'
          }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#0A2F5A', 
              marginBottom: '8px',
              fontFamily: "'Soyuz Grotesk', 'Montserrat', sans-serif"
            }}>
              {user?.firstName} {user?.lastName}
            </h1>
            <p style={{ color: '#666', marginBottom: '8px' }}>{user?.email}</p>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#e8f0fe',
              color: '#2f70d2',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {user?.role === 'Student' ? 'Студент' : user?.role === 'Teacher' ? 'Преподаватель' : 'Администратор'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 24px',
              backgroundColor: '#fee',
              color: '#e74c3c',
              border: '1px solid #e74c3c',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e74c3c';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fee';
              e.currentTarget.style.color = '#e74c3c';
            }}
          >
            Выйти
          </button>
        </div>

        {/* Общий прогресс */}
        {user?.role === 'Student' && courses.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Общий прогресс</h2>
                <p style={{ color: '#666', fontSize: '14px' }}>По всем вашим курсам</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#2f70d2' }}>{overallProgress}%</span>
              </div>
            </div>
            <div style={{ 
              width: '100%', 
              height: '12px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '6px',
              overflow: 'hidden',
              marginTop: '16px'
            }}>
              <div style={{ 
                width: `${overallProgress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #2f70d2 0%, #27ace0 100%)', 
                borderRadius: '6px',
                transition: 'width 0.5s'
              }} />
            </div>
          </div>
        )}

        {/* Мои курсы (только для студента) */}
        {user?.role === 'Student' && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0A2F5A' }}>
                Мои курсы
              </h2>
              <p style={{ color: '#666' }}>Продолжите обучение и отслеживайте свой прогресс</p>
            </div>

            {courses.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px', 
                backgroundColor: 'white', 
                borderRadius: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>У вас пока нет курсов</h3>
                <p style={{ color: '#666', marginBottom: '24px' }}>Запишитесь на курс, чтобы начать обучение</p>
                <Link to="/courses">
                  <button style={{
                    padding: '12px 32px',
                    background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    Перейти в каталог
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {courses.map(course => (
                  <div 
                    key={course.id} 
                    style={{ 
                      backgroundColor: 'white', 
                      borderRadius: '20px', 
                      padding: '24px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
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
                    
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{course.title}</h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>{course.description}</p>
                    
                    {/* Прогресс курса */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#666' }}>Прогресс курса</span>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2f70d2' }}>{course.progress || 0}%</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#e0e0e0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${course.progress || 0}%`, 
                          height: '100%', 
                          backgroundColor: '#2f70d2', 
                          borderRadius: '4px',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                      {course.totalLessons && (
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
                          {course.completedLessons || 0} из {course.totalLessons} уроков пройдено
                        </div>
                      )}
                    </div>
                    
                    <Link to={`/course/${course.id}/lessons`}>
                      <button style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}>
                        Продолжить обучение →
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Для преподавателя и админа */}
        {(user?.role === 'Teacher' || user?.role === 'Admin') && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍🏫</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              Добро пожаловать в панель управления
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              {user?.role === 'Teacher' 
                ? 'Управляйте своими курсами, уроками и тестами' 
                : 'Управляйте пользователями, курсами и импортом/экспортом данных'}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/my-courses">
                <button style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  📚 Управление курсами
                </button>
              </Link>
              {user?.role === 'Admin' && (
                <>
                  <Link to="/users">
                    <button style={{
                      padding: '12px 28px',
                      backgroundColor: '#e8f0fe',
                      color: '#2f70d2',
                      border: 'none',
                      borderRadius: '40px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}>
                      👥 Пользователи
                    </button>
                  </Link>
                  <Link to="/import-export">
                    <button style={{
                      padding: '12px 28px',
                      backgroundColor: '#e8f0fe',
                      color: '#2f70d2',
                      border: 'none',
                      borderRadius: '40px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}>
                      📁 Импорт/Экспорт
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};