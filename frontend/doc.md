# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

School Swedish Frontend - A React 19 + TypeScript frontend for an online Swedish language learning platform. The frontend integrates with an ASP.NET Core backend API, handling user authentication, course management, and student progress tracking with JWT-based security.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **UI Framework** | React 19 |
| **Language** | TypeScript 5.9 (strict mode) |
| **Build Tool** | Vite 7.2 |
| **Styling** | Tailwind CSS + @tailwindcss/vite |
| **Routing** | React Router 7 |
| **HTTP Client** | Axios |
| **State Management** | Zustand + TanStack Query 5 |
| **Forms** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Linting** | ESLint 9 with TypeScript support |
| **Architecture** | Feature-Sliced Design (FSD) |

## Running the Application

All commands run from the `school-frontend/` directory:

```bash
# Install dependencies
npm install

# Development mode (hot reload, unoptimized)
npm run dev
# Available at http://localhost:5173

# Production build (optimized, ~146.66 kB gzipped)
npm run build

# Preview production build locally
npm run preview

# Lint code with ESLint
npm run lint

# Type check (included in build)
npm run build  # Runs tsc -b before vite build
```

## Backend Integration

The frontend connects to the backend API at `https://localhost:7106` (configured via `VITE_API_URL` in `.env`).

### Available Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT token)
- `GET /api/users/profile` - Get current user profile
- `GET /api/courses` - List all courses

### Authentication Flow
1. User registers/logs in via auth forms
2. Backend returns JWT token in response
3. Token stored in localStorage via `tokenService.ts`
4. Axios interceptor in `client.ts` automatically adds `Authorization: Bearer {token}` header
5. On 401 response, user is redirected to login page
6. Token expires after 7 days (backend-configured)

### Test Credentials

After backend seed (`POST /api/seed/fill-database`):
- Student: `student1@school.com` / `temp123`
- Teacher: `teacher@school.com` / `temp123`
- Admin: `admin@school.com` / `temp123`

## Project Structure

The project follows **Feature-Sliced Design (FSD)** architecture:

```
src/
├── app/                    # Application initialization
│   ├── router/
│   │   ├── index.tsx       # Route definitions
│   │   └── ProtectedRoute.tsx  # Authorization wrapper
│   └── providers/          # Context providers (future)
│
├── pages/                  # Page components (routed)
│   ├── landing/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── index.tsx
│   │   │   └── LoginForm.tsx
│   │   └── register/
│   │       ├── index.tsx
│   │       └── RegisterForm.tsx
│   └── dashboard/
│
├── features/               # Business features/modules
│   └── auth/
│       ├── store.ts        # Zustand auth state
│       ├── hooks.ts        # useAuth, useLogin, useRegister, useLogout
│       └── index.ts        # Public exports
│
├── entities/               # Domain entities (future use)
│
├── shared/                 # Shared utilities and components
│   ├── api/
│   │   ├── client.ts       # Axios instance with interceptors
│   │   ├── tokenService.ts # JWT token management
│   │   ├── authApi.ts      # Auth API calls
│   │   └── index.ts
│   │
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces (User, Course, Auth DTOs, etc.)
│   │
│   ├── lib/
│   │   ├── cn.ts           # classname merger (clsx + tailwind-merge)
│   │   ├── formatters.ts   # formatDate, formatCurrency, getInitials, etc.
│   │   └── index.ts
│   │
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx      # primary, secondary, ghost, danger variants
│       ├── Input.tsx       # with error support
│       ├── Card.tsx        # with CardHeader
│       ├── Alert.tsx       # success, error, warning, info types
│       └── index.ts
│
├── widgets/                # Complex composite components
│   ├── MainLayout.tsx      # Main app layout
│   ├── AuthLayout.tsx      # Auth pages layout
│   ├── DashboardLayout.tsx # Dashboard layout
│   └── Header.tsx          # Navigation header
│
├── index.css               # Tailwind directives
├── App.tsx                 # Main app component with routes
└── main.tsx                # React DOM render entry point
```

## Key Architectural Patterns

### Authentication & Authorization
- Protected routes use `<ProtectedRoute>` wrapper that checks `isAuthenticated` state
- Access current user via `useAuth()` hook: `const { user, isAuthenticated } = useAuth()`
- Roles stored in JWT token claims; can be decoded for role-based UI

### State Management
- **Zustand** for global auth state (user, token, loading, error)
- **TanStack Query** for server state (courses, user data, etc.) - prepared but not yet used extensively
- Hooks pattern: `useLogin()`, `useRegister()`, `useLogout()` return `{ mutate, isPending, error }`

### Form Handling
- React Hook Form with Zod validation
- Example: `LoginForm.tsx` and `RegisterForm.tsx` show patterns
- Validation errors automatically displayed in UI

### Styling
- Tailwind CSS utility classes exclusively (no CSS modules)
- Use `cn()` helper to merge classnames: `cn('base-classes', condition && 'conditional-class')`
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Primary color: blue-600, Secondary: gray-200

### API Integration
- Centralized Axios client in `shared/api/client.ts`
- Token interceptor automatically adds JWT to requests
- Error interceptor handles 401 (redirects to login)
- API functions in `authApi.ts` follow naming: `registerUser()`, `loginUser()`, etc.

## Common Development Tasks

### Adding a New Page
1. Create page component in `src/pages/[feature]/`
2. Add route to `src/app/router/index.tsx`
3. Wrap with `<ProtectedRoute>` if authentication required
4. Use layouts from `widgets/` (MainLayout, AuthLayout, DashboardLayout)

### Adding a Feature Module
1. Create `src/features/[feature]/` directory
2. Add `hooks.ts` for feature-specific hooks
3. Add `store.ts` if state management needed (Zustand)
4. Export public API from `index.ts`
5. Import and use hooks in components

### Adding UI Components
1. Create component in `src/shared/ui/`
2. Export from `src/shared/ui/index.ts`
3. Use TypeScript interfaces for props
4. Use `cn()` for className merging
5. Apply Tailwind classes (no CSS modules)

### Adding API Calls
1. Add function to `src/shared/api/authApi.ts` or create new file
2. Use centralized Axios client: `import { apiClient } from './client'`
3. Include TypeScript types for request/response
4. Create custom hook in feature module that wraps mutation/query

## Building & Quality

### TypeScript Strict Mode
- Strict type checking enabled (`strict: true` in tsconfig.app.json)
- No unused locals or parameters
- Path aliases configured: `@/` → `src/`

### Linting
- ESLint with TypeScript + React Hooks support
- Config: `eslint.config.js`
- Check code: `npm run lint`
- Run before commits to catch issues early

### Build Process
1. `tsc -b` - TypeScript type checking
2. Vite bundling and optimization
3. Tailwind CSS compilation
4. Output: `dist/` directory

## Environment Configuration

Create `.env` file (see `.env.example`):

```env
VITE_API_URL=https://localhost:7106
```

Used in `src/shared/api/client.ts` for API base URL.

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes** - hot reload enabled automatically
3. **Check types**: `npm run build` (includes tsc -b)
4. **Lint code**: `npm run lint` before committing
5. **Build for production**: `npm run build`
6. **Test build locally**: `npm run preview`

## Troubleshooting

### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install && npm run build
```

### API Connection Issues
- Ensure backend runs on `https://localhost:7106`
- Check `VITE_API_URL` in `.env` matches backend URL
- Inspect Network tab in DevTools
- Verify token in localStorage (DevTools > Application > Storage)

### Type Errors
- Run `npm run build` to see all TypeScript errors
- Enable VSCode's TypeScript problem checker
- Check path aliases in `tsconfig.app.json`

### Hot Reload Not Working
- Restart dev server: `npm run dev`
- Clear browser cache
- Check console for Vite errors

## Tailwind CSS v4 Styling Guide - CRITICAL

**⚠️ IMPORTANT**: Tailwind v4 uses CSS-first configuration. **ALL styling work happens in `src/index.css`** via `@theme` directive. **`tailwind.config.js` is NOT NEEDED** (deleted).

### Tailwind v4 Architecture (CSS-First)

```css
@import "tailwindcss";

@theme {
  --color-primary-50: #fff9f5;
  --color-primary-500: #ffab4c;
  --color-primary-600: #f59a3f;
  /* ... define all theme tokens here */
}

:root {
  /* Additional CSS variables for inline styles */
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
}
```

### Key Principles

1. **`@theme` block**: Define design tokens (colors, spacing, fonts) that become Tailwind utilities
2. **`:root` variables**: Define additional CSS variables for use in inline `style` attributes
3. **No tailwind.config.js**: Configuration is pure CSS, not JavaScript
4. **Auto-generated utilities**: Every `@theme` variable automatically creates Tailwind classes

### Usage in Components

```tsx
// ✅ CORRECT - Use Tailwind utilities directly
<div className="bg-primary-600 text-white border-border">

// ✅ CORRECT - Use CSS variables in inline styles for complex scenarios
<div style={{color: 'var(--color-primary-600)'}}>

// ✅ CORRECT - Gradients as CSS classes
<div className="bg-gradient-primary">

// ❌ WRONG - Don't hardcode colors
<div className="bg-blue-600">
```

### Color Palette (Project Colors)
- **Primary**: Orange/Yellow (#FFAB4C) — `bg-primary-*`, `text-primary-*`
- **Accent**: Pink/Red (#FE4E80) — `bg-accent-*`, `text-accent-*`
- **Secondary**: Purple (#D987ED) — `bg-secondary-*`, `text-secondary-*`
- **Neutral**: Grayscale (#1a1a1a to #fafafa) — `bg-neutral-*`, `text-neutral-*`
- **Semantic**: success, warning, error, info

### Gradient Utilities (Defined in index.css)
```css
.bg-gradient-primary {
  background-image: linear-gradient(135deg,
    var(--color-primary-500) 0%,
    var(--color-accent-400) 50%,
    var(--color-secondary-500) 100%
  );
}
```

Use: `className="bg-gradient-primary"`

### Workflow
1. **Add new color?** → Update `@theme` section in `src/index.css`
2. **Need CSS variable?** → Add to `:root` in `src/index.css`
3. **Restart server?** → `npm run dev` after CSS changes
4. **Use in component?** → Tailwind class for standard usage, `style` for dynamic values

## Development Phases

**Completed (Phases 0-2)**:
- Project setup with Vite + React 19 + TypeScript
- ESLint + Tailwind CSS configuration
- FSD project structure with path aliases
- API client with token management
- State management with Zustand
- Protected routes and auth forms
- UI component library (Button, Input, Card, Alert)
- Landing page with course previews
- Dashboard for authenticated users
- Responsive design

**Upcoming (Phase 3+)**:
- Course catalog with search and filters
- Student course enrollment and lessons
- Assignment submission system
- Teacher course management panel
- Admin user management panel
- Advanced UI features (animations, toast notifications, skeleton loaders)
- Comprehensive testing
