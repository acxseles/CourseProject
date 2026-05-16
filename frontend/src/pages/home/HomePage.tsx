import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface HomePageProps {
  onOpenAuth?: () => void;
}

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      border: '1px solid #206ec8',
      borderRadius: '60px',
      marginBottom: '16px',
      backgroundColor: isOpen ? '#e8f0fe' : 'white',  // светло-синий при открытии
      transition: 'all 0.3s',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '20px 30px',
          backgroundColor: isOpen ? '#e8f0fe' : 'white',
          border: 'none',
          borderRadius: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          fontSize: '18px',
          color: '#206ec8',
          textAlign: 'left',
          transition: 'background-color 0.3s'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = '#f0f5ff';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = 'white';
        }}
      >
        <span>{question}</span>
        <span style={{
          fontSize: '24px',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s',
          color: '#2f70d2'
        }}>
          +
        </span>
      </button>
      
      {isOpen && (
        <div style={{
          padding: '0 30px 20px 30px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          color: '#2f70d2',
          lineHeight: '1.5',
          backgroundColor: '#e8f0fe'
        }}>
          {answer}
        </div>
      )}
    </div>
  );
};
export const HomePage = ({ onOpenAuth }: HomePageProps) => {
 const navigate = useNavigate();
const { user } = useAuth();
  return (
    <div>
       {/* ========== БЛОК 1 ========== */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2f70d2 30%, #27ace0 70%, #5bb9e8 100%)',
        minHeight: '100vh',
        position: 'relative'
      }}>
        
   

       
<div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
  {user ? (
    <button 
      onClick={() => navigate('/dashboard')} 
      style={{ backgroundColor: 'white', color: '#1B4D8C', padding: '8px 24px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
    >
      Личный кабинет
    </button>
  ) : (
    <button 
      onClick={() => navigate('/login')} 
      style={{ backgroundColor: 'white', color: '#1B4D8C', padding: '8px 24px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
    >
      Войти
    </button>
  )}
</div>

        {/* Основной контент - текст и лось В ОДНОЙ СТРОКЕ */}
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '0 10%'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row',  // важно: горизонтально
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            gap: '60px'
          }}>
            
            {/* ТЕКСТ СЛЕВА */}
            <div style={{ flex: '1' }}>
              <p style={{ color: '#FFD700', marginBottom: '16px' }}>Школа шведского языка онлайн</p>
              <h1 style={{ fontSize: '50px', fontWeight: 800, color: 'white', marginBottom: '24px' }}>
                Изучай шведский<br /><span style={{ color: '#FECB2E' }}>легко и интересно</span>
              </h1>
              <button onClick={onOpenAuth} style={{ backgroundColor: 'white', color: '#1B4D8C', padding: '14px 32px', borderRadius: '40px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '40px' }}>Записаться на пробный урок</button>
              
              <div style={{ display: 'flex', gap: '30px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '30px' }}>
                <p style={{ color: 'white' }}>Для жизни, работы и путешествий</p>
                <p style={{ color: 'white' }}>С нуля до B2</p>
                <p style={{ color: 'white' }}>На основе материалов от шведских авторов</p>
              </div>
            </div>

            {/* ЛОСЬ СПРАВА */}
            <div style={{ flex: '1', textAlign: 'center' }}>
              <img src="/images/лось.png" alt="Лось" style={{ width: '100%', maxWidth: '450px', height: 'auto' }} />
            </div>

          </div>
        </div>
      </div>

      {/* ========== БЛОК 2: Белый фон с фигурами ========== */}
      <div style={{ 
        background: 'white',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 0',
        marginTop: '-40px',
        borderTopLeftRadius: '60px',
        borderTopRightRadius: '60px'
      }}>
        {/* Декоративные фигуры */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '150px',
          height: '150px',
          backgroundColor: '#FECB2E',
          borderRadius: '50%',
          opacity: 0.4,
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          width: '100px',
          height: '100px',
          backgroundColor: '#2f70d2',
          borderRadius: '20px',
          opacity: 0.3,
          transform: 'rotate(15deg)',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '8%',
          width: '80px',
          height: '80px',
          backgroundColor: '#FECB2E',
          borderRadius: '50%',
          opacity: 0.35,
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: '120px',
          height: '120px',
          backgroundColor: '#27ace0',
          borderRadius: '25px',
          opacity: 0.3,
          transform: 'rotate(45deg)',
          zIndex: 0
        }} />

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontFamily: "'Montserrat', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '36px',
              color: '#0A2F5A',
              marginBottom: '20px'
            }}>
              это платформа о шведском языке и Швеции
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '20px',
              color: '#333',
              marginBottom: '10px'
            }}>
              без формальностей и лишней теории.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '18px',
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Мы помогаем учить язык через реальный контекст: жизнь, культуру, новости и практику.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px',
            justifyContent: 'center'
          }}>
            <div style={{
              flex: '1',
              minWidth: '280px',
              maxWidth: '400px',
              backgroundColor: '#F5F5F7',
              borderRadius: '30px',
              padding: '50px 30px',
              textAlign: 'center',
              background: 'linear-gradient(145deg, #ffffff, #f0f0f4)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                color: '#0A2F5A',
                marginBottom: '15px'
              }}>
                онлайн-курс
              </h3>
              <p style={{ fontSize: '16px', color: '#666' }}>
                для самостоятельного изучения
              </p>
            </div>

            <div style={{
              flex: '1',
              minWidth: '280px',
              maxWidth: '400px',
              backgroundColor: '#F5F5F7',
              borderRadius: '30px',
              padding: '50px 30px',
              textAlign: 'center',
              background: 'linear-gradient(145deg, #ffffff, #f0f0f4)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                color: '#0A2F5A',
                marginBottom: '15px'
              }}>
                групповые и индивидуальные
              </h3>
              <p style={{ fontSize: '16px', color: '#666' }}>
                онлайн-уроки
              </p>
            </div>         
          </div>
        </div>
      </div>

      {/* ========== БЛОК 3: Фон с узорами + две карточки ========== */}
            <div style={{ 
        backgroundImage: 'url(/images/узоры.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 0',
        marginTop: '-40px',
        borderTopLeftRadius: '60px',
        borderTopRightRadius: '60px',
 marginBottom: '-60px' ,
        overflow: 'hidden'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 40px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '50px',
            justifyContent: 'center',
            alignItems: 'stretch'
          }}>
            {/* Карточка 1: Белая */}
            <div style={{
              flex: '1',
              minWidth: '350px',
              maxWidth: '550px',
              backgroundColor: 'white',
              borderRadius: '40px',
              padding: '50px 40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{
                fontFamily: "'Montserrat', 'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '32px',
                color: '#0A2F5A',
                marginBottom: '20px'
              }}>
                Экспресс-тест на уровень шведского языка
              </h2>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '18px',
                color: '#444',
                marginBottom: '25px',
                lineHeight: '1.5'
              }}>
                Если есть сомнения какую программу выбрать, пройдите короткий бесплатный тест и узнайте свой уровень шведского языка.
              </p>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#F0F0F0',
                padding: '10px 24px',
                borderRadius: '40px',
                marginBottom: '40px',
                alignSelf: 'flex-start'
              }}>
                <span style={{ fontSize: '18px', color: '#333' }}>📄 10-15 минут</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
                <button
                  onClick={onOpenAuth}
                  style={{
                    backgroundColor: '#0A2F5A',
                    color: 'white',
                    padding: '16px 48px',
                    borderRadius: '50px',
                    border: 'none',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    width: '80%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Начать тест →
                </button>
              </div>
            </div>

            {/* Карточка 2: Темно-синяя */}
            <div style={{
              flex: '1',
              minWidth: '350px',
              maxWidth: '550px',
              backgroundColor: '#0A2F5A',
              borderRadius: '40px',
              padding: '50px 40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#FFD700',
                letterSpacing: '3px',
                marginBottom: '15px',
                textTransform: 'uppercase'
              }}>
                Слово дня
              </p>
              <h2 style={{
                fontFamily: "'Montserrat', 'Inter', sans-serif",
                fontWeight: 800,
                fontSize: '56px',
                color: 'white',
                marginBottom: '30px'
              }}>
                Dagsmeja
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#FFD700',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                Значение
              </p>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '25px',
                borderRadius: '25px',
                marginBottom: '20px'
              }}>
                <p style={{
                  fontSize: '18px',
                  color: '#FFD700',
                  fontStyle: 'italic',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  tö i solskenet (trots att lufttemperaturen är under fryspunkten) || -n
                </p>
                <p style={{
                  fontSize: '18px',
                  color: 'white',
                  lineHeight: '1.4'
                }}>
                  оттепель (несмотря на температуру воздуха ниже нуля)
                </p>
              </div>
              
            </div>
          </div>
        </div>
        {/* СКРУГЛЕНИЕ  */}
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: 0,
          right: 0,
          height: '60px',
          background: 'transparent',
          borderTopLeftRadius: '60px',
          borderTopRightRadius: '60px',
           paddingTop: '60px',  
          boxShadow: '0 -30px 0 0 white'  
        }} />
      </div>
      

      {/* ========== БЛОК 4: Популярные курсы ========== */}
      <div style={{ 
        backgroundColor: 'white',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 0',
        borderTopLeftRadius: '60px',
        borderTopRightRadius: '60px'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 40px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '42px',
            color: '#0A2F5A',
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            Самые популярные курсы
          </h2>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px',
            justifyContent: 'center'
          }}>
            {/* Карточка 1 */}
            <div style={{
              flex: '1',
              minWidth: '300px',
              maxWidth: '380px',
              backgroundColor: 'white',
              borderRadius: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img 
                src="/images/курс1.png" 
                alt="Для начинающих"
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '25px' }}>
                <h3 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#0A2F5A',
                  marginBottom: '15px'
                }}>
                  Для начинающих
                </h3>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Уровень:</span>
                  <span style={{ fontWeight: 'bold', color: '#0A2F5A' }}>A1 - Начальный</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Длительность:</span>
                  <span style={{ fontWeight: 'bold', color: '#0A2F5A' }}>8 недель</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '25px'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Стоимость:</span>
                  <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#2f70d2' }}>9 990 ₽</span>
                </div>
                
                <button
                  onClick={onOpenAuth}
                  style={{
                    width: '100%',
                    backgroundColor: '#2f70d2',
                    color: 'white',
                    padding: '14px 0',
                    borderRadius: '40px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Записаться →
                </button>
              </div>
            </div>

            {/* Карточка 2 с хитом */}
            <div style={{
              flex: '1',
              minWidth: '300px',
              maxWidth: '380px',
              backgroundColor: 'white',
              borderRadius: '30px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
              overflow: 'visible',
              position: 'relative',
              transform: 'scale(1.02)'
            }}>
              {/* Плашка "Хит" обволакивает верх */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#FFD700',
                padding: '8px 24px',
                borderRadius: '0 0 20px 20px',  // скругление только снизу
                zIndex: 10,
                fontWeight: 'bold',
                color: '#0A2F5A',
                fontSize: '14px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap'
              }}>
                🔥 ХИТ
              </div>
              
              <img 
                src="/images/курс2.png" 
                alt="Разговорный шведский"
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover'
                }}
              />
              
              <div style={{ padding: '25px' }}>
                <h3 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#0A2F5A',
                  marginBottom: '15px'
                }}>
                  Разговорный шведский
                </h3>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Уровень:</span>
                  <span style={{ fontWeight: 'bold', color: '#0A2F5A' }}>A2 - Элементарный</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Длительность:</span>
                  <span style={{ fontWeight: 'bold', color: '#0A2F5A' }}>10 недель</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '25px'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Стоимость:</span>
                  <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#2f70d2' }}>12 990 ₽</span>
                </div>
                
                <button
                  onClick={onOpenAuth}
                  style={{
                    width: '100%',
                    backgroundColor: '#2f70d2',
                    color: 'white',
                    padding: '14px',
                    borderRadius: '40px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Записаться →
                </button>
              </div>
            </div>

            {/* Карточка 3 */}
            <div style={{
              flex: '1',
              minWidth: '300px',
              maxWidth: '380px',
              backgroundColor: 'white',
              borderRadius: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img 
                src="/images/лось3.png" 
                alt="Шведский для работы"
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover'
                }}
              />
              
              <div style={{ padding: '25px' }}>
                <h3 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#0A2F5A',
                  marginBottom: '15px'
                }}>
                  Шведский для работы
                </h3>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Уровень:</span>
                  <span style={{ fontWeight: 'bold', color: '#0A2F5A' }}>B1 - Средний</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #eee'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Длительность:</span>
                  <span style={{ fontWeight: 'bold', color: '#0A2F5A' }}>12 недель</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '25px'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>Стоимость:</span>
                  <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#2f70d2' }}>15 990 ₽</span>
                </div>
                
                <button
                  onClick={onOpenAuth}
                  style={{
                    width: '100%',
                    backgroundColor: '#2f70d2',
                    color: 'white',
                    padding: '14px',
                    borderRadius: '40px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Записаться →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

           {/* ========== БЛОК 5: Часто задаваемые вопросы ========== */}
      {/* Светло-синий блок со скруглением внизу */}
      <div style={{ 
        backgroundColor: '#e8f0fe',
        padding: '80px 0 0 0',
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px',
        borderTopLeftRadius: '60px',    // ← ДОБАВЬ ЭТО
        borderTopRightRadius: '60px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '0 20px 80px 20px',
          width: '100%'
        }}>
          <h2 style={{
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '42px',
            color: '#1861b5',
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            Часто задаваемые вопросы
          </h2>

          <FAQItem 
            question="С какого уровня можно начинать?"
            answer="Можно начинать с нуля. На платформе есть материалы для всех уровней — от A1 до C1. Если сомневаетесь, рекомендуем пройти наш бесплатный тест на определение уровня."
          />
          
          <FAQItem 
            question="Нужно ли регистрироваться, чтобы пользоваться платформой?"
            answer="Для доступа к бесплатным материалам регистрация не требуется. Для записи на курсы, прохождения тестов и отслеживания прогресса нужно создать аккаунт."
          />
          
          <FAQItem 
            question="Есть ли бесплатные материалы?"
            answer="Да, на платформе доступны бесплатные уроки, тесты и слово дня. Вы можете начать обучение бесплатно в любой момент."
          />
          
          <FAQItem 
            question="Подойдёт ли платформа, если я учу шведский для переезда или работы?"
            answer="Да! Наши курсы ориентированы на реальное использование языка в жизни, работе и переезде. Мы используем актуальные материалы и практические ситуации."
          />
          
          <FAQItem 
            question="Можно ли отменить подписку?"
            answer="Да, вы можете отменить подписку в любой момент в личном кабинете. После отмены доступ к курсам сохранится до конца оплаченного периода."
          />
        </div>
      </div>

      {/* ========== ПОДВАЛ С ЛОГОТИПОМ ========== */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2f70d2 30%, #27ace0 70%, #5bb9e8 100%)',
        padding: '40px 0 40px 0',
        textAlign: 'center',
        marginTop: '-60px',  // поднимаем вверх, чтобы перекрыть скругление
        position: 'relative',
        zIndex: 1
      }}>
        <img 
          src="/images/logo.png"
          alt="Логотип"
          style={{
            height: '40px',
            margin: 30,
            width: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}
        />
      </div>
    </div>
  );
};