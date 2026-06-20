import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';
import toast from 'react-hot-toast';

export const CourseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    price: 0,
    durationHours: 0
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
            durationHours: course.durationHours
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название курса обязательно';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Описание должно быть минимум 10 символов';
    }
    if (formData.price < 0) {
      newErrors.price = 'Цена не может быть отрицательной';
    }
    if (formData.durationHours <= 0) {
      newErrors.durationHours = 'Длительность должна быть больше 0 часов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNumberChange = (field: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setFormData({ ...formData, [field]: 0 });
    } else {
      setFormData({ ...formData, [field]: Math.max(0, numValue) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(`field-${firstError}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      setLoading(true);
      
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        price: Number(formData.price),
        durationHours: Number(formData.durationHours),
        teacherId: user?.id
      };
      
      if (id) {
        await apiClient.put(`/courses/${id}`, dataToSend);
        toast.success('Курс обновлён');
      } else {
        await apiClient.post('/courses', dataToSend);
        toast.success('Курс успешно создан!');
      }
      navigate('/my-courses');
    } catch (error: any) {
      console.error('Ошибка:', error);
      toast.success(error.response?.data?.message || 'Ошибка при сохранении курса');
    } finally {
      setLoading(false);
    }
  };

  const levelOptions = [
    { value: 'Beginner', label: 'Начинающий (Beginner)' },
    { value: 'Intermediate', label: 'Средний (Intermediate)' },
    { value: 'Advanced', label: 'Продвинутый (Advanced)' }
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 100%)',
      minHeight: '100vh',
      padding: '80px 24px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '30px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#0A2F5A' }}>
          {id ? 'Редактировать курс' : 'Новый курс'}
        </h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>
          {id ? 'Измените данные курса' : 'Заполните информацию о новом курсе'}
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Название курса */}
          <div style={{ marginBottom: '20px' }} id="field-title">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Название курса <span style={{ color: '#e74c3c' }}>*</span>
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
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2f70d2'}
              onBlur={(e) => {
                if (!errors.title) e.target.style.borderColor = '#ddd';
              }}
            />
            {errors.title && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>}
          </div>

          {/* Описание */}
          <div style={{ marginBottom: '20px' }} id="field-description">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Описание <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                border: `1px solid ${errors.description ? '#e74c3c' : '#ddd'}`,
                fontSize: '16px',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2f70d2'}
              onBlur={(e) => {
                if (!errors.description) e.target.style.borderColor = '#ddd';
              }}
            />
            {errors.description && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{errors.description}</p>}
            {!errors.description && formData.description && (
              <p style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>
                {formData.description.length}/10+ символов
              </p>
            )}
          </div>

          {/* Уровень */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Уровень сложности
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '16px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' }}
            >
              {levelOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Цена и Длительность */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div id="field-price">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Цена (₽)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.price}
                onChange={(e) => handleNumberChange('price', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  border: `1px solid ${errors.price ? '#e74c3c' : '#ddd'}`,
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2f70d2'}
                onBlur={(e) => {
                  if (!errors.price) e.target.style.borderColor = '#ddd';
                }}
              />
              {errors.price && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{errors.price}</p>}
            </div>
            <div id="field-durationHours">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Длительность (часов) <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.durationHours}
                onChange={(e) => handleNumberChange('durationHours', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  border: `1px solid ${errors.durationHours ? '#e74c3c' : '#ddd'}`,
                  fontSize: '16px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2f70d2'}
                onBlur={(e) => {
                  if (!errors.durationHours) e.target.style.borderColor = '#ddd';
                }}
              />
              {errors.durationHours && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{errors.durationHours}</p>}
            </div>
          </div>

          {/* Кнопки */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: '#2f70d2',
                color: 'white',
                padding: '14px',
                borderRadius: '40px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Сохранение...' : (id ? 'Сохранить изменения' : 'Создать курс')}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/my-courses')}
              style={{
                padding: '14px 24px',
                backgroundColor: '#f0f0f0',
                color: '#666',
                border: 'none',
                borderRadius: '40px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};