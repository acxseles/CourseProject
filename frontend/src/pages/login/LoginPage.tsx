import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/model/authStore';

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ВНИМАНИЕ: Проверьте, как называется переменная в вашем useAuthStore. 
  // Если там 'isAuth', то пишем: const { login, register, isAuth, isLoading } = useAuthStore();
  const { login, register, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Метод login обновит стейт, и useEffect сам перекинет на /dashboard
        await login({ email, password });
      } else {
        await register({ email, password, firstName, lastName });
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
    }
  };
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2f70d2 30%, #27ace0 70%, #5bb9e8 100%)'
    }}>
      {/* Левая часть - белая форма */}
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        borderTopRightRadius: '60px',
        borderBottomRightRadius: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        marginRight: '-40px',
        zIndex: 2,
        boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
      }}>
        {/* Логотип сверху слева */}
       <div style={{ position: 'absolute', top: '30px', left: '60px' }}>
  <Link to="/">
    <img src="/images/logo.png" alt="Лого" style={{ height: '50px', cursor: 'pointer' }} />
  </Link>
</div>

        <div style={{ maxWidth: '450px', width: '100%', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: "'Soyuz Grotesk', 'Montserrat', sans-serif",
            fontSize: '42px',
            fontWeight: 700,
            color: '#0A2F5A',
            marginBottom: '12px'
          }}>
            Välkommen!
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '40px'
          }}>
            {isLogin ? 'Войдите в свой профиль' : 'Создайте новый аккаунт'}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Имя"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '14px 18px',
                    borderRadius: '30px',
                    border: '1px solid #e0e0e0',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#2f70d2'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                  required
                />
                <input
                  type="text"
                  placeholder="Фамилия"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '14px 18px',
                    borderRadius: '30px',
                    border: '1px solid #e0e0e0',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#2f70d2'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                  required
                />
              </div>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '30px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                marginBottom: '20px',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2f70d2'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              required
            />

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '30px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                marginBottom: '30px',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#2f70d2'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#2f70d2',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                marginBottom: '20px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2f70d2',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </form>

          {/* Декоративные элементы */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '60px',
            display: 'flex',
            gap: '8px'
          }}>
            <div style={{ width: '40px', height: '3px', backgroundColor: '#2f70d2', borderRadius: '3px' }} />
            <div style={{ width: '20px', height: '3px', backgroundColor: '#27ace0', borderRadius: '3px' }} />
            <div style={{ width: '10px', height: '3px', backgroundColor: '#5bb9e8', borderRadius: '3px' }} />
          </div>
        </div>
      </div>

      {/* Правая часть - синий фон с лосем */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '60px'
      }}>
        {/* Лось на всю высоту */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/images/лось.png" 
            alt="Лось"
            style={{
              width: '80%',
              maxWidth: '500px',
              height: 'auto',
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))'
            }}
          />
        </div>

        {/* Декоративные элементы */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          textAlign: 'right',
          color: 'white',
          fontSize: '12px',
          opacity: 0.6
        }}>
          <p>Школа шведского языка онлайн</p>
        </div>

        <div style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,215,0,0.15)'
        }} />

        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '40px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)'
        }} />
      </div>
    </div>
  );
};