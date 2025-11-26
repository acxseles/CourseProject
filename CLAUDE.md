# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**School Swedish** is a full-stack online learning platform for teaching and learning Swedish language. It features user authentication (Student/Teacher/Admin roles), course management, student enrollment, lesson delivery, assignments, and progress tracking.

**Tech Stack:**
- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, shadcn/ui
- **Backend:** ASP.NET Core 8, Entity Framework Core, MySQL 8.0
- **Infrastructure:** Docker Compose for database orchestration

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
Controllers/              # HTTP endpoints: AuthController, CoursesController, UsersController
↓
Services/                 # Business logic: TokenService for JWT generation
↓
Validators/               # FluentValidation: auto-validates DTOs before controller
↓
Data/                     # ApplicationDbContext: EF Core with 7 DbSets, auto migrations
↓
Database/                 # MySQL with normalized schema (User, Course, Enrollment, Lesson, Assignment, etc.)
```

**Key Patterns:**
- **Dependency Injection:** All services registered in `Program.cs`, constructor-injected into controllers
- **Entity Framework Core:** Auto-creates/seeds database on startup via `context.Database.EnsureCreated()`
- **FluentValidation:** Validators registered globally, auto-validate request DTOs
- **JWT Authentication:** `TokenService.CreateToken()` generates 7-day tokens with user claims
- **CORS:** Configured for `localhost:5173` and `localhost:3000` in `Program.cs`
- **Logging:** Serilog structured logging to console and daily rolling files in `logs/` directory

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
| Frontend Root | `frontend/src/App.tsx` | QueryClientProvider, theme, auth init |
| Frontend Routes | `frontend/src/app/router/index.tsx` | Route definitions, ProtectedRoute wrapper |
| Frontend Auth | `frontend/src/features/auth/store.ts` | Zustand state (user, token, isAuthenticated) |
| Frontend API | `frontend/src/shared/api/client.ts` | Axios instance with interceptors |
| Backend Root | `backend/Program.cs` | DI, middleware, EF Core setup, seeding |
| Backend Auth | `backend/Controllers/AuthController.cs` | POST /auth/login, POST /auth/register |
| Backend DB | `backend/Data/ApplicationDbContext.cs` | EF Core DbContext, OnModelCreating |
| Token Service | `backend/Services/TokenService.cs` | JWT generation with 7-day expiry |

## Database Initialization

On first backend startup, `Program.cs` runs `SeedDatabase()`:
1. Creates test users: admin@school.com, teacher@school.com, student1@school.com, student2@school.com (all password: `temp123`)
2. Creates 2 sample courses taught by teacher@school.com
3. Enrolls both students in both courses

To reset database: Delete `mysql_data` Docker volume and restart container.

## Common Development Tasks

### Fixing Port Issues (Windows)

If port 5000 is occupied:
```bash
netstat -ano | findstr :5000
taskkill /PID {id} /F
```

### Adding a New API Endpoint

1. **Create DTO** in `backend/DTOs/`
2. **Create Validator** in `backend/Validators/` (extends `AbstractValidator<T>`)
3. **Add method to Controller** in `backend/Controllers/` with `[HttpPost/Get/Put/Delete]` attribute
4. **Register validator in `Program.cs`:** `services.AddValidatorsFromAssemblyContaining<Program>()`
5. **Call from frontend** via `shared/api/{feature}Api.ts`

### Adding Frontend Component

1. Use `shared/ui/` components (Button, Input, Card) from shadcn
2. Connect to Zustand store or TanStack Query hooks as needed
3. Follow Tailwind utility-first approach for styling
4. Type all props with TypeScript interfaces

### Running a Single Test

Currently no test projects exist. To add tests:
- **Frontend:** Use Vitest + React Testing Library
- **Backend:** Use xUnit or NUnit, place in `backend.Tests/` project

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
| "Cannot find module '@'" | Check `vite.config.ts` alias and `tsconfig.app.json` paths |
| TypeScript errors in IDE | Run `npx tsc --noEmit` to see all issues |
| 401 Unauthorized errors | Clear localStorage, verify JWT secret matches backend |
| MySQL connection fails | Check `docker ps`, verify credentials in `appsettings.json` |
| CORS errors | Update allowed origins in `Program.cs` Program.UseCorsPolicies section |
| Vite HMR not working | Check port 5173 is accessible, restart `npm run dev` |

## Project Status

**Version:** 0.1.0 (Early Development)

**Completed:**
- User registration & login
- JWT authentication & protected routes
- Course listing with pagination
- Dashboard layout
- UI component library

**In Development:**
- Course catalog features
- Student/teacher dashboards

**Planned:**
- Admin panel
- Analytics & reporting
- Payment integration
- Assignment grading
