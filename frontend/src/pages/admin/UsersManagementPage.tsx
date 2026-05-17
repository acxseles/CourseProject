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
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

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
    if (!confirm('Удалить пользователя? Все его данные будут удалены.')) return;
    try {
      await apiClient.delete(`/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      alert('Пользователь удалён');
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Не удалось удалить пользователя');
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
      'Student': '#4caf50',
      'Teacher': '#ff9800',
      'Admin': '#f44336'
    };
    return colors[role] || '#666';
  };

  // Фильтрация пользователей
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', color: '#666' }}>Загрузка пользователей...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Заголовок */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: 'bold', 
            color: '#0A2F5A', 
            marginBottom: '12px',
            fontFamily: "'Soyuz Grotesk', 'Montserrat', sans-serif"
          }}>
            Управление пользователями
          </h1>
          <p style={{ fontSize: '16px', color: '#555' }}>
            Просмотр, редактирование и удаление пользователей
          </p>
        </div>

        {/* Фильтры и поиск */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['all', 'Student', 'Teacher', 'Admin'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '30px',
                  border: 'none',
                  backgroundColor: roleFilter === role ? '#2f70d2' : 'white',
                  color: roleFilter === role ? 'white' : '#2f70d2',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  boxShadow: roleFilter === role ? '0 4px 12px rgba(47,112,210,0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                {role === 'all' ? 'Все' : getRoleName(role)}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="🔍 Поиск по имени или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 20px',
              borderRadius: '30px',
              border: '1px solid #ddd',
              width: '280px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Таблица пользователей */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#e8f0fe', borderBottom: '1px solid #ddd' }}>
              <tr>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>ID</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Имя</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Email</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Роль</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Статус</th>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 'bold', color: '#0A2F5A' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr key={u.id} style={{ borderBottom: index === filteredUsers.length - 1 ? 'none' : '1px solid #eee' }}>
                  <td style={{ padding: '16px 20px', color: '#666' }}>{u.id}</td>
                  <td style={{ padding: '16px 20px', fontWeight: '500' }}>{u.firstName} {u.lastName}</td>
                  <td style={{ padding: '16px 20px', color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '16px 20px' }}>
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
                  <td style={{ padding: '16px 20px' }}>
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
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setShowEditModal(true);
                        }}
                        style={{
                          padding: '6px 14px',
                          backgroundColor: '#e8f0fe',
                          color: '#2f70d2',
                          border: 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        ✏️ Редактировать
                      </button>
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
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
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '32px',
              width: '500px',
              maxWidth: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#0A2F5A' }}>
                Редактировать пользователя
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Имя</label>
                <input
                  type="text"
                  value={editingUser.firstName}
                  onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px' }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Фамилия</label>
                <input
                  type="text"
                  value={editingUser.lastName}
                  onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px' }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px' }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Роль</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px' }}
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
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 'bold', color: '#333' }}>Активен</span>
                </label>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleUpdateUser(editingUser)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
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
                    color: '#666',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};