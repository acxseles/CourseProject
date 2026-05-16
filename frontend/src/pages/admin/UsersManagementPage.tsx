import { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const UsersManagementPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users');
      setUsers(response.data?.items || response.data || []);
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
  if (!confirm('Удалить пользователя?')) return;
  try {
    console.log('Удаляю пользователя:', `/users/${userId}`);
    const response = await apiClient.delete(`/users/${userId}`);
    console.log('Ответ:', response.status);
    setUsers(users.filter(u => u.id !== userId));
    alert('Пользователь удалён');
  } catch (err: any) {
    console.error('Ошибка:', err);
    console.error('Статус:', err.response?.status);
    console.error('Данные:', err.response?.data);
    alert(`Ошибка: ${err.response?.data?.message || err.message}`);
  }
};

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await apiClient.put(`/users/${updatedUser.id}`, {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive
      });
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      alert('Пользователь обновлён');
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Не удалось обновить пользователя');
    }
  };

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      'Student': 'Студент',
      'Teacher': 'Преподаватель',
      'Admin': 'Администратор'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Student': '#2f70d2',
      'Teacher': '#27ace0',
      'Admin': '#e74c3c'
    };
    return colors[role] || '#666';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Загрузка пользователей...
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '8px' }}>
          Управление пользователями
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Просмотр, редактирование и удаление пользователей
        </p>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#e8f0fe' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>ID</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Имя</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Email</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Роль</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Статус</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} style={{ borderBottom: index === users.length - 1 ? 'none' : '1px solid #eee' }}>
                <td style={{ padding: '16px' }}>{u.id}</td>
                <td style={{ padding: '16px' }}>{u.firstName} {u.lastName}</td>
                <td style={{ padding: '16px' }}>{u.email}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    backgroundColor: `${getRoleColor(u.role)}20`,
                    color: getRoleColor(u.role),
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getRoleName(u.role)}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    backgroundColor: u.isActive ? '#4caf5020' : '#f4433620',
                    color: u.isActive ? '#4caf50' : '#f44336',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {u.isActive ? 'Активен' : 'Заблокирован'}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setShowEditModal(true);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e8f0fe',
                        color: '#2f70d2',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Редактировать
                    </button>
                    {u.id !== user?.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#fee',
                          color: 'red',
                          border: 'none',
                          borderRadius: '16px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Удалить
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно редактирования */}
      {showEditModal && editingUser && (
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
            padding: '32px',
            width: '500px',
            maxWidth: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Редактировать пользователя</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Имя</label>
              <input
                type="text"
                value={editingUser.firstName}
                onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Фамилия</label>
              <input
                type="text"
                value={editingUser.lastName}
                onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Роль</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
              >
                <option value="Student">Студент</option>
                <option value="Teacher">Преподаватель</option>
                <option value="Admin">Администратор</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editingUser.isActive}
                  onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontWeight: 'bold' }}>Активен</span>
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleUpdateUser(editingUser)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#2f70d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Сохранить
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};