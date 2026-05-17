import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: number;
  title: string;
  content: string;
  orderIndex: number;
  videoUrl?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
}

export const CourseLessonsPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const courseRes = await apiClient.get(`/courses/${courseId}`);
        setCourse(courseRes.data);
        
        const lessonsRes = await apiClient.get(`/courses/${courseId}/lessons`);
        let lessonsList = [];
        if (Array.isArray(lessonsRes.data)) {
          lessonsList = lessonsRes.data;
        } else if (lessonsRes.data?.items) {
          lessonsList = lessonsRes.data.items;
        }
        setLessons(lessonsList);
        
      } catch (err) {
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const completeLesson = async (lessonId: number) => {
    try {
      await apiClient.post(`/lessons/${lessonId}/complete`);
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);
      const newProgress = Math.round((newCompleted.length / lessons.length) * 100);
      setProgress(newProgress);
      alert('Урок завершён!');
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Не удалось завершить урок');
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm('Удалить этот урок? Все тесты тоже удалятся.')) return;
    try {
      await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);
      setLessons(lessons.filter(l => l.id !== lessonId));
      alert('Урок удалён');
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Не удалось удалить урок');
    }
  };

  const handleEditLesson = (lessonId: number) => {
    navigate(`/course/${courseId}/lesson/${lessonId}/edit`);
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
          <div style={{ fontSize: '24px', color: '#666' }}>Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Информация о курсе */}
        <div style={{ marginBottom: '40px' }}>
          <Link 
            to={user?.role === 'Student' ? '/my-courses' : '/courses'} 
            style={{ 
              color: '#2f70d2', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              fontWeight: '500'
            }}
          >
            ← Назад к курсам
          </Link>
          
          <div style={{ textAlign: 'center' }}>
            <span style={{
              backgroundColor: `${getLevelColor(course?.level || 'Beginner')}20`,
              color: getLevelColor(course?.level || 'Beginner'),
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              {getLevelName(course?.level || 'Beginner')}
            </span>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#0A2F5A', 
              marginBottom: '16px',
              fontFamily: "'Soyuz Grotesk', 'Montserrat', sans-serif"
            }}>
              {course?.title}
            </h1>
            <p style={{ color: '#555', fontSize: '16px', maxWidth: '700px', margin: '0 auto' }}>
              {course?.description}
            </p>
          </div>
        </div>

        {/* Кнопка создания урока */}
        {(user?.role === 'Teacher' || user?.role === 'Admin') && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to={`/course/${courseId}/lesson/new`}>
              <button style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                + Добавить урок
              </button>
            </Link>
          </div>
        )}

        {/* Прогресс */}
        {user?.role === 'Student' && progress > 0 && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '24px', 
            padding: '20px 28px',
            marginBottom: '40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>Ваш прогресс</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2f70d2' }}>{progress}%</div>
              </div>
              <div style={{ flex: 1, maxWidth: '400px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    backgroundColor: '#2f70d2', 
                    borderRadius: '4px',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Список уроков */}
        {lessons.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px', 
            backgroundColor: 'white', 
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Уроков пока нет</h3>
            <p style={{ color: '#666' }}>Скоро здесь появятся уроки</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isLocked = user?.role === 'Student' && index > 0 && !completedLessons.includes(lessons[index - 1]?.id);
              
              return (
                <div key={lesson.id}>
                  <Link 
                    to={`/course/${courseId}/lesson/${lesson.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '20px 24px',
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      opacity: isLocked ? 0.6 : 1,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: user ? 'pointer' : 'default'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLocked && user) {
                        e.currentTarget.style.transform = 'translateX(8px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                    }}>
                      {/* Номер урока */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: isCompleted ? '#2f70d2' : '#e8f0fe',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: isCompleted ? 'white' : '#2f70d2'
                      }}>
                        {isCompleted ? '✓' : lesson.orderIndex || index + 1}
                      </div>
                      
                      {/* Информация об уроке */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '18px', 
                          fontWeight: 'bold', 
                          color: '#333',
                          marginBottom: '4px'
                        }}>
                          {lesson.title}
                        </h3>
                        {lesson.content && (
                          <p style={{ color: '#888', fontSize: '14px' }}>
                            {lesson.content.substring(0, 80)}...
                          </p>
                        )}
                      </div>

                      {/* Кнопка завершения */}
                      {user?.role === 'Student' && !isCompleted && !isLocked && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            completeLesson(lesson.id);
                          }}
                          style={{
                            padding: '8px 20px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 'bold'
                          }}
                        >
                          Завершить урок
                        </button>
                      )}
                      
                      {isLocked && <div style={{ color: '#999', fontSize: '20px' }}>🔒</div>}
                      {lesson.videoUrl && !isLocked && <div style={{ color: '#2f70d2', fontSize: '20px' }}>🎥</div>}
                    </div>
                  </Link>

                  {/* Кнопки для преподавателя/админа */}
                  {(user?.role === 'Teacher' || user?.role === 'Admin') && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', marginLeft: '64px' }}>
                      <button
                        onClick={() => handleEditLesson(lesson.id)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#e8f0fe',
                          color: '#2f70d2',
                          border: 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        ✏️ Редактировать
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#fee',
                          color: '#e74c3c',
                          border: 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ Удалить
                      </button>
                      <button
                        onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}/manage-test`)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#fff3e0',
                          color: '#ff9800',
                          border: 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        📝 Управлять тестом
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};