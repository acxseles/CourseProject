import { useState } from 'react';
import { useGetAllUsers } from '@/features/users';
import { useDeleteStudent } from '@/features/users';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/shared/ui';
import { Users as UsersIcon, Loader, AlertCircle, Trash2, Shield, Search } from 'lucide-react';

export const AdminPanelPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const pageSize = 20;

  const { data, isLoading, error } = useGetAllUsers({ page, pageSize });
  const deleteStudentMutation = useDeleteStudent();

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  // Filter users based on search and role
  const filteredUsers = data?.items.filter((user) => {
    const matchesSearch =
      !search ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleDeleteStudent = (studentId: number, name: string) => {
    if (confirm(`Вы уверены, что хотите удалить студента ${name}?`)) {
      deleteStudentMutation.mutate(studentId);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-600" />
          Панель администратора
        </h1>
        <p className="text-base sm:text-lg text-foreground/70">
          Управляйте пользователями и отслеживайте статистику системы
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UsersIcon className="w-10 h-10 text-primary-600 mx-auto mb-2" />
              <p className="text-sm text-foreground/60 mb-1">Всего пользователей</p>
              <p className="text-3xl font-bold">{data?.totalCount || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UsersIcon className="w-10 h-10 text-secondary-600 mx-auto mb-2" />
              <p className="text-sm text-foreground/60 mb-1">Студентов</p>
              <p className="text-3xl font-bold">
                {data?.items.filter((u) => u.role === 'Student').length || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UsersIcon className="w-10 h-10 text-accent-600 mx-auto mb-2" />
              <p className="text-sm text-foreground/60 mb-1">Преподавателей</p>
              <p className="text-3xl font-bold">
                {data?.items.filter((u) => u.role === 'Teacher').length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Фильтры и поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Поиск по email или имени</label>
              <Input
                placeholder="Введите email или имя..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Роль</label>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Все роли</option>
                <option value="Student">Студент</option>
                <option value="Teacher">Преподаватель</option>
                <option value="Admin">Администратор</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearch('');
                  setRoleFilter('');
                  setPage(1);
                }}
                variant="outline"
                className="w-full"
              >
                Очистить фильтры
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Ошибка загрузки</h3>
                <p className="text-sm text-red-800">Не удалось загрузить пользователей. Попробуйте позже.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      {!isLoading && filteredUsers && filteredUsers.length > 0 && (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-primary-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Имя</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Роль</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Дата регистрации</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-primary-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'Student'
                              ? 'bg-blue-100 text-blue-700'
                              : user.role === 'Teacher'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {user.role === 'Student' && 'Студент'}
                          {user.role === 'Teacher' && 'Преподаватель'}
                          {user.role === 'Admin' && 'Администратор'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role === 'Student' && (
                          <Button
                            onClick={() =>
                              handleDeleteStudent(user.id, `${user.firstName} ${user.lastName}`)
                            }
                            disabled={deleteStudentMutation.isPending}
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Предыдущая
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  variant={p === page ? 'default' : 'outline'}
                  className="w-10 h-10 p-0"
                >
                  {p}
                </Button>
              ))}
              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                Следующая
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && filteredUsers && filteredUsers.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Search className="w-16 h-16 text-primary-300 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Пользователи не найдены</h3>
              <p className="text-foreground/60">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
