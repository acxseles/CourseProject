import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';
import toast from 'react-hot-toast';

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoUrl?: string;
  orderIndex: number;
  courseId: number;
}

interface Course {
  id: number;
  title: string;
}

export const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  if (!courseId || !lessonId) {
  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
      <h2>Неверные параметры</h2>
      <Link to="/courses">
        <button style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#2f70d2', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>
          Вернуться к курсам
        </button>
      </Link>
    </div>
  );
}

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
        setAllLessons(lessonsList);
        
       const foundLesson = lessonsList.find((l: Lesson) => l.id === parseInt(lessonId));
        setLesson(foundLesson || null);
        
        if (user?.role === 'Student') {
          try {
            const progressRes = await apiClient.get(`/courses/${courseId}/progress`);
            const completedIds = progressRes.data?.completedLessonIds || [];
            setCompleted(completedIds.includes(parseInt(lessonId)));
          } catch (err) {
            console.log('Прогресс пока не доступен');
          }
        }
      } catch (err) {
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, lessonId, user]);

  const handleComplete = async () => {
  console.log('=== ЗАВЕРШЕНИЕ УРОКА ===');
  console.log('lessonId:', lessonId);
  
  try {
    setIsCompleting(true);
    const response = await apiClient.post(`/lessons/${lessonId}/complete`);
    console.log('Ответ сервера:', response.data);
    setCompleted(true);
    toast.success('Урок завершён!');
  } catch (err: any) {
    console.error('Ошибка:', err);
    console.error('Статус:', err.response?.status);
    console.error('Данные:', err.response?.data);
    toast.success(`Не удалось завершить урок: ${err.response?.data?.message || err.message}`);
  } finally {
    setIsCompleting(false);
  }
};

  const goToNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId));
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
    } else {
      toast.success('Это последний урок курса!');
      navigate(`/course/${courseId}/lessons`);
    }
  };

  const goToPreviousLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId));
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      navigate(`/course/${courseId}/lesson/${prevLesson.id}`);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', color: '#666' }}>Загрузка урока...</div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
          <h2>Урок не найден</h2>
          <Link to={`/course/${courseId}/lessons`}>
            <button style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#2f70d2', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>
              Вернуться к урокам
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Навигация */}
        <div style={{ marginBottom: '24px' }}>
          <Link 
            to={`/course/${courseId}/lessons`} 
            style={{ 
              color: '#2f70d2', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '500'
            }}
          >
            ← Назад к урокам
          </Link>
          <span style={{ margin: '0 12px', color: '#ccc' }}>|</span>
          <span style={{ color: '#666' }}>{course?.title}</span>
        </div>

        {/* Заголовок урока */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#2f70d2',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '24px'
            }}>
              {lesson.orderIndex || currentIndex + 1}
            </div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#0A2F5A', 
              margin: 0,
              fontFamily: "'Soyuz Grotesk', 'Montserrat', sans-serif"
            }}>
              {lesson.title}
            </h1>
          </div>
          
          {lesson.videoUrl && (
            <div style={{
              backgroundColor: '#f0f4f8',
              borderRadius: '20px',
              padding: '16px 24px',
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>🎥</span>
              <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2f70d2', textDecoration: 'none', fontWeight: '500' }}>
                Смотреть видео к уроку
              </a>
            </div>
          )}
        </div>

        {/* Содержание урока */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          lineHeight: '1.7',
          fontSize: '16px',
          color: '#333',
          marginBottom: '32px'
        }}>
          {lesson.content?.split('\n').map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '16px' }}>
              {paragraph}
            </p>
          )) || <p>Содержание урока скоро появится</p>}
        </div>

        {/* Навигация между уроками и кнопки действий */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={goToPreviousLesson}
              disabled={!hasPrevious}
              style={{
                padding: '12px 24px',
                backgroundColor: hasPrevious ? '#e8f0fe' : '#f0f0f0',
                color: hasPrevious ? '#2f70d2' : '#999',
                border: 'none',
                borderRadius: '30px',
                cursor: hasPrevious ? 'pointer' : 'default',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← Предыдущий урок
            </button>

            <Link to={`/course/${courseId}/lessons`}>
              <button style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                📚 Все уроки
              </button>
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {user?.role === 'Student' && (
              <button
                onClick={handleComplete}
                disabled={completed || isCompleting}
                style={{
                  padding: '12px 28px',
                  backgroundColor: completed ? '#4caf50' : '#2f70d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: completed ? 'default' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  opacity: isCompleting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isCompleting ? 'Завершение...' : completed ? '✓ Урок пройден' : 'Завершить урок'}
              </button>
            )}

            <button
                onClick={goToNextLesson}
                disabled={!hasNext || (user?.role === 'Student' && !completed)}
                style={{
                  padding: '12px 28px',
                  backgroundColor: (hasNext && (user?.role !== 'Student' || completed)) ? '#2f70d2' : '#f0f0f0',
                  color: (hasNext && (user?.role !== 'Student' || completed)) ? 'white' : '#999',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: (hasNext && (user?.role !== 'Student' || completed)) ? 'pointer' : 'default',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Следующий урок →
            </button>
          </div>
        </div>

        {/* Кнопка теста (для студента) */}
        {user?.role === 'Student' && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Link to={`/course/${courseId}/lesson/${lessonId}/test`}>
              <button style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                📝 Пройти тест
              </button>
            </Link>
          </div>
        )}
        {/* Кнопка создания теста (для админа и преподавателя) */}
        {(user?.role === 'Admin' || user?.role === 'Teacher') && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Link to={`/course/${courseId}/lesson/${lessonId}/manage-test`}> {/* Уточните этот путь */}
              <button style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', // Сделал зеленой для примера
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                ➕ Создать тест
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};