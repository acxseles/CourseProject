import { useAuth } from '@/features/auth';
import { useGetUserProfile } from '@/features/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from '@/shared/ui';
import { User, Shield, LogOut, Loader, AlertCircle, Lock } from 'lucide-react';
import { useState } from 'react';

export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { isLoading, error } = useGetUserProfile();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
      logout();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update functionality
    alert('Функция обновления профиля будет реализована в ближайшее время');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Настройки профиля</h1>
        <p className="text-base sm:text-lg text-foreground/70">
          Управляйте информацией вашего аккаунта и предпочтениями
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                Информация профиля
              </CardTitle>
              <CardDescription>Обновите вашу личную информацию</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Ошибка загрузки</h4>
                    <p className="text-sm text-red-800">Не удалось загрузить данные профиля</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя</label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Фамилия</label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Ваша фамилия"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ваш email"
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    ℹ️ Функция обновления профиля будет доступна в ближайшее время
                  </p>
                </div>

                <Button disabled className="w-full bg-primary-600 hover:bg-primary-700">
                  Сохранить изменения
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary-600" />
                Безопасность
              </CardTitle>
              <CardDescription>Измените пароль вашего аккаунта</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Текущий пароль</label>
                  <Input type="password" placeholder="Введите текущий пароль" disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Новый пароль</label>
                  <Input type="password" placeholder="Введите новый пароль" disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Подтвердите новый пароль</label>
                  <Input type="password" placeholder="Подтвердите новый пароль" disabled />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    ℹ️ Функция изменения пароля будет доступна в ближайшее время
                  </p>
                </div>

                <Button disabled className="w-full">
                  Изменить пароль
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Status */}
          <Card className="bg-primary-50 border-primary-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                Статус аккаунта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Статус</p>
                <p className="font-semibold text-green-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Активен
                </p>
              </div>

              <div>
                <p className="text-sm text-foreground/60 mb-1">Роль</p>
                <p className="font-semibold">
                  {user?.role === 'Student' && 'Студент'}
                  {user?.role === 'Teacher' && 'Преподаватель'}
                  {user?.role === 'Admin' && 'Администратор'}
                </p>
              </div>

              <div>
                <p className="text-sm text-foreground/60 mb-1">Дата регистрации</p>
                <p className="font-semibold">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '-'}
                </p>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Просмотреть детали
              </Button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выйти из аккаунта
          </Button>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Email аккаунта</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono bg-primary-50 p-3 rounded break-all">
                {user?.email}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
