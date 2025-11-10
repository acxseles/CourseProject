# School Swedish API Documentation

## Base URL https://localhost:7106/

## Swagger UI
Для тестирования API используй Swagger: https://localhost:7106/swagger/index.html

## Authentication
API использует JWT (JSON Web Token) аутентификацию.

### Тестовые пользователи:
- **Student:** student1@school.com / temp123
- **Admin:** admin@school.com / temp123

### Получение токена:
1. Вызовите `POST /api/auth/login` с email и паролем
2. Получите токен в ответе
3. Добавьте токен при нажатии кнопки "Authorize" в Swagger

#### Регистрация нового пользователя
POST /api/auth/register
тело запроса:
{
  "email": "student@example.com",
  "password": "Password123",
  "firstName": "Иван",
  "lastName": "Петров",
  "role": "Student"
}

успешный ответ (200):
{
  "user": {
    "id": 1,
    "email": "student@example.com",
    "firstName": "Иван",
    "lastName": "Петров",
    "role": "Student",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Доступные роил: "Student", "Teacher", "Admin"

#### Вход в систему
POST /api/auth/login

тело запроса:
{
  "email": "student@example.com",
  "password": "Password123"
}

#### Получить список пользователей(только админ)
GET /api/users?page=1&pageSize=10&role=Student&search=иван

page - номер страницы (по умолчанию 1)

pageSize - размер страницы (по умолчанию 10)

role - фильтр по роли (опционально)

search - поиск по имени, фамилии или email (опционально)

успешный ответ (200):
{
  "items": [
    {
      "id": 1,
      "email": "student@example.com",
      "firstName": "Иван",
      "lastName": "Петров",
      "role": "Student",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalCount": 45,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5,
  "hasPrevious": false,
  "hasNext": true
}

#### получить профиль текущего пользователя
GET /api/users/profile

#### получить пользователя по ID
GET /api/users/1

#### удалить пользователя(только админ)
DELETE /api/users/1
Ответ: 204 No Content

#### получение списков курса 
GET /api/courses?page=1&pageSize=5&level=Beginner&search=шведский
page, pageSize - пагинация

level - фильтр по уровню (опционально)

search - поиск по названию или описанию (опционально)

уровни курсов: "Beginner", "Intermediate", "Advanced", "A1", "A2", "B1", "B2", "C1", "C2"
успешный ответ (200):
{
  "items": [
    {
      "id": 1,
      "title": "Шведский для начинающих",
      "description": "Базовый курс шведского языка",
      "level": "Beginner",
      "price": 5000.00,
      "durationHours": 40,
      "teacherName": "Анна Иванова"
    }
  ],
  "totalCount": 15,
  "page": 1,
  "pageSize": 5,
  "totalPages": 3,
  "hasPrevious": false,
  "hasNext": true
}

#### получение курса по ID
GET /api/courses/1

#### создание нового курса(только админ и преподаватель)
POST /api/courses

тело запроса: 
{
  "title": "Новый курс шведского",
  "description": "Описание курса",
  "level": "Intermediate",
  "price": 7500.00,
  "durationHours": 60
}

# ошибки и статус коды 

200 - Успех

201 - Создано

400 - Ошибка валидации

401 - Не авторизован

403 - Доступ запрещен (не та роль)

404 - Не найдено

500 - Внутренняя ошибка сервера

формат ошибок:
{
  "message": "Описание ошибки",
  "errors": {
    "email": ["Email обязателен"],
    "password": ["Пароль должен содержать минимум 6 символов"]
  }
}