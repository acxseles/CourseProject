import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../shared/api/client';
import { useAuth } from '../../features/auth/hooks/useAuth';  // ← добавь импорт

export const CourseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();  // ← получаем текущего пользователя
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    price: 0,
    durationHours: 0,
    maxStudents: 30,
    isActive: true
  });

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/courses/${id}`);
          const course = response.data;
          setFormData({
            title: course.title,
            description: course.description || '',
            level: course.level,
            price: course.price,
            durationHours: course.durationHours,
            maxStudents: course.maxStudents,
            isActive: course.isActive
          });
        } catch (error) {
          console.error('Ошибка:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Проверка на минимальную длину описания
  if (formData.description.length < 10) {
    alert('Описание должно содержать минимум 10 символов');
    return;
  }
  
  try {
    setLoading(true);
    
    const dataToSend = {
      title: formData.title,
      description: formData.description,
      level: formData.level,
      price: Number(formData.price),
      durationHours: Number(formData.durationHours)
    };
    
    if (id) {
      await apiClient.put(`/courses/${id}`, dataToSend);
      alert('Курс обновлён');
    } else {
      await apiClient.post('/courses', dataToSend);
      alert('Курс создан');
    }
    navigate('/courses');
  } catch (error: any) {
    console.error('Ошибка:', error.response?.data);
    alert(error.response?.data?.message || 'Ошибка при сохранении курса');
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
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#0A2F5A' }}>
          {id ? 'Редактировать курс' : 'Новый курс'}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название курса"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '16px', border: '1px solid #ddd' }}
            required
          />
          
          <textarea
            placeholder="Описание"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '16px', border: '1px solid #ddd' }}
          />
          
          <select
            value={formData.level}
            onChange={(e) => setFormData({...formData, level: e.target.value})}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '16px', border: '1px solid #ddd' }}
          >
            <option value="Beginner">Начинающий (Beginner)</option>
            <option value="Intermediate">Средний (Intermediate)</option>
            <option value="Advanced">Продвинутый (Advanced)</option>
          </select>
          
          <input
            type="number"
            placeholder="Цена"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '16px', border: '1px solid #ddd' }}
          />
          
          <input
            type="number"
            placeholder="Длительность (часов)"
            value={formData.durationHours}
            onChange={(e) => setFormData({...formData, durationHours: Number(e.target.value)})}
            style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '16px', border: '1px solid #ddd' }}
          />
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
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
            {loading ? 'Сохранение...' : (id ? 'Сохранить' : 'Создать курс')}
          </button>
        </form>
      </div>
    </div>
  );
};