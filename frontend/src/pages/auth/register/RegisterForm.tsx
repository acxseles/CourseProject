import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/features/auth';
import { Button, Input, Alert } from '@/shared/ui';
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
  const { mutate: register, isPending, error } = useRegister();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Student',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = (data: RegisterFormData) => {
    register(data);
  };

  const roles = [
    { value: 'Student', label: 'Студент', description: 'Обучаться на курсах' },
    { value: 'Teacher', label: 'Преподаватель', description: 'Преподавать курсы' },
  ];

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 bg-clip-text text-transparent mb-2">Регистрация</h2>
      <p className="text-foreground/70 mb-8">Создайте аккаунт для начала обучения</p>

      {error && (
        <Alert type="error" className="mb-6">
          {(error as any).response?.data?.message || 'Ошибка при регистрации'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
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
          label="Email адрес"
          type="email"
          placeholder="your@email.com"
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

        <div>
          <label className="block text-sm font-semibold text-foreground mb-4">Выберите вашу роль</label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                  selectedRole === role.value
                    ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-accent-50'
                    : 'border-border hover:border-primary-300'
                }`}
                style={
                  selectedRole !== role.value
                    ? {
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--color-border)',
                      }
                    : {}
                }
              >
                <input
                  type="radio"
                  value={role.value}
                  {...registerField('role')}
                  className="sr-only"
                />
                <p className={`font-semibold ${selectedRole === role.value ? 'bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent' : 'text-foreground'}`}>
                  {role.label}
                </p>
                <p className={`text-sm mt-1 ${selectedRole === role.value ? 'text-primary-600' : 'text-foreground/60'}`}>
                  {role.description}
                </p>
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 text-lg gap-2"
          loading={isPending}
        >
          <UserPlus className="w-5 h-5" />
          <span>Создать аккаунт</span>
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t border-border text-center">
        <p className="text-foreground/70 mb-3">
          Уже есть аккаунт?{' '}
          <Link to="/auth/login" className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-semibold hover:opacity-80">
            Войдите
          </Link>
        </p>
      </div>
    </div>
  );
};
