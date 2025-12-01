# Navigation Map - School Swedish Frontend

## Overview
All pages are now fully accessible through both the UI navigation and direct URL routing.

---

## Public Pages (No Authentication Required)

| Page | URL | Access | Navigation |
|------|-----|--------|-----------|
| Landing Page | `/` | Public | Home link in Header |
| Login | `/auth/login` | Public | Header "Вход" button |
| Register | `/auth/register` | Public | Header "Регистрация" button |

---

## Authenticated User Pages (All Roles)

### Main Navigation (Available in Header & Sidebar)

| Page | URL | Icon | Navigation Path |
|------|-----|------|-----------------|
| Dashboard | `/dashboard` | LayoutDashboard | Header "Кабинет" or Sidebar "Главная" |
| Course Catalog | `/courses` | BookOpen | Header "Курсы" or Sidebar "Каталог курсов" |
| Course Details | `/courses/:id` | BookOpen | Click course card in catalog |
| My Courses | `/dashboard/my-courses` | BookCopy | Sidebar "Мои курсы" |
| Settings | `/dashboard/settings` | Settings | Sidebar "Настройки" |

---

## Role-Based Pages

### Student (All of the above only)

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/dashboard` | View profile & enrolled courses |
| Course Catalog | `/courses` | Browse and enroll in courses |
| My Courses | `/dashboard/my-courses` | View and manage enrollments |
| Settings | `/dashboard/settings` | Manage profile & account |

### Teacher

**Additional Pages:**

| Page | URL | Icon | Navigation | Purpose |
|------|-----|------|-----------|---------|
| Course Management | `/dashboard/teacher` | BookCopy | Sidebar "Управление курсами" | Create, edit, delete courses |

**Available:**
- All student pages
- Plus course management interface

### Admin

**Additional Pages:**

| Page | URL | Icon | Navigation | Purpose |
|------|-----|------|-----------|---------|
| User Management | `/dashboard/admin` | Users | Sidebar "Управление пользователями" | Manage all users |
| Import/Export | `/import-export` | Download | Sidebar "Импорт/Экспорт" or Header (mobile) | Bulk import/export courses |

**Available:**
- All student & teacher pages
- Plus admin-specific features

---

## UI Navigation Structure

### Header Navigation (Top Bar)

**Unauthenticated:**
- Logo (links to `/`)
- Theme Switcher
- Login button → `/auth/login`
- Register button → `/auth/register`

**Authenticated (Desktop):**
- Logo (links to `/`)
- Courses button → `/courses`
- Dashboard button → `/dashboard`
- User Profile Card (info only)
- Theme Switcher
- Logout button

**Authenticated (Mobile):**
- Logo (links to `/`)
- Menu icon (opens mobile sidebar)
- Theme Switcher in mobile menu
- Courses link → `/courses`
- Dashboard link → `/dashboard`
- Logout button
- Admin-only: Import/Export link → `/import-export`

### Dashboard Sidebar (Left Sidebar)

**All Users:**
- Главная (Dashboard) → `/dashboard`
- Каталог курсов (Course Catalog) → `/courses`
- Мои курсы (My Courses) → `/dashboard/my-courses`
- Настройки (Settings) → `/dashboard/settings`

**Teacher Only:**
- Управление курсами (Course Management) → `/dashboard/teacher`

**Admin Only:**
- Управление пользователями (User Management) → `/dashboard/admin`
- Импорт/Экспорт (Import/Export) → `/import-export`

---

## Direct URL Access

All pages can be accessed directly via URL if authenticated:

```
Base URL: http://localhost:5173

Public Routes:
- /
- /auth/login
- /auth/register

Protected Routes (requires login):
- /dashboard
- /courses
- /courses/:id (e.g., /courses/5)
- /dashboard/my-courses
- /dashboard/settings
- /dashboard/teacher (teacher+ only)
- /dashboard/admin (admin only)
- /import-export (admin only)
```

---

## Feature Coverage

### ✅ Fully Implemented & Accessible

- [x] Course Catalog with search & filtering
- [x] Course Details with enrollment
- [x] Student Dashboard with enrollment management
- [x] Teacher Dashboard with course management
- [x] Admin Panel with user management
- [x] Settings/Profile page
- [x] Import/Export functionality
- [x] Role-based navigation
- [x] Mobile-responsive navigation
- [x] Protected routes with authentication checks

### 🔄 Ready for Backend Integration

All API endpoints are fully typed and ready to connect:

| Feature | API Endpoint | Implementation | Status |
|---------|-------------|-----------------|--------|
| Courses | `GET /api/courses` | ✅ coursesApi.ts | Ready |
| Course Details | `GET /api/courses/{id}` | ✅ coursesApi.ts | Ready |
| Enrollment | `POST /api/enrollments` | ✅ enrollmentsApi.ts | Ready |
| My Courses | `GET /api/enrollments/student/{id}` | ✅ enrollmentsApi.ts | Ready |
| User Profile | `GET /api/users/profile` | ✅ usersApi.ts | Ready |
| Users List | `GET /api/users` | ✅ usersApi.ts | Ready |
| Delete User | `DELETE /api/users/student/{id}` | ✅ usersApi.ts | Ready |
| Export PDF | `GET /api/import-export/export/courses/pdf` | ✅ importExportApi.ts | Ready |
| Import Excel | `POST /api/import-export/import/courses/excel` | ✅ importExportApi.ts | Ready |

---

## Navigation Quick Reference

### For Students
1. **Login** at `/auth/login`
2. **Browse courses** at `/courses`
3. **Enroll** by clicking course and pressing "Записаться"
4. **View enrolled** at `/dashboard/my-courses`
5. **Manage profile** at `/dashboard/settings`

### For Teachers
1. **Login** at `/auth/login`
2. All student features +
3. **Manage courses** at `/dashboard/teacher`
4. **View enrollments** in course management

### For Admins
1. **Login** at `/auth/login`
2. All teacher features +
3. **Manage users** at `/dashboard/admin`
4. **Import/Export** at `/import-export`

---

## Testing Credentials (Backend Seeded)

```
Student:  student1@school.com / temp123
Teacher:  teacher@school.com / temp123
Admin:    admin@school.com / temp123
```

---

## Build Status

✅ **TypeScript**: All type checks pass
✅ **Build**: Production build successful (570.78 kB)
✅ **Routes**: All 10+ pages fully integrated
✅ **Navigation**: UI and programmatic routing complete
