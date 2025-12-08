import { Link, useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Неожиданная ошибка!</h1>
      <p className="text-gray-700 mb-2">
        {error?.status} {error?.statusText || error?.message || 'Произошла ошибка.'}
      </p>
      <Link
        to="/"
        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        На главную
      </Link>
    </div>
  );
};
