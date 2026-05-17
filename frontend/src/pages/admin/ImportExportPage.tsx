import { useState, useRef } from 'react';
import { apiClient } from '../../shared/api/client';

export const ImportExportPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importedCount, setImportedCount] = useState(0);

  const handleExportAllPdf = async () => {
    try {
      setExportLoading(true);
      const response = await apiClient.get('/import-export/export/courses/pdf', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `courses_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage({ type: 'success', text: 'Все курсы успешно экспортированы в PDF' });
    } catch (err) {
      console.error('Ошибка:', err);
      setMessage({ type: 'error', text: 'Ошибка при экспорте курсов' });
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setImportLoading(true);
      const response = await apiClient.post('/import-export/import/courses/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setImportedCount(response.data.count || response.data.length || 0);
      setMessage({ type: 'success', text: `${response.data.count || response.data.length || 0} курсов успешно импортировано` });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Ошибка:', err);
      setMessage({ type: 'error', text: 'Ошибка при импорте курсов' });
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Заголовок */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            color: '#0A2F5A', 
            marginBottom: '12px',
            fontFamily: "'Soyuz Grotesk', 'Montserrat', sans-serif"
          }}>
            Импорт / Экспорт
          </h1>
          <p style={{ fontSize: '16px', color: '#555' }}>
            Управляйте курсами с помощью массового импорта и экспорта
          </p>
        </div>

        {/* Сообщение */}
        {message && (
          <div style={{
            backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee',
            border: `1px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`,
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>{message.type === 'success' ? '✅' : '❌'}</span>
            <span style={{ color: message.type === 'success' ? '#2e7d32' : '#c62828', fontWeight: '500' }}>
              {message.text}
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' }}>
          {/* Экспорт */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#e8f0fe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '40px' }}>📥</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '8px' }}>
                Экспорт курсов
              </h2>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Скачайте все курсы в формате PDF
              </p>
            </div>
            
            <button
              onClick={handleExportAllPdf}
              disabled={exportLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: exportLoading ? '#ccc' : 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: exportLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!exportLoading) e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {exportLoading ? '⏳ Экспортирование...' : '📄 Скачать PDF'}
            </button>
          </div>

          {/* Импорт */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#e8f0fe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '40px' }}>📤</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '8px' }}>
                Импорт курсов
              </h2>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Загрузите курсы из Excel файла
              </p>
            </div>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #2f70d2',
                borderRadius: '20px',
                padding: '30px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '20px',
                backgroundColor: '#f8fafc',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8f0fe'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>📁</div>
              <p style={{ fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>Нажмите для выбора файла</p>
              <p style={{ fontSize: '12px', color: '#888' }}>Excel (.xlsx, .xls) или CSV</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleImportExcel}
              disabled={importLoading}
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: importLoading ? '#ccc' : 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: importLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!importLoading) e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {importLoading ? '⏳ Импортирование...' : '📂 Выбрать файл'}
            </button>

            {importedCount > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#e8f5e9',
                borderRadius: '12px',
                color: '#2e7d32',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                ✅ Импортировано {importedCount} курсов
              </div>
            )}
          </div>
        </div>

        {/* Информация */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '32px',
          marginTop: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#0A2F5A' }}>
            ℹ️ Информация
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Формат файла для импорта</h4>
            <p style={{ color: '#666', marginBottom: '8px' }}>Excel файл должен содержать столбцы (в первой строке):</p>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'monospace',
              overflow: 'auto'
            }}>
              <div>title | description | level | price | durationHours | maxStudents | teacherEmail</div>
              <div style={{ color: '#888', marginTop: '8px' }}>Пример:</div>
              <div>Swedish Basics | Basics of Swedish language | Beginner | 49.99 | 20 | 30 | teacher@school.com</div>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Уровни сложности</h4>
            <p style={{ color: '#666' }}>
              Используйте: <code style={{ backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>Beginner</code>,{' '}
              <code style={{ backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>Intermediate</code>,{' '}
              <code style={{ backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>Advanced</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};