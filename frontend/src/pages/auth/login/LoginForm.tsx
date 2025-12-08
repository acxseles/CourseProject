import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/features/auth';
import { Button, Input, Alert } from '@/shared/ui';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(3, 'Пароль должен быть минимум 3 символа'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { mutate: login, isPending, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-foreground mb-4">Вход в систему</h2>
      <p className="text-foreground/70 mb-8 text-lg">Введите ваши учетные данные для доступа</p>

      {error && (
        <Alert type="error" className="mb-6">
          {(error as any).response?.data?.message || 'Ошибка при входе'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email адрес"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Пароль"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Кнопка */}
      <Button
  type="submit"
  variant="primary"
  className="w-full py-4 text-blue-600 rounded-xl flex justify-center items-center gap-2"
  loading={isPending}
>
  <LogIn className="w-6 h-6" />
  Войти
</Button>

      </form>

      <div className="mt-8 pt-8 border-t border-border text-center">
        <p className="text-foreground/70 mb-3 text-lg">
          Нет аккаунта?{' '}
          <Link
            to="/auth/register"
            className="text-primary-600 font-semibold hover:opacity-80"
          >
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
};
