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
    <div className="w-full">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 bg-clip-text text-transparent mb-2">Вход в систему</h2>
      <p className="text-foreground/70 mb-8">Введите ваши учетные данные для доступа</p>

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

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 text-lg gap-2"
          loading={isPending}
        >
          <LogIn className="w-5 h-5" />
          <span>Войти</span>
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t border-border text-center">
        <p className="text-foreground/70 mb-3">
          Нет аккаунта?{' '}
          <Link to="/auth/register" className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-semibold hover:opacity-80">
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
};
