import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';
import toast from 'react-hot-toast';

interface Student {
  id: number;
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  progress: number;
  enrolledAt: string;
  status: string;
}

export const CourseStudentsPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Получаем название курса
        const courseRes = await apiClient.get(`/courses/${courseId}`);
        setCourseTitle(courseRes.data.title);
        
        // Получаем студентов курса
        const studentsRes = await apiClient.get(`/enrollments/course/${courseId}/students`);
        console.log('=== ДАННЫЕ С БЭКЕНДА ===');
        console.log(studentsRes.data);
        setStudents(studentsRes.data);
      } catch (err) {
        console.error('Ошибка:', err);
        toast.error('Не удалось загрузить студентов');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleRemoveStudent = async (enrollmentId: number, studentName: string) => {
    console.log('Удаляем enrollmentId:', enrollmentId);
    if (!window.confirm(`Удалить студента "${studentName}" с этого курса?`)) return;
    
    try {
      await apiClient.delete(`/enrollments/enrollment/${enrollmentId}`);
      setStudents(students.filter(s => s.id !== enrollmentId));
      toast.success(`Студент ${studentName} удалён с курса`);
    } catch (err) {
      console.error('Ошибка:', err);
      toast.error('Не удалось удалить студента');
    }
  };

  console.log('Студенты в состоянии:', students);

  if (loading) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px', textAlign: 'center' }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link to={`/course/${courseId}/lessons`} style={{ color: '#2f70d2', textDecoration: 'none' }}>
            ← Назад к курсу
          </Link>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '8px' }}>
            Студенты курса
          </h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            {courseTitle} — {students.length} студентов
          </p>

          {students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#666' }}>На этот курс пока не записан ни один студент</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Студент</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Прогресс</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Дата записи</th>
                    {user?.role === 'Admin' && (
                      <th style={{ padding: '12px', textAlign: 'center' }}>Действия</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>
                        {student.firstName} {student.lastName}
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>{student.email}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <div style={{ 
                            width: '100px', 
                            height: '8px', 
                            backgroundColor: '#e0e0e0', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${student.progress || 0}%`, 
                              height: '100%', 
                              backgroundColor: '#2f70d2',
                              borderRadius: '4px'
                            }} />
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2f70d2' }}>
                            {student.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                        {new Date(student.enrolledAt).toLocaleDateString('ru-RU')}
                      </td>
                      {user?.role === 'Admin' && (
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleRemoveStudent(student.id, `${student.firstName} ${student.lastName}`)}
                            style={{
                              padding: '6px 14px',
                              backgroundColor: '#fee',
                              color: '#e74c3c',
                              border: 'none',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            🗑️ Удалить
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};