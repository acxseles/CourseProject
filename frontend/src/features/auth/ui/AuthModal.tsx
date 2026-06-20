import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, register, isLoading } = useAuth();

  // Проверка пароля
  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) {
      return 'Пароль должен быть минимум 6 символов';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Пароль должен содержать хотя бы одну заглавную букву';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Пароль должен содержать хотя бы одну строчную букву';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin) {
      setPasswordError(validatePassword(newPassword));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка пароля при регистрации
    if (!isLogin) {
      const error = validatePassword(password);
      if (error) {
        toast.error(error);
        return;
      }
    }
    
    try {
      if (isLogin) {
        await login({ email, password });
        toast.success('Добро пожаловать!');
      } else {
        await register({ email, password, firstName, lastName });
        toast.success('Регистрация успешна!');
      }
      onClose();
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setPasswordError('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-end">
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <Dialog.Title className="text-2xl font-bold text-center text-gray-900 mb-6">
                  {isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <input
                        type="text"
                        placeholder="Имя"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Фамилия"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </>
                  )}

                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <div>
                    <input
                      type="password"
                      placeholder="Пароль"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                        passwordError && !isLogin ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    {passwordError && !isLogin && (
                      <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                    )}
                    {!isLogin && (
                      <p className="text-gray-500 text-xs mt-1">
                        Пароль должен содержать минимум 6 символов, заглавную букву, строчную букву и цифру
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || (!isLogin && !!passwordError)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setPasswordError('');
                      setPassword('');
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};