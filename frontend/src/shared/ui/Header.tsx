import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 100
    }}>
      {/* Три полоски (меню) */}
      <button
        onClick={onMenuClick}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2f70d2" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Логотип */}
      <Link to="/">
        <img src="/images/logo.png" alt="Лого" style={{ height: '40px' }} />
      </Link>

      {/* Кнопка входа/выхода */}
      {user ? (
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
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Выйти
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: '#2f70d2',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '8px 24px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Войти
        </button>
      )}
    </header>
  );
};