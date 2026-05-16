import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // ← Link и useNavigate вместе
import { useAuth } from '../../features/auth/hooks/useAuth';
import type { Course } from '../../shared/api/courses';
import { apiClient } from '../../shared/api/client';



export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [myCourses, setMyCourses] = useState<Course[]>([]);
const [loadingCourses, setLoadingCourses] = useState(false);

  // Эффект для перенаправления на страницу курсов
  useEffect(() => {
  const fetchStudentCourses = async () => {
    if (user?.role === 'Student') {
      try {
        setLoadingCourses(true);
        const response = await apiClient.get('/courses/my');
        setMyCourses(response.data?.items || []);
      } catch (err) {
        console.error('Ошибка загрузки курсов:', err);
      } finally {
        setLoadingCourses(false);
      }
    }
  };
  fetchStudentCourses();
}, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Меню в зависимости от роли
 const getMenuItems = () => {
  if (user?.role === 'Student') {
    return [
      { id: 'profile', label: 'Профиль' },
      { id: 'my-courses', label: 'Мои курсы', link: '/my-courses' },
      { id: 'catalog', label: 'Каталог курсов', link: '/courses' },
    ];
  }
  if (user?.role === 'Teacher') {
    return [
      { id: 'profile', label: 'Профиль' },
      { id: 'my-courses', label: 'Мои курсы', link: '/my-courses' },
    ];
  }
  if (user?.role === 'Admin') {
    return [
      { id: 'profile', label: 'Профиль' },
      { id: 'my-courses', label: 'Управление курсами', link: '/my-courses' },
    ];
  }
  return [{ id: 'profile', label: 'Профиль' }];
};

  const menuItems = getMenuItems();

  const renderContent = () => {
    // Убираем navigate из renderContent
    switch (activeTab) {
      case 'profile':
        return (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '30px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '28px',
              fontWeight: 700,
              color: '#0A2F5A',
              marginBottom: '24px'
            }}>
              Профиль
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#2f70d2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold'
              }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                  {user?.firstName} {user?.lastName}
                </h3>
                <p style={{ color: '#666' }}>{user?.email}</p>
                <span style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  backgroundColor: '#e8f0fe',
                  color: '#2f70d2',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {user?.role === 'student' ? 'Студент' : user?.role === 'teacher' ? 'Преподаватель' : 'Администратор'}
                </span>
              </div>
            </div>
          </div>
        );

        case 'my-courses':
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '30px', padding: '30px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '24px' }}>
        Мои курсы
      </h2>
      {myCourses.length === 0 ? (
        <p>Вы еще не записаны ни на один курс</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {myCourses.map(course => (
            <div key={course.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              border: '1px solid #eee',
              borderRadius: '16px'
            }}>
              <div>
                <h3 style={{ fontWeight: 'bold' }}>{course.title}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>{course.description}</p>
              </div>
              <Link to={`/course/${course.id}/lessons`}>
                <button style={{
                  padding: '8px 20px',
                  backgroundColor: '#2f70d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}>
                  Перейти к урокам →
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
      
      default:
        return (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '30px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '28px',
              fontWeight: 700,
              color: '#0A2F5A',
              marginBottom: '24px'
            }}>
              {menuItems.find(i => i.id === activeTab)?.label || 'Страница в разработке'}
            </h2>
            <p style={{ color: '#666' }}>Содержимое скоро появится</p>
          </div>
        );
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 100%)',
      minHeight: '100vh'
    }}>
      {/* Верхняя панель */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        zIndex: 30
      }}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2f70d2" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/">
          <img src="/images/logo.png" alt="Лого" style={{ height: '40px' }} />
        </Link>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#e74c3c',
            fontSize: '14px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Выйти
        </button>
      </div>

      {/* Боковое меню */}
      <div style={{
        position: 'fixed',
        top: 64,
        left: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: 'white',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
        zIndex: 25,
        padding: '20px'
      }}>
        <nav>
          {menuItems.map((item) => (
            <button
  key={item.id}
  onClick={() => {
    if (item.id === 'catalog') {
      navigate('/courses');
    } else {
      setActiveTab(item.id);
    }
    setIsSidebarOpen(false);
  }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px 16px',
                marginBottom: '8px',
                borderRadius: '16px',
                backgroundColor: activeTab === item.id ? '#2f70d2' : 'transparent',
                color: activeTab === item.id ? 'white' : '#333',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === item.id ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Затемнение */}
      {isSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 20
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Основной контент */}
      <div style={{ padding: '80px 24px 40px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};