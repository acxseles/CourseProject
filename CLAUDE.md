# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**School Swedish** is a full-stack online learning platform for teaching and learning Swedish language. It features user authentication (Student/Teacher/Admin roles), course management, student enrollment, lesson delivery, assignments, and progress tracking.

**Tech Stack:**
- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS v4 (CSS-first), TanStack Query, Zustand, Lucide React
- **Backend:** ASP.NET Core 8, Entity Framework Core, MySQL 8.0, FluentValidation, JWT Auth
- **Infrastructure:** Docker Compose for MySQL 8.0 database

## Development Commands

### Frontend

```bash
cd frontend
npm run dev              # Start dev server with HMR (http://localhost:5173)
npm run build            # Build for production to dist/
npm run preview          # Preview production build locally
npm run lint             # Run ESLint checks
npx tsc --noEmit         # TypeScript type checking
npm install              # Install dependencies
```

### Backend

```bash
cd backend
dotnet run               # Start API server (http://localhost:5000)
dotnet watch run         # Hot reload on file changes
dotnet build             # Compile project
dotnet publish -c Release  # Create release build
```

### Database

```bash
docker compose up -d     # Start MySQL 8.0 container
docker compose down      # Stop and remove container
docker logs school-swedish-mysql  # View MySQL logs
docker exec -it school-swedish-mysql mysql -u root -p school_swedish  # Access MySQL CLI
```

### Full Project Setup

1. Start database: `docker compose up -d`
2. Start backend: `cd backend && dotnet run` (Terminal 1)
3. Start frontend: `cd frontend && npm install && npm run dev` (Terminal 2)
4. Access frontend at `http://localhost:5173`
5. API available at `http://localhost:5000/api`
6. Swagger docs at `http://localhost:5000/swagger`

## High-Level Architecture

### Frontend Architecture (Layered)

```
src/
├── app/router/           # Route configuration with ProtectedRoute guard
├── pages/                # Routed page components (auth, dashboard, landing)
├── features/auth/        # Auth business logic (Zustand store, hooks, API)
├── entities/             # Domain model types
├── shared/
│   ├── api/              # Axios client with interceptors, API endpoints
│   ├── types/            # TypeScript interfaces (User, Course, Auth DTOs)
│   ├── ui/               # Reusable UI components (Button, Input, Card, Alert)
│   └── lib/              # Utilities (cn classname, formatters)
├── widgets/              # Layout sections (Header, Footer, DashboardLayout)
└── App.tsx               # Root with QueryClientProvider, theme setup
```

**Key Patterns:**
- **State Management:** Zustand for client state (auth), TanStack Query for server state (courses, enrollments)
- **Protected Routes:** `ProtectedRoute` component checks `isAuthenticated` before rendering, redirects to login
- **API Client:** Centralized Axios instance with:
  - Request interceptor: Injects Bearer token
  - Response interceptor: Clears auth on 401, redirects to login
  - Type-safe API functions in `shared/api/`
- **Custom Hooks:** `useLogin()`, `useRegister()`, `useLogout()`, `useAuth()` encapsulate auth logic
- **Component Composition:** Pages use layouts (MainLayout, AuthLayout, DashboardLayout) that wrap content with shared header/footer

### Backend Architecture (Layered MVC)

```
Controllers/              # HTTP endpoints
├── AuthController       # Registration, login, token refresh
├── CoursesController    # Course CRUD and listing
├── EnrollmentsController # Student enrollment management
├── UsersController      # User profile and management
├── ImportExportController # PDF export, course import
└── SeedController       # Database seeding
↓
Services/                # Business logic
├── TokenService         # JWT token generation (7-day expiry)
└── [Feature Services]   # Domain-specific logic (future)
↓
Validators/              # FluentValidation
└── [DTOs].Validator     # Auto-validates request DTOs
↓
Models/                  # Entity Framework entities
├── User, Course, Enrollment, Lesson
├── Assignment, StudentAssignment, Report
↓
Data/                    # ApplicationDbContext (EF Core)
└── MySQL Database       # Normalized schema with 7+ tables
```

**Key Patterns:**
- **Dependency Injection:** All services registered in `Program.cs`, constructor-injected into controllers
- **Entity Framework Core:** Auto-creates/seeds database on startup via `context.Database.EnsureCreated()`
- **FluentValidation:** Validators auto-registered and auto-validate request DTOs
- **JWT Authentication:** `TokenService.CreateToken()` generates tokens with user claims
- **CORS:** Configured for `localhost:5173` in `Program.cs` (update for production)
- **Logging:** Serilog structured logging to console and rolling files in `logs/` directory
- **Data Import/Export:** ImportExportController handles course imports and PDF exports

### Authentication Flow

1. **Frontend:** User submits login form → `useLogin()` hook → POST to `/auth/login`
2. **Backend:** `AuthController.Login()` validates credentials, calls `TokenService.CreateToken()`
3. **Response:** Backend returns `{ user: {...}, token: "eyJhbGc..." }`
4. **Frontend:** Token stored in localStorage, Zustand state updated, user redirected to dashboard
5. **Protected Access:** Axios interceptor injects `Authorization: Bearer {token}` header on all requests
6. **Token Expiry:** Automatic logout on 401 response (token expired after 7 days)

### Database Schema

**Core Tables:** `users`, `courses`, `enrollments`, `lessons`, `assignments`, `studentassignments`, `reports`

**Key Relationships:**
- User (Teacher) → Course (One-to-Many)
- User (Student) → Enrollment → Course (Many-to-Many via enrollment)
- Course → Lesson → Assignment → StudentAssignment
- User (Student) → StudentAssignment (One-to-Many)

**User Roles:**
- **Student:** Can view courses, enroll, view assignments, submit submissions
- **Teacher:** Can create courses, view student progress, grade submissions
- **Admin:** Full system access

## Configuration

### Frontend

**Environment Variables** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_JWT_SECRET_KEY=super-secret-key-minimum-64-characters-long-for-jwt-security-1234567890
```

**Key Config Files:**
- `vite.config.ts` - Path aliases (@), dev server port
- `tsconfig.app.json` - Strict mode, ES2022 target
- `eslint.config.js` - Enforces code quality
- `tailwind.config.js` - Custom CSS theme variables

### Backend

**appsettings.json:**
- `ConnectionStrings.DefaultConnection` - MySQL connection string
- `JWT.Secret` - Must match frontend for token validation
- `Logging` - Serilog console + file sink configuration

**Key Config Files:**
- `Program.cs` - DI, middleware, auto-seeding, Swagger setup
- `SchoolSwedishAPI.csproj` - .NET 8.0 target, package dependencies

## Important Entry Points

| Component | File | Purpose |
|-----------|------|---------|
| Frontend Root | `frontend/src/App.tsx` | QueryClientProvider, theme, auth initialization |
| Frontend Routes | `frontend/src/app/router/index.tsx` | Route definitions with ProtectedRoute |
| Frontend Auth | `frontend/src/features/auth/store.ts` | Zustand state (user, token, isAuthenticated, loading) |
| Frontend API | `frontend/src/shared/api/client.ts` | Axios instance with request/response interceptors |
| Frontend Styling | `frontend/src/index.css` | Tailwind v4 @theme tokens and CSS variables |
| Backend Root | `backend/Program.cs` | DI setup, middleware, CORS, EF Core, auto-seeding |
| Backend Auth | `backend/Controllers/AuthController.cs` | POST /auth/login, POST /auth/register endpoints |
| Backend DB | `backend/Data/ApplicationDbContext.cs` | EF Core DbContext, entity relationships, migrations |
| Token Service | `backend/Services/TokenService.cs` | JWT generation with 7-day expiry, user claims |
| Courses API | `backend/Controllers/CoursesController.cs` | Course listing, creation, filtering, pagination |
| Enrollments API | `backend/Controllers/EnrollmentsController.cs` | Student enrollment management |
| Import/Export | `backend/Controllers/ImportExportController.cs` | PDF export, course import functionality |

## Database Initialization

On first backend startup, `Program.cs` runs `SeedDatabase()`:
1. Creates test users: admin@school.com, teacher@school.com, student1@school.com, student2@school.com (all password: `temp123`)
2. Creates 2 sample courses taught by teacher@school.com
3. Enrolls both students in both courses

To reset database: Delete `mysql_data` Docker volume and restart container.

## Adding New Features

### Backend: Adding a New API Endpoint

1. **Create DTO** in `backend/DTOs/` (request/response types)
2. **Create Validator** in `backend/Validators/` extending `AbstractValidator<YourDto>`
3. **Create Model** in `backend/Models/` if it's a new entity (inherits relationships with EF)
4. **Add DbSet** to `backend/Data/ApplicationDbContext.cs` if new entity
5. **Add method to Controller** in `backend/Controllers/` with `[HttpPost/Get/Put/Delete]` attribute
6. **Dependency Inject** any services needed (TokenService, etc.)
7. **Call from Frontend** via `frontend/src/shared/api/{feature}Api.ts`

### Frontend: Adding a Feature Module

Following Feature-Sliced Design:
1. Create `frontend/src/features/[feature]/` directory
2. Add `store.ts` for Zustand state (if needed)
3. Add `hooks.ts` for custom hooks wrapping API calls
4. Export public API from `index.ts`
5. Import and use in pages or components

### Frontend: Adding a Page

1. Create folder in `frontend/src/pages/[feature]/[page]/`
2. Add `index.tsx` (routed component) and sub-components as needed
3. Add route to `frontend/src/app/router/index.tsx`
4. Wrap with `<ProtectedRoute>` if authentication required
5. Use layouts from `widgets/` (MainLayout, AuthLayout, DashboardLayout)

## Frontend Architecture Details

### Tailwind CSS v4 (CSS-First Configuration)

**CRITICAL:** Tailwind v4 uses CSS-first configuration. **ALL styling work happens in `src/index.css`** via `@theme` directive. The `tailwind.config.js` file is not used.

```css
/* src/index.css - Theme tokens defined here */
@import "tailwindcss";

@theme {
  --color-primary-500: #ffab4c;
  --color-primary-600: #f59a3f;
  --color-accent-400: #fe4e80;
  /* ... define all theme tokens */
}

:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
}
```

**Color Palette:**
- **Primary:** Orange (#FFAB4C) — `bg-primary-*`, `text-primary-*`
- **Accent:** Pink (#FE4E80) — `bg-accent-*`, `text-accent-*`
- **Secondary:** Purple (#D987ED) — `bg-secondary-*`, `text-secondary-*`
- **Neutral:** Grayscale — `bg-neutral-*`, `text-neutral-*`

**Usage in Components:**
```tsx
// ✅ Use Tailwind utilities directly
<div className="bg-primary-600 text-white">

// ✅ Use CSS variables in inline styles when needed
<div style={{color: 'var(--color-primary-600)'}}>

// Use cn() helper to merge classnames
import { cn } from '@/shared/lib';
className={cn('base-classes', condition && 'conditional-class')}
```

### State Management Strategy

- **Zustand:** Global client state (auth, user info, UI state)
  - Location: `src/features/[feature]/store.ts`
  - Example: `features/auth/store.ts` for authentication state
- **TanStack Query:** Server state (courses, enrollments, lessons)
  - Cache, background sync, refetch management
  - Example patterns in API integration section

## Security Considerations

- **JWT Secret:** Change in both `appsettings.json` and `.env` before production
- **CORS:** Update `Program.cs` line ~122 with production frontend URL
- **Password Hashing:** BCrypt.Net used, salts handled automatically
- **SQL Injection:** EF Core parameterized queries prevent injection
- **Token Expiry:** 7 days, automatic logout on 401
- **HttpOnly Cookies:** Consider for production (currently using localStorage)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 occupied (Windows) | `netstat -ano \| findstr :5000` then `taskkill /PID {id} /F` |
| Port 5173 occupied | Kill the process or use `npm run dev -- --port 5174` |
| TypeScript errors in IDE | Run `npm run build` (includes `tsc -b`) to see all issues |
| 401 Unauthorized errors | Clear localStorage, verify JWT secret in both `.env` and `appsettings.json` match |
| MySQL connection fails | Verify `docker ps` shows container running, check credentials in `appsettings.json` |
| CORS errors | Update allowed origins in `backend/Program.cs` (currently allows localhost:5173) |
| Vite HMR not working | Restart dev server: `npm run dev` |
| "Cannot find module '@'" | Verify `vite.config.ts` alias and `tsconfig.app.json` paths are correct |
| Styling not applying (Tailwind) | Check `src/index.css` has `@import "tailwindcss"` and `@theme` block defined |

## API Documentation

Swagger docs available at `http://localhost:5000/swagger` when backend is running.

**Key Endpoints:**
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/register` - User registration
- `GET /api/users/profile` - Get current user profile
- `GET /api/courses` - List courses (supports pagination)
- `POST /api/courses` - Create course (teacher only)
- `GET /api/enrollments` - Get student enrollments
- `POST /api/enrollments` - Enroll in course
- `POST /api/import-export/import-courses` - Import courses from CSV/Excel
- `GET /api/import-export/export-pdf` - Export course as PDF

**Test Credentials (after seeding):**
- Student: `student1@school.com` / `temp123`
- Teacher: `teacher@school.com` / `temp123`
- Admin: `admin@school.com` / `temp123`

## Project Status

**Version:** 0.2.0 (Active Development)

**Completed:**
- User authentication (login, registration, JWT)
- Protected routes and role-based access
- Course management (CRUD, listing with pagination)
- Student enrollment system
- Course import/export functionality
- PDF course export
- Dashboard layouts
- Comprehensive UI component library
- Zustand state management
- TanStack Query integration (prepared)

**In Development:**
- Student/teacher dashboard features
- Assignment submission system
- Progress tracking

**Planned:**
- Admin panel
- Advanced analytics & reporting
- Assignment grading system
- Real-time notifications
