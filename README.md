# School Swedish - Платформа онлайн-обучения шведскому языку

Полнофункциональная платформа для онлайн-обучения шведскому языку с аутентификацией, личными кабинетами студентов и преподавателей, каталогом курсов и системой управления.

## 📋 Содержание

- [Быстрый старт](#-быстрый-старт)
- [Требования](#-требования)
- [Установка](#-установка)
- [Запуск приложения](#-запуск-приложения)
- [Технологический стек](#-технологический-стек)
- [Структура проекта](#-структура-проекта)
- [Конфигурация](#-конфигурация)
- [Работа с API](#-работа-с-api)
- [Разработка](#-разработка)
- [Troubleshooting](#-troubleshooting)

## 🚀 Быстрый старт

```bash
# 1. Клонируем репозиторий (если необходимо)
cd CourseProject

# 2. Запускаем Docker Compose для MySQL
docker compose up -d

# 3. В отдельном терминале - запускаем бэкенд
cd backend
dotnet run

# 4. В третьем терминале - запускаем фронтенд
cd frontend
npm install
npm run dev

# 5. Открываем браузер
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api
# Swagger: http://localhost:5000/swagger
```

## ⚙️ Требования

### Обязательные
- **Node.js** 18+ (для фронтенда)
- **.NET SDK** 8.0+ (для бэкенда)
- **Docker & Docker Compose** (для MySQL)

### Опциональные
- Git для работы с версионированием
- Postman/Insomnia для тестирования API

## 📦 Установка

### 1. Клонирование репозитория
```bash
git clone <repo-url>
cd CourseProject
```

### 2. Настройка фронтенда
```bash
cd frontend
npm install
```

### 3. Настройка бэкенда
```bash
cd backend
# Зависимости автоматически восстанавливаются при первом запуске
```

## 🔌 Запуск приложения

### Способ 1: Все компоненты вручную

#### Шаг 1: Запуск MySQL
```bash
# В корневой папке проекта
docker compose up -d

# Проверяем статус
docker ps
```

MySQL доступна на `localhost:3306`
- **User**: root
- **Password**: root
- **Database**: school_swedish

#### Шаг 2: Запуск бэкенда
```bash
cd backend
dotnet run
```

Бэкенд запустится на `http://localhost:5000`

#### Шаг 3: Запуск фронтенда
```bash
cd frontend
npm run dev
```

Фронтенд запустится на `http://localhost:5173`

### Способ 2: Быстрый рестарт бэкенда
Если порт 5000 занят:
```bash
# Windows - очистить порт
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

## 🏗️ Технологический стек

### Frontend
| Компонент | Версия | Назначение |
|-----------|--------|-----------|
| React | 19 | UI фреймворк |
| TypeScript | 5.9 | Типизация |
| Vite | 7.2 | Сборка и dev сервер |
| React Router | 7 | Маршрутизация |
| Tailwind CSS | 4 | Стили |
| Axios | 1.7 | HTTP клиент |
| TanStack Query | 5 | Server state management |
| Zustand | 4.5 | Client state management |
| React Hook Form | 7.5 | Работа с формами |
| Zod | 3.23 | Валидация |
| Lucide React | 0.414 | Иконки |

### Backend
| Компонент | Версия | Назначение |
|-----------|--------|-----------|
| .NET | 8.0 | Платформа |
| ASP.NET Core | 8.0 | Веб-фреймворк |
| Entity Framework Core | 9.0 | ORM |
| MySQL Connector | 9.0 | БД драйвер |
| JWT Bearer | 8.0 | Аутентификация |
| BCrypt | 4.0.3 | Хеширование паролей |
| FluentValidation | 11.3 | Валидация |
| Serilog | 8.0 | Логирование |
| Swagger | 6.6 | API документация |

### Infrastructure
| Компонент | Версия |
|-----------|--------|
| MySQL | 8.0 |
| Docker | Latest |

## 📁 Структура проекта

```
CourseProject/
├── frontend/                      # React приложение
│   ├── src/
│   │   ├── app/                  # Инициализация приложения
│   │   │   └── router/           # Маршруты
│   │   ├── pages/                # Страницы (роуты)
│   │   │   ├── auth/             # Аутентификация
│   │   │   ├── landing/          # Главная страница
│   │   │   └── dashboard/        # Дашборд
│   │   ├── features/             # Бизнес-функции
│   │   │   └── auth/             # Функции аутентификации
│   │   ├── entities/             # Доменные сущности
│   │   ├── shared/               # Переиспользуемый код
│   │   │   ├── api/              # HTTP клиент и API вызовы
│   │   │   ├── ui/               # UI компоненты
│   │   │   ├── types/            # TypeScript типы
│   │   │   └── lib/              # Утилиты
│   │   ├── widgets/              # Составные блоки
│   │   ├── App.tsx               # Главный компонент
│   │   └── main.tsx              # Входная точка
│   ├── .env                       # Переменные окружения
│   ├── vite.config.ts            # Конфигурация Vite
│   └── package.json              # Зависимости
│
├── backend/                       # ASP.NET Core приложение
│   ├── Controllers/              # API контроллеры
│   │   └── AuthController.cs     # Аутентификация
│   ├── Models/                   # Domain модели
│   ├── DTOs/                     # Передача данных
│   ├── Services/                 # Бизнес-логика
│   ├── Data/                     # Database context
│   ├── Validators/               # Валидаторы
│   ├── Program.cs                # Конфигурация приложения
│   ├── appsettings.json          # Настройки
│   └── SchoolSwedishAPI.csproj  # Проект
│
├── docker-compose.yml            # Docker композа для MySQL
├── README.md                      # Этот файл
└── .gitignore                     # Git ignore правила
```

## ⚙️ Конфигурация

### Frontend - .env
```env
# URL API бэкенда (с префиксом /api)
VITE_API_URL=http://localhost:5000/api

# JWT секретный ключ (для клиента)
VITE_JWT_SECRET_KEY=super-secret-key-minimum-64-characters-long-for-jwt-security-1234567890
```

### Backend - appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=school_swedish;User=root;Password=root;"
  },
  "JWT": {
    "Secret": "super-secret-key-minimum-64-characters-long-for-jwt-security-1234567890",
    "Issuer": "school-swedish-api",
    "Audience": "school-swedish-client"
  }
}
```

## 🔐 Работа с API

### Аутентификация

#### Регистрация
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "Иван",
  "lastName": "Петров",
  "role": "Student"
}
```

**Ответ (201):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Петров",
  "role": "Student",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "tokenExpiry": "2025-11-16T10:00:00Z"
}
```

#### Вход
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Ответ (200):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Петров",
  "role": "Student",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "tokenExpiry": "2025-11-16T10:00:00Z"
}
```

### Тестовые данные

После запуска бэкенда с пустой БД, создаются тестовые аккаунты:

| Email | Пароль | Роль |
|-------|--------|------|
| admin@school.com | temp123 | Admin |
| teacher@school.com | temp123 | Teacher |
| student1@school.com | temp123 | Student |
| student2@school.com | temp123 | Student |

### Swagger документация
При запуске бэкенда в режиме Development:
```
http://localhost:5000/swagger
```

## 👨‍💻 Разработка

### Frontend скрипты
```bash
cd frontend

# Dev сервер с HMR (Hot Module Replacement)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# ESLint проверка
npm run lint

# Type checking (TypeScript)
npx tsc --noEmit
```

### Backend скрипты
```bash
cd backend

# Run с hot reload
dotnet watch run

# Build
dotnet build

# Publish
dotnet publish -c Release
```

### Структура API запросов

```typescript
// frontend/src/shared/api/authApi.ts
import client from './client';

export const authApi = {
  register: async (data: RegisterDto) => {
    const response = await client.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto) => {
    const response = await client.post('/auth/login', data);
    return response.data;
  }
};
```

**Важно**: Путь `/auth/register` автоматически переходит в `http://localhost:5000/api/auth/register` благодаря baseURL в axios клиенте.

### Использование State Management

#### Zustand (Client State)
```typescript
import { useAuthStore } from '@/features/auth/store';

const { user, setUser, clearAuth } = useAuthStore();
```

#### TanStack Query (Server State)
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLogin } from '@/features/auth/hooks';

const { mutate: login, isPending } = useLogin();
```

### Git workflow

```bash
# Создание новой ветки для функции
git checkout -b feature/new-feature

# Работа и коммиты
git add .
git commit -m "Добавить новую функцию"

# Отправка на сервер
git push origin feature/new-feature

# Merge в main
# (через pull request на GitHub)
```

## 🐛 Troubleshooting

### 1. Порт 5000 занят
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Или просто используйте другой порт в appsettings.json
```

### 2. MySQL не запускается
```bash
# Проверяем Docker
docker ps -a

# Перезапускаем контейнер
docker compose down
docker compose up -d

# Проверяем логи
docker logs school-swedish-mysql
```

### 3. Ошибка "Unable to connect to MySQL"
```bash
# Убедитесь что:
# 1. Docker запущен
# 2. MySQL контейнер запущен (docker ps)
# 3. Connection string правильный в appsettings.json
# 4. Бэкенд доступен по http://localhost:5000/swagger
```

### 4. CORS ошибки
CORS политика настроена для:
- `http://localhost:5173` (фронтенд dev)
- `http://localhost:3000` (альтернативный фронтенд)

Изменить в `backend/Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

### 5. TypeScript ошибки
```bash
cd frontend
npx tsc --noEmit    # Проверить все ошибки
npm run lint        # ESLint проверка
```

### 6. Очистить все и пересобрать
```bash
# Frontend
cd frontend
rm -rf node_modules dist
npm install
npm run build

# Backend
cd backend
dotnet clean
dotnet build
dotnet run
```

### 7. Проблема с JWT токеном
Если токен отклоняется:
- Проверьте, что `JWT:Secret` в бэкенде и фронтенде совпадают
- Проверьте срок действия токена (в тестовых данных 24 часа)
- Посмотрите логи бэкенда для деталей аутентификации

## 📊 Статистика проекта

| Метрика | Значение |
|---------|----------|
| Frontend Bundle (gzipped) | ~146 kB |
| Build time (Frontend) | ~14 сек |
| Компоненты UI | 15+ |
| API endpoints | 10+ |
| TypeScript strict mode | Да ✅ |
| ESLint enabled | Да ✅ |
| Database migrations | Auto create |

## 📚 Дополнительные ресурсы

- **Frontend README**: [frontend/README.md](./frontend/README.md)
- **API Documentation**: http://localhost:5000/swagger (при запуске)
- **React 19 Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org
- **Vite Docs**: https://vite.dev
- **ASP.NET Core Docs**: https://learn.microsoft.com/dotnet/

## 🤝 Разработчики

- [School Swedish Team](https://github.com)

## 📝 Лицензия

MIT License - см. LICENSE файл для деталей

## 🎯 Текущий статус

- ✅ **Фаза 0-1**: Аутентификация и базовая структура
- 🔄 **Фаза 2**: Каталог курсов и личные кабинеты (в разработке)
- 📋 **Фаза 3+**: Админ-панель, аналитика, платежи

---

**Последнее обновление**: 15 ноября 2025
**Версия**: 0.1.0
