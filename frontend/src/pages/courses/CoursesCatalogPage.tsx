import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';
import { enrollmentsApi } from '../../shared/api/enrollments';
import toast from 'react-hot-toast';
import { AgreementModal } from '../../components/AgreementModal';

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
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [enrollingCourseId, setEnrollingCourseId] = useState<number | null>(null);
  
  // Состояние для модального окна соглашения
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<{ id: number; title: string; price: number } | null>(null);

  // Загрузка записанных курсов
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user?.role === 'Student') {
        try {
          const response = await apiClient.get(`/enrollments/student/${user.id}`);
          let enrollments = [];
          if (Array.isArray(response.data)) {
            enrollments = response.data;
          } else if (response.data?.items) {
            enrollments = response.data.items;
          }
          const ids = enrollments.map((e: any) => e.courseId || e.course?.id);
          setEnrolledCourseIds(ids);
        } catch (err) {
          console.error('Ошибка загрузки записанных курсов:', err);
        }
      }
    };
    fetchEnrolledCourses();
  }, [user]);

  // Загрузка всех курсов
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

 const handlePaymentClick = (courseId: number, courseTitle: string, coursePrice: number) => {
  console.log('handlePaymentClick вызван', { courseId, courseTitle, coursePrice });
  setSelectedCourseForPayment({ id: courseId, title: courseTitle, price: coursePrice });
};

// Добавь в компонент, чтобы проверить, меняется ли состояние
console.log('selectedCourseForPayment:', selectedCourseForPayment);

const handleConfirmPayment = async () => {
  if (selectedCourseForPayment) {
    await handleEnrollWithPayment(selectedCourseForPayment.id);
    setSelectedCourseForPayment(null);
  }
};

  const handleEnrollWithPayment = async (courseId: number) => {
    try {
      setEnrollingCourseId(courseId);
      const result = await enrollmentsApi.enrollWithPayment(courseId);
      
      if (result.paymentUrl) {
        window.open(result.paymentUrl, '_blank');
        toast.success('Вы перенаправлены на страницу оплаты');
      } else {
        toast.error('Ошибка: не получена ссылка на оплату');
      }
      
      const checkInterval = setInterval(async () => {
        const status = await enrollmentsApi.checkPaymentStatus(result.enrollmentId);
        if (status.isPaid) {
          clearInterval(checkInterval);
          toast.success('Оплата прошла успешно! Курс добавлен в "Мои курсы".');
          window.location.reload();
        }
      }, 3000);
      
    } catch (err) {
      console.error('Ошибка:', err);
      toast.error('Ошибка при создании платежа');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const levelNames: Record<string, string> = {
    'all': 'Все уровни',
    'Beginner': 'Начинающий',
    'Intermediate': 'Средний',
    'Advanced': 'Продвинутый'
  };

  const levelColors: Record<string, string> = {
    'Beginner': '#4caf50',
    'Intermediate': '#ff9800',
    'Advanced': '#f44336'
  };

  const filteredCourses = selectedLevel === 'all' 
    ? courses 
    : courses.filter(c => c.level === selectedLevel);

  if (loading) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                padding: '24px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                <div style={{ height: '28px', backgroundColor: '#e0e0e0', borderRadius: '8px', marginBottom: '16px', width: '70%' }} />
                <div style={{ height: '16px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '16px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '24px', width: '80%' }} />
                <div style={{ height: '40px', backgroundColor: '#e0e0e0', borderRadius: '30px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Заголовок */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#0A2F5A', 
            marginBottom: '16px',
            fontFamily: "'Soyuz Grotesk', 'Montserrat', sans-serif"
          }}>
            Все курсы шведского языка
          </h1>
          <p style={{ fontSize: '18px', color: '#555', maxWidth: '600px', margin: '0 auto' }}>
            Выберите курс, который подходит именно вам, и начните обучение уже сегодня
          </p>
        </div>

        {/* Фильтры */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '12px', 
          flexWrap: 'wrap', 
          marginBottom: '48px'
        }}>
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              style={{
                padding: '10px 24px',
                borderRadius: '40px',
                border: 'none',
                backgroundColor: selectedLevel === level ? '#2f70d2' : 'white',
                color: selectedLevel === level ? 'white' : '#2f70d2',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                boxShadow: selectedLevel === level ? '0 4px 12px rgba(47,112,210,0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {levelNames[level]}
            </button>
          ))}
        </div>

        {/* Сетка курсов */}
        {filteredCourses.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px', 
            backgroundColor: 'white', 
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Курсы не найдены</h3>
            <p style={{ color: '#666' }}>Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
            {filteredCourses.map(course => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              
              return (
                <div 
                  key={course.id} 
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '24px', 
                    padding: '28px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Уровень */}
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{
                      backgroundColor: `${levelColors[course.level]}20`,
                      color: levelColors[course.level],
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}>
                      {levelNames[course.level]}
                    </span>
                  </div>

                  {/* Заголовок */}
                  <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#0A2F5A', 
                    marginBottom: '12px',
                    lineHeight: '1.3'
                  }}>
                    {course.title}
                  </h2>

                  {/* Описание */}
                  <p style={{ 
                    color: '#666', 
                    fontSize: '15px', 
                    lineHeight: '1.5', 
                    marginBottom: '20px',
                    flex: 1
                  }}>
                    {course.description.length > 120 
                      ? course.description.substring(0, 120) + '...' 
                      : course.description}
                  </p>

                  {/* Преподаватель */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '16px',
                    color: '#888',
                    fontSize: '14px'
                  }}>
                    <span>👨‍🏫</span>
                    <span>{course.teacherName}</span>
                    <span style={{ marginLeft: 'auto' }}>⏱ {course.durationHours} ч</span>
                  </div>

                  {/* Цена */}
                  <div style={{ 
                    borderTop: '1px solid #eee', 
                    paddingTop: '20px',
                    marginBottom: '20px'
                  }}>
                    <span style={{ 
                      fontSize: '32px', 
                      fontWeight: 'bold', 
                      color: '#2f70d2'
                    }}>
                      {course.price.toLocaleString()} ₽
                    </span>
                  </div>

                  {/* Кнопка */}
                  {user?.role === 'Student' ? (
                    isEnrolled ? (
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ 
                          backgroundColor: '#e8f5e9', 
                          color: '#2e7d32', 
                          padding: '10px', 
                          borderRadius: '40px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          marginBottom: '12px'
                        }}>
                          ✅ Вы записаны на курс
                        </div>
                        <Link to={`/course/${course.id}/lessons`}>
                          <button style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#e8f0fe',
                            color: '#2f70d2',
                            border: 'none',
                            borderRadius: '40px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            transition: 'background 0.2s'
                          }}>
                            Перейти к урокам →
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handlePaymentClick(course.id, course.title, course.price)}
                        disabled={enrollingCourseId === course.id}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '40px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          transition: 'transform 0.2s, opacity 0.2s',
                          opacity: enrollingCourseId === course.id ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (enrollingCourseId !== course.id) {
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {enrollingCourseId === course.id ? 'Обработка...' : `Записаться • ${course.price.toLocaleString()} ₽`}
                      </button>
                    )
                  ) : user && (
                    <Link to={`/course/${course.id}/lessons`}>
                      <button style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#e8f0fe',
                        color: '#2f70d2',
                        border: 'none',
                        borderRadius: '40px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}>
                        Смотреть уроки
                      </button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Модальное окно соглашения */}
      <AgreementModal
        isOpen={!!selectedCourseForPayment}
        onClose={() => setSelectedCourseForPayment(null)}
        onAgree={handleConfirmPayment}
        courseTitle={selectedCourseForPayment?.title || ''}
        coursePrice={selectedCourseForPayment?.price || 0}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};