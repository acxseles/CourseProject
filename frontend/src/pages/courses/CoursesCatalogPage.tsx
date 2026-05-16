import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';
import { enrollmentsApi } from '../../shared/api/enrollments';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  price: number;
  durationHours: number;
  teacherName: string;
}

export const CoursesCatalogPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');
  // Состояние для отслеживания процесса записи
    const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null);

// Функция записи на курс
const handleEnroll = async (courseId: number) => {
  try {
    setEnrollingCourseId(courseId);
   await enrollmentsApi.enrollWithPayment(courseId, user?.id!);
    alert('Вы успешно записались на курс!');
  } catch (err: any) {
    console.error('Ошибка:', err);
    alert(err.response?.data?.message || 'Ошибка при записи на курс');
  } finally {
    setEnrollingCourseId(null);
  }
};

// Функция записи с оплатой
const handleEnrollWithPayment = async (courseId: number) => {
  try {
    setEnrollingCourseId(courseId);
    const result = await enrollmentsApi.enrollWithPayment(courseId, user?.id!);
    
    // Открываем окно оплаты
    window.open(result.paymentUrl, '_blank');
    
    // Показываем сообщение
    alert('Вы перенаправлены на страницу оплаты. После оплаты курс появится в вашем профиле.');
    
    // Периодически проверяем статус оплаты
    const checkInterval = setInterval(async () => {
      const status = await enrollmentsApi.checkEnrollmentStatus(result.enrollmentId);
      if (status.isPaid) {
        clearInterval(checkInterval);
        alert('Оплата прошла успешно! Вы записаны на курс.');
        // Обновляем страницу
        window.location.reload();
      }
    }, 3000); // проверяем каждые 3 секунды
    
  } catch (err: any) {
    console.error('Ошибка:', err);
    alert(err.response?.data?.message || 'Ошибка при создании платежа');
  } finally {
    setEnrollingCourseId(null);
  }
};

  useEffect(() => {
    apiClient.get('/courses')
      .then(response => {
        setCourses(response.data?.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setLoading(false);
      });
  }, []);

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const levelNames: Record<string, string> = {
    'all': 'Все уровни',
    'Beginner': 'Начинающий (A1)',
    'Intermediate': 'Средний (A2-B1)',
    'Advanced': 'Продвинутый (B2-C1)'
  };

  const filteredCourses = selectedLevel === 'all' 
    ? courses 
    : courses.filter(c => c.level === selectedLevel);

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Загрузка...</div>;
  }

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '12px' }}>
          Все курсы шведского языка
        </h1>
        <p style={{ fontSize: '18px', color: '#555', marginBottom: '32px' }}>
          Выберите курс, который подходит именно вам
        </p>

        {/* Фильтры */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              style={{
                padding: '8px 20px',
                borderRadius: '30px',
                border: '1px solid #2f70d2',
                backgroundColor: selectedLevel === level ? '#2f70d2' : 'white',
                color: selectedLevel === level ? 'white' : '#2f70d2',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {levelNames[level]}
            </button>
          ))}
        </div>

        {/* Сетка курсов */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
          {filteredCourses.map(course => (
            <div key={course.id} style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <img 
                src="/images/course-placeholder.jpg" 
                alt={course.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', backgroundColor: '#2f70d2' }}
                onError={(e) => e.currentTarget.src = 'https://placehold.co/600x400/2f70d2/white?text=Course'}
              />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ backgroundColor: '#e8f0fe', color: '#2f70d2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {levelNames[course.level]}
                  </span>
                  <span style={{ color: '#666', fontSize: '14px' }}>👨‍🏫 {course.teacherName}</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '10px' }}>{course.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>{course.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#2f70d2' }}>{course.price} ₽</span>
                  <span style={{ color: '#888', fontSize: '14px' }}>⏱ {course.durationHours} часов</span>

                  
                </div>
                {user && (
                  <Link to={`/course/${course.id}/lessons`}>
                    {user?.role === 'Student' ? (
  <button 
    onClick={() => handleEnrollWithPayment(course.id)}
    disabled={enrollingCourseId === course.id}
    style={{
      width: '100%',
      marginTop: '16px',
      padding: '10px',
      backgroundColor: '#2f70d2',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      opacity: enrollingCourseId === course.id ? 0.7 : 1
    }}
  >
    {enrollingCourseId === course.id ? 'Обработка...' : `Записаться • ${course.price} ₽`}
  </button>
) : user && (
  <Link to={`/course/${course.id}/lessons`}>
    <button style={{
      width: '100%',
      marginTop: '16px',
      padding: '10px',
      backgroundColor: '#e8f0fe',
      color: '#2f70d2',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer'
    }}>
      Смотреть уроки
    </button>
  </Link>
)}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};