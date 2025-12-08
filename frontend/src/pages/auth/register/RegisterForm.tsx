import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/features/auth';
import {  Input, Alert } from '@/shared/ui';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string()
    .min(6, 'Пароль должен быть минимум 6 символов')
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  firstName: z.string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .regex(/^[a-zA-Zа-яА-Я]+$/, 'Имя может содержать только буквы'),
  lastName: z.string()
    .min(2, 'Фамилия должна быть минимум 2 символа')
    .regex(/^[a-zA-Zа-яА-Я]+$/, 'Фамилия может содержать только буквы'),
  role: z.enum(['Student', 'Teacher'] as const),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { mutate: register, error } = useRegister();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'Student' },
  });

  const selectedRole = watch('role');

  const onSubmit = (data: RegisterFormData) => register(data);

  const roles = [
    { value: 'Student', label: 'Студент', description: 'Обучаться на курсах' },
    { value: 'Teacher', label: 'Преподаватель', description: 'Преподавать курсы' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-10 rounded-2xl shadow-xl">
      {/* Заголовок */}
      <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">Регистрация</h2>
      <p className="text-gray-600 mb-8 text-center text-lg">
        Создайте аккаунт, чтобы начать обучение
      </p>

      {/* Ошибка */}
      {error && (
        <Alert type="error" className="mb-6">
          {(error as any).response?.data?.message || 'Ошибка при регистрации'}
        </Alert>
      )}

      {/* Форма */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Имя"
            placeholder="Иван"
            error={errors.firstName?.message}
            {...registerField('firstName')}
          />
          <Input
            label="Фамилия"
            placeholder="Иванов"
            error={errors.lastName?.message}
            {...registerField('lastName')}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...registerField('email')}
        />

        <Input
          label="Пароль"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...registerField('password')}
        />

        {/* Роль пользователя */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">Выберите вашу роль</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRole === role.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 text-gray-800'
                }`}
              >
                <input
                  type="radio"
                  value={role.value}
                  {...registerField('role')}
                  className="sr-only"
                />
                <p className="font-semibold">{role.label}</p>
                <p className="text-sm mt-1 text-gray-500">{role.description}</p>
              </label>
            ))}
          </div>
        </div>

       <button
  type="submit"
  className="w-full py-4 text-blue-600 bg-blue-600 hover:bg-blue-700 font-semibold text-lg rounded-xl text-center flex justify-center items-center gap-2"
>
  <UserPlus className="w-6 h-6" />
  Создать аккаунт
</button>



      </form>

      {/* Ссылка на вход */}
      <p className="mt-8 text-center text-gray-600">
        Уже есть аккаунт?{' '}
        <Link
          to="/auth/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Войти
        </Link>
      </p>
    </div>
  );
};
