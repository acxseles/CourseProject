import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  courseTitle: string;
  coursePrice: number;
}

export const AgreementModal = ({ isOpen, onClose, onAgree, courseTitle, coursePrice }: AgreementModalProps) => {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleAgree = () => {
    if (agreed) {
      onAgree();
      setAgreed(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        width: '600px',
        maxWidth: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Заголовок */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0A2F5A' }}>
            Пользовательское соглашение
          </h2>
          <button onClick={onClose} style={{ cursor: 'pointer', color: '#9ca3af' }}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Содержание */}
        <div style={{ padding: '20px', maxHeight: '400px', overflow: 'auto' }}>
          <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '16px' }}>Нажимая «Оплатить», я принимаю условия данного пользовательского соглашения.</p>
            
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '16px', marginBottom: '8px', color: '#0A2F5A' }}>1. Общие положения</h3>
            <p>1.1. Настоящее соглашение регулирует порядок приобретения доступа к онлайн-курсам на платформе «Schwedish».</p>
            <p>1.2. Оплата курса означает полное и безоговорочное принятие всех условий настоящего соглашения.</p>
            
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '16px', marginBottom: '8px', color: '#0A2F5A' }}>2. Оплата курса</h3>
            <p>2.1. Стоимость курса "{courseTitle}" составляет {coursePrice} рублей.</p>
            <p>2.2. Оплата производится через платежную систему ЮKassa.</p>
            <p>2.3. После успешной оплаты доступ к курсу открывается автоматически в течение 5 минут.</p>
            
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '16px', marginBottom: '8px', color: '#0A2F5A' }}>3. Возврат средств</h3>
            <p>3.1. Возврат средств возможен в течение 14 дней с момента оплаты при условии, что курс не был пройден более чем на 10%.</p>
            <p>3.2. Для возврата необходимо написать заявление на почту support@schwedish.ru.</p>
            
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '16px', marginBottom: '8px', color: '#0A2F5A' }}>4. Права и обязанности сторон</h3>
            <p>4.1. Платформа обязуется предоставить доступ к курсу в течение 5 минут после оплаты.</p>
            <p>4.2. Студент обязуется не передавать доступ к курсу третьим лицам.</p>
            <p>4.3. Материалы курса защищены авторским правом и не подлежат копированию.</p>
            
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '16px', marginBottom: '8px', color: '#0A2F5A' }}>5. Конфиденциальность</h3>
            <p>5.1. Ваши платежные данные обрабатываются платежной системой и не хранятся на сайте.</p>
            <p>5.2. Мы используем вашу электронную почту только для связи по курсу.</p>
          </div>
        </div>

        {/* Нижняя часть */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ color: '#374151' }}>
              Я ознакомлен(а) и согласен(а) с условиями пользовательского соглашения
            </span>
          </label>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleAgree}
              disabled={!agreed}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: agreed ? '#2f70d2' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: agreed ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
            >
              Оплатить {coursePrice} ₽
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};