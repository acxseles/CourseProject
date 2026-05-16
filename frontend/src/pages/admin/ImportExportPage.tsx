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
    // Правильный URL из Swagger
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
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '8px' }}>
            Импорт / Экспорт
          </h1>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Управляйте курсами с помощью массового импорта и экспорта
          </p>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee',
            border: `1px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`,
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>{message.type === 'success' ? '✅' : '❌'}</span>
            <span style={{ color: message.type === 'success' ? '#2e7d32' : '#c62828' }}>
              {message.text}
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Export Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📥 Экспорт курсов
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Скачайте все курсы в формате PDF
            </p>
            <button
              onClick={handleExportAllPdf}
              disabled={exportLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: exportLoading ? '#ccc' : '#2f70d2',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: exportLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {exportLoading ? '⏳ Экспортирование...' : '📄 Скачать PDF'}
            </button>
          </div>

          {/* Import Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📤 Импорт курсов
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Загрузите курсы из Excel файла
            </p>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #2f70d2',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '16px',
                backgroundColor: '#f8fafc'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>📁</div>
              <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Нажмите для выбора файла</p>
              <p style={{ fontSize: '12px', color: '#666' }}>Excel (.xlsx, .xls) или CSV</p>
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
                padding: '12px',
                backgroundColor: importLoading ? '#ccc' : '#2f70d2',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: importLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
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
                textAlign: 'center'
              }}>
                ✅ Импортировано {importedCount} курсов
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '24px',
          marginTop: '32px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>ℹ️ Информация</h3>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Формат файла для импорта</h4>
            <p style={{ color: '#666', marginBottom: '8px' }}>Excel файл должен содержать столбцы (в первой строке):</p>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              title | description | level | price | durationHours
            </pre>
          </div>
          <div>
            <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Уровни сложности</h4>
            <p style={{ color: '#666' }}>
              Используйте: <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>Beginner</code>,{' '}
              <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>Intermediate</code>,{' '}
              <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>Advanced</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};