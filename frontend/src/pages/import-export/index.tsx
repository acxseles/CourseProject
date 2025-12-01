import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { importExportApi } from '@/shared/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/shared/ui';
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
    } catch (error) {
      console.error('Export failed:', error);
      setMessage({ type: 'error', text: 'Ошибка при экспорте курсов' });
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file?.name);
    if (!file) {
      console.log('No file selected');
      return;
    }

    try {
      console.log('Starting import for file:', file.name);
      setImportLoading(true);
      const courses = await importExportApi.importCoursesFromExcel(file);
      console.log('Import successful, courses:', courses);
      setImportedCount(courses.length);
      setMessage({
        type: 'success',
        text: `${courses.length} курсов успешно импортировано`,
      });
      // Invalidate courses cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    } catch (error) {
      console.error('Import failed:', error);
      setMessage({ type: 'error', text: 'Ошибка при импорте курсов' });
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Импорт/Экспорт</h1>
        <p className="text-base sm:text-lg text-foreground/70">
          Управляйте курсами с помощью массового импорта и экспорта в PDF
        </p>
      </div>

      {/* Message */}
      {message && (
        <Card className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${message.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                  {message.text}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" />
              Экспорт курсов
            </CardTitle>
            <CardDescription>
              Скачайте все курсы в формате PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/70">
              Создает PDF документ, содержащий информацию о всех доступных курсах. Включает названия, описания, уровни и преподавателей.
            </p>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-2">
              <p className="text-sm font-semibold text-green-900">✓ Включает:</p>
              <ul className="text-sm text-green-800 space-y-1 ml-4">
                <li>• Названия и описания курсов</li>
                <li>• Уровни сложности</li>
                <li>• Информацию о преподавателях</li>
                <li>• Стоимость и продолжительность</li>
              </ul>
            </div>

            <Button
              onClick={handleExportAllPdf}
              disabled={exportLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {exportLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Экспортирование...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Скачать все курсы (PDF)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Импорт курсов
            </CardTitle>
            <CardDescription>
              Загрузите курсы из Excel файла
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/70">
              Импортируйте курсы из файла Excel. Файл должен содержать столбцы: название, описание, уровень, цена, часы.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
              <p className="text-sm font-semibold text-blue-900">✓ Поддерживаемые форматы:</p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• Excel файлы (.xlsx, .xls)</li>
                <li>• CSV файлы</li>
              </ul>
            </div>

            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer relative">
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
                <p className="font-semibold text-foreground">
                  Перетащите файл сюда или нажмите
                </p>
                <p className="text-sm text-foreground/60">Excel или CSV файл</p>
              </div>
            </div>

            <Button
              onClick={() => {
                console.log('Button clicked, triggering file input');
                fileInputRef.current?.click();
              }}
              disabled={importLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {importLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Импортирование...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Выбрать файл
                </>
              )}
            </Button>

            {importedCount > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Импортировано {importedCount} курсов
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Формат файла для импорта</h4>
            <p className="text-sm text-foreground/70 mb-3">
              Excel файл должен содержать следующие столбцы (в первой строке):
            </p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs space-y-1">
              <p>title | description | level | price | durationHours</p>
              <p className="text-foreground/60 mt-3">Пример:</p>
              <p>Swedish Basics | Basics of Swedish language | Beginner | 49.99 | 20</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Уровни сложности</h4>
            <p className="text-sm text-foreground/70">
              При импорте используйте одно из следующих значений: <code className="bg-gray-100 px-2 py-1 rounded">Beginner</code>, <code className="bg-gray-100 px-2 py-1 rounded">Intermediate</code>, <code className="bg-gray-100 px-2 py-1 rounded">Advanced</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
