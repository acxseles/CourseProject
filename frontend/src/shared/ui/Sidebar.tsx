import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, [window.location.pathname]);

  const getMenuItems = () => {
    if (user?.role === 'Student') {
      return [
        { id: 'profile', label: 'Профиль', link: '/dashboard' },
        { id: 'my-courses', label: 'Мои курсы', link: '/my-courses' },
        { id: 'catalog', label: 'Каталог курсов', link: '/courses' },
      ];
    }
    if (user?.role === 'Teacher') {
      return [
        { id: 'profile', label: 'Профиль', link: '/dashboard' },
        { id: 'my-courses', label: 'Мои курсы', link: '/my-courses' },
        { id: 'new-course', label: 'Создать курс', link: '/course/new' },
      ];
    }
    if (user?.role === 'Admin') {
      return [
        { id: 'profile', label: 'Профиль', link: '/dashboard' },
        { id: 'my-courses', label: 'Управление курсами', link: '/my-courses' },
        { id: 'users', label: 'Пользователи', link: '/users' }, 
        { id: 'import-export', label: 'Импорт/Экспорт', link: '/import-export' },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  if (!user) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '280px',
        backgroundColor: 'white',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        zIndex: 200,
        paddingTop: '80px'
      }}>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={onClose}
              style={{
                display: 'block',
                padding: '12px 24px',
                marginBottom: '8px',
                backgroundColor: activeLink === item.link ? '#e8f0fe' : 'transparent',
                color: activeLink === item.link ? '#2f70d2' : '#333',
                fontWeight: activeLink === item.link ? 'bold' : 'normal',
                textDecoration: 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeLink !== item.link) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (activeLink !== item.link) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 150
          }}
          onClick={onClose}
        />
      )}
    </>
  );
};