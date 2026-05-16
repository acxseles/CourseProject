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
    console.log('Удаляю урок:', `/courses/lessons/${lessonId}`);
    const response = await apiClient.delete(`/courses/lessons/${lessonId}`);
    console.log('Ответ сервера:', response.status);
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Загрузка уроков...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Link to={user?.role === 'Student' ? '/my-courses' : '/courses'} style={{ 
          color: '#2f70d2', 
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '16px'
        }}>
          ← Назад к курсам
        </Link>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '8px' }}>
          {course?.title}
        </h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '16px' }}>
          {course?.description}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{
            backgroundColor: '#e8f0fe',
            color: '#2f70d2',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {getLevelName(course?.level || 'Beginner')}
          </span>
          <span style={{ color: '#888', fontSize: '14px' }}>
            📚 Всего уроков: {lessons.length}
          </span>
        </div>
      </div>

      {(user?.role === 'Teacher' || user?.role === 'Admin') && (
        <Link to={`/course/${courseId}/lesson/new`}>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#2f70d2',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}>
            + Создать урок
          </button>
        </Link>
      )}

      {lessons.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          backgroundColor: 'white', 
          borderRadius: '24px' 
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Уроков пока нет</h3>
          <p style={{ color: '#666' }}>Скоро здесь появятся уроки</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = user?.role === 'Student' && index > 0 && !completedLessons.includes(lessons[index - 1]?.id);
            
            return (
              <div key={lesson.id} style={{ marginBottom: '16px' }}>
                {/* Карточка урока - обёрнута в Link */}
                <Link 
                  to={`/course/${courseId}/lesson/${lesson.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    opacity: isLocked ? 0.5 : 1,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLocked && user) {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: isCompleted ? '#2f70d2' : '#e8f0fe',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: isCompleted ? 'white' : '#2f70d2'
                    }}>
                      {isCompleted ? '✓' : lesson.orderIndex || index + 1}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                        {lesson.title}
                      </h3>
                      {lesson.content && (
                        <p style={{ color: '#888', fontSize: '14px' }}>
                          {lesson.content.substring(0, 80)}...
                        </p>
                      )}
                    </div>

                    {user?.role === 'Student' && !isCompleted && !isLocked && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          completeLesson(lesson.id);
                        }}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✓ Завершить урок
                      </button>
                    )}
                    
                    {isLocked && <div style={{ color: '#999' }}>🔒</div>}
                    {lesson.videoUrl && !isLocked && <div style={{ color: '#2f70d2' }}>🎥</div>}
                  </div>
                </Link>

                {/* Кнопки управления - ВНЕ Link */}
                {(user?.role === 'Teacher' || user?.role === 'Admin') && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', marginLeft: '56px' }}>
                    <button
                      onClick={() => handleEditLesson(lesson.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e8f0fe',
                        color: '#2f70d2',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#fee',
                        color: 'red',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Удалить
                    </button>
                    <button
                      onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}/manage-test`)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      📝 Тест
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};