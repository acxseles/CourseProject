import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { importExportApi } from '@/shared/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@/shared/ui';
import { Download, Upload, FileUp, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export const ImportExportPage = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importedCount, setImportedCount] = useState(0);

  const handleExportAllPdf = async () => {
    try {
      setExportLoading(true);
      const blob = await importExportApi.exportAllCoursesPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `courses_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setMessage({ type: 'success', text: 'Все курсы успешно экспортированы в PDF' });
    } catch {
      setMessage({ type: 'error', text: 'Ошибка при экспорте курсов' });
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportLoading(true);
      const courses = await importExportApi.importCoursesFromExcel(file);
      setImportedCount(courses.length);
      setMessage({ type: 'success', text: `${courses.length} курсов успешно импортировано` });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    } catch {
      setMessage({ type: 'error', text: 'Ошибка при импорте курсов' });
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 sm:p-12">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Импорт/Экспорт</h1>
        <p className="text-base sm:text-lg text-gray-700">
          Управляйте курсами с помощью массового импорта и экспорта в PDF
        </p>
      </div>

      {/* Message */}
      {message && (
        <Card className={`mb-6 border ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="flex items-start gap-4 py-4">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`font-semibold ${message.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
              {message.text}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Section */}
        <Card className="hover:shadow-lg transition-shadow bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" /> Экспорт курсов
            </CardTitle>
            <CardDescription>Скачайте все курсы в формате PDF</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">
              Создает PDF документ с названиями, описаниями, уровнями и преподавателями всех курсов.
            </p>
            <Button
              onClick={handleExportAllPdf}
              disabled={exportLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-blue-600 flex items-center justify-center gap-2"
            >
              {exportLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exportLoading ? 'Экспортирование...' : 'Скачать PDF'}
            </Button>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card className="hover:shadow-lg transition-shadow bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" /> Импорт курсов
            </CardTitle>
            <CardDescription>Загрузите курсы из Excel или CSV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleImportExcel}
                disabled={importLoading}
                accept=".xlsx,.xls,.csv"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <FileUp className="w-8 h-8 text-blue-600" />
                <p className="font-semibold text-gray-900">Перетащите файл сюда или нажмите</p>
                <p className="text-sm text-gray-500">Excel или CSV файл</p>
              </div>
            </div>

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={importLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-blue-600 flex items-center justify-center gap-2"
            >
              {importLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {importLoading ? 'Импортирование...' : 'Выбрать файл'}
            </Button>

            {importedCount > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                ✓ Импортировано {importedCount} курсов
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-8 bg-white hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold mb-1">Формат файла для импорта</h4>
            <p className="text-sm mb-2">Excel файл должен содержать столбцы (в первой строке):</p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs">
              <p>title | description | level | price | durationHours</p>
              <p className="mt-2 text-gray-500">Пример:</p>
              <p>Swedish Basics | Basics of Swedish language | Beginner | 49.99 | 20</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Уровни сложности</h4>
            <p className="text-sm">
              Используйте: <code className="bg-gray-100 px-2 py-1 rounded">Beginner</code>, <code className="bg-gray-100 px-2 py-1 rounded">Intermediate</code>, <code className="bg-gray-100 px-2 py-1 rounded">Advanced</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
