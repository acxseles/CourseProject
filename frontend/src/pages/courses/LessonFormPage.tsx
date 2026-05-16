import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../shared/api/client';

export const LessonFormPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    orderIndex: 1
  });

 useEffect(() => {
  const fetchLesson = async () => {
    if (lessonId) {
      try {
        setLoading(true);
        // Используем существующий эндпоинт /courses/{courseId}/lessons/{lessonId}
        const response = await apiClient.get(`/courses/${courseId}/lessons/${lessonId}`);
        const lesson = response.data;
        setFormData({
          title: lesson.title,
          content: lesson.content || '',
          videoUrl: lesson.videoUrl || '',
          orderIndex: lesson.orderIndex
        });
      } catch (error) {
        console.error('Ошибка загрузки урока:', error);
        alert('Не удалось загрузить данные урока');
      } finally {
        setLoading(false);
      }
    }
  };
  fetchLesson();
}, [lessonId, courseId]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    
    const dataToSend = {
      title: formData.title,
      content: formData.content,
      videoUrl: formData.videoUrl,
      orderIndex: formData.orderIndex
    };
    
    if (lessonId) {
      // Обновление через PUT /courses/{courseId}/lessons/{lessonId}
      await apiClient.put(`/courses/${courseId}/lessons/${lessonId}`, dataToSend);
      alert('Урок обновлён');
    } else {
      // Создание через POST /courses/{courseId}/lessons
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
          <input
            type="text"
            placeholder="Название урока *"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '16px', border: '1px solid #ddd' }}
            required
          />
          
          <textarea
            placeholder="Содержание урока"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={8}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '16px', border: '1px solid #ddd' }}
          />
          
          <input
            type="text"
            placeholder="Ссылка на видео (YouTube)"
            value={formData.videoUrl}
            onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '16px', border: '1px solid #ddd' }}
          />
          
          <input
            type="number"
            placeholder="Порядковый номер"
            value={formData.orderIndex}
            onChange={(e) => setFormData({...formData, orderIndex: Number(e.target.value)})}
            style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '16px', border: '1px solid #ddd' }}
          />
          
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