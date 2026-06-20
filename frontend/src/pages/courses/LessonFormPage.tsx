import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../shared/api/client';

export const LessonFormPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    orderIndex: 1
  });

  useEffect(() => {
    if (lessonId) {
      const fetchLesson = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/courses/${courseId}/lessons/${lessonId}`);
          const lesson = response.data;
          setFormData({
            title: lesson.title,
            content: lesson.content || '',
            orderIndex: lesson.orderIndex
          });
        } catch (error) {
          console.error('Ошибка:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchLesson();
    }
  }, [lessonId, courseId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название урока обязательно';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Содержание урока обязательно';
    }
    if (formData.orderIndex <= 0) {
      newErrors.orderIndex = 'Порядковый номер должен быть больше 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const dataToSend = {
        title: formData.title,
        content: formData.content,
        orderIndex: formData.orderIndex
      };
      
      if (lessonId) {
        await apiClient.put(`/courses/${courseId}/lessons/${lessonId}`, dataToSend);
        alert('Урок обновлён');
      } else {
        await apiClient.post(`/courses/${courseId}/lessons`, dataToSend);
        alert('Урок создан');
      }
      navigate(`/course/${courseId}/lessons`);
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении урока');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 100%)',
      minHeight: '100vh',
      padding: '80px 24px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '30px', padding: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#0A2F5A' }}>
          {lessonId ? 'Редактировать урок' : 'Новый урок'}
        </h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>
          {lessonId ? 'Измените данные урока' : 'Добавьте новый урок в курс'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Название урока *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                border: `1px solid ${errors.title ? '#e74c3c' : '#ddd'}`,
                fontSize: '16px'
              }}
            />
            {errors.title && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Содержание урока *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={10}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                border: `1px solid ${errors.content ? '#e74c3c' : '#ddd'}`,
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
            {errors.content && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{errors.content}</p>}
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Порядковый номер
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={formData.orderIndex}
              onChange={(e) => setFormData({...formData, orderIndex: parseInt(e.target.value) || 1})}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                border: `1px solid ${errors.orderIndex ? '#e74c3c' : '#ddd'}`,
                fontSize: '16px'
              }}
            />
            {errors.orderIndex && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{errors.orderIndex}</p>}
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#2f70d2',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Сохранение...' : (lessonId ? 'Сохранить' : 'Создать урок')}
            </button>
            
            <Link to={`/course/${courseId}/lessons`}>
              <button
                type="button"
                style={{
                  padding: '14px 24px',
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                  borderRadius: '40px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};