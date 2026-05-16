import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';

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
  if (!courseId || !lessonId) {
  return <div>Неверные параметры</div>;
}
  const { user } = useAuth();
  
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Получаем курс
      const courseRes = await apiClient.get(`/courses/${courseId}`);
      setCourse(courseRes.data);
      
      // Получаем конкретный урок
      const lessonRes = await apiClient.get(`/courses/${courseId}/lessons/${lessonId}`);
      setLesson(lessonRes.data);
      
      // Получаем список всех уроков для навигации
      const lessonsRes = await apiClient.get(`/courses/${courseId}/lessons`);
      let lessonsList = [];
      if (Array.isArray(lessonsRes.data)) {
        lessonsList = lessonsRes.data;
      } else if (lessonsRes.data?.items) {
        lessonsList = lessonsRes.data.items;
      }
      setAllLessons(lessonsList);
      
    } catch (err) {
      console.error('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [courseId, lessonId]);

  const handleComplete = async () => {
    if (completed) return;
    
    try {
      setIsCompleting(true);
      await apiClient.post(`/lessons/${lessonId}/complete`);
      setCompleted(true);
      alert('Урок завершён!');
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Не удалось завершить урок');
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
      alert('Это последний урок курса!');
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Загрузка урока...</div>
      </div>
    );
  }

  if (!lesson) {
    return <div>Урок не найден</div>;
  }

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  return (
    <div>
      {/* Навигация */}
      <div style={{ marginBottom: '24px' }}>
        <Link to={`/course/${courseId}/lessons`} style={{ color: '#2f70d2', textDecoration: 'none' }}>
          ← Назад к урокам
        </Link>
        <span style={{ margin: '0 12px', color: '#ccc' }}>|</span>
        <span style={{ color: '#666' }}>{course?.title}</span>
      </div>

      {/* Заголовок урока */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#2f70d2',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            {lesson.orderIndex || currentIndex + 1}
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0A2F5A', margin: 0 }}>
            {lesson.title}
          </h1>
        </div>
        
        {lesson.videoUrl && (
          <div style={{
            backgroundColor: '#f0f0f0',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            marginTop: '16px'
          }}>
            <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2f70d2' }}>
              🎥 Смотреть видео к уроку
            </a>
          </div>
        )}
      </div>

      {/* Содержание урока */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        lineHeight: '1.6',
        fontSize: '16px',
        color: '#333'
      }}>
        {lesson.content?.split('\n').map((paragraph, idx) => (
          <p key={idx} style={{ marginBottom: '16px' }}>
            {paragraph}
          </p>
        )) || <p>Содержание урока скоро появится</p>}
      </div>

      {/* Навигация между уроками */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'space-between' }}>
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
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ← Предыдущий урок
        </button>

        {user?.role === 'Student' && (
          <button
            onClick={handleComplete}
            disabled={completed || isCompleting}
            style={{
              padding: '12px 32px',
              backgroundColor: completed ? '#4caf50' : '#2f70d2',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: completed ? 'default' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: isCompleting ? 0.7 : 1
            }}
          >
            {isCompleting ? 'Завершение...' : completed ? '✓ Урок пройден' : 'Завершить урок'}
          </button>
        )}

        <button
          onClick={goToNextLesson}
          disabled={!hasNext}
          style={{
            padding: '12px 24px',
            backgroundColor: hasNext ? '#2f70d2' : '#f0f0f0',
            color: hasNext ? 'white' : '#999',
            border: 'none',
            borderRadius: '30px',
            cursor: hasNext ? 'pointer' : 'default',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Следующий урок →
        </button>

        <Link to={`/course/${courseId}/lesson/${lessonId}/test`}>
  <button style={{
    padding: '12px 24px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  }}>
    📝 Пройти тест
  </button>
</Link>
      </div>
    </div>
  );
};