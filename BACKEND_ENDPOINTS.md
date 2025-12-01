# Backend API Endpoints Inventory

## Summary

- **Total Endpoints:** 23
- **Used Endpoints:** 2
- **Unused Endpoints:** 21
- **Usage Rate:** 8.7%

---

## Authentication Controller (`/api/auth`)

### ✅ USED Endpoints

| Method | Endpoint | Description | Frontend Usage |
|--------|----------|-------------|-----------------|
| `POST` | `/auth/login` | User login | ✅ `authApi.ts` - Login page |
| `POST` | `/auth/register` | User registration | ✅ `authApi.ts` - Register page |

---

## Users Controller (`/api/users`)

### ❌ UNUSED Endpoints

| Method | Endpoint | Description | Notes |
|--------|----------|-------------|-------|
| `GET` | `/users` | List all users (paginated) | Admin only. No frontend calls. Could be used for admin panel. |
| `GET` | `/users/{id}` | Get user by ID | Requires auth. No frontend calls. |
| `GET` | `/users/profile` | Get current user profile | Requires auth. No frontend calls. Could be used to populate user info in dashboard. |
| `DELETE` | `/users/student/{id}` | Delete student | Admin only. No frontend calls. Would be needed for admin user management. |

**Reason for non-use:** Not yet integrated into frontend. Would be needed for admin panel and user profile features.

---

## Courses Controller (`/api/courses`)

### ❌ UNUSED Endpoints

| Method | Endpoint | Description | Notes |
|--------|----------|-------------|-------|
| `GET` | `/courses` | List all courses (paginated, filtered) | Supports search & level filtering. No frontend calls. Would be critical for course catalog. |
| `GET` | `/courses/{id}` | Get course details | No frontend calls. Would be used for course detail pages. |
| `POST` | `/courses` | Create new course | Teacher/Admin only. No frontend calls. Needed for teacher dashboard. |
| `DELETE` | `/courses/{id}` | Delete course | Teacher/Admin only. No frontend calls. Needed for teacher course management. |

**Reason for non-use:** Course features not yet implemented in frontend. Critical for course catalog and teacher features.

---

## Enrollments Controller (`/api/enrollments`)

### ❌ UNUSED Endpoints

| Method | Endpoint | Description | Notes |
|--------|----------|-------------|-------|
| `GET` | `/enrollments` | List all enrollments | No frontend calls. Could return enrollments for admin dashboard. |
| `GET` | `/enrollments/course/{courseId}` | Get enrollments for a course | No frontend calls. Needed for teacher course view. |
| `GET` | `/enrollments/student/{studentId}` | Get enrollments for a student | No frontend calls. Needed for student dashboard. |
| `POST` | `/enrollments` | Enroll student in course | No frontend calls. Critical for course enrollment feature. |
| `DELETE` | `/enrollments/{id}` | Cancel enrollment | No frontend calls. Needed for student enrollment management. |

**Reason for non-use:** Student enrollment features not yet implemented in frontend. Critical for core platform functionality.

---

## Import/Export Controller (`/api/import-export`)

### ❌ UNUSED Endpoints

| Method | Endpoint | Description | Notes |
|--------|----------|-------------|-------|
| `GET` | `/import-export/test` | Test endpoint | Debug only. Should be removed before production. |
| `GET` | `/import-export/export/course/{id}/pdf` | Export course as PDF | No frontend calls. Feature implemented but not used. |
| `GET` | `/import-export/export/courses/pdf` | Export all courses as PDF | No frontend calls. Implemented but unused. |
| `POST` | `/import-export/import/courses/excel` | Import courses from Excel | Admin/Teacher only. No frontend calls. Advanced feature not yet integrated. |

**Reason for non-use:** Import/export features implemented in backend but not integrated into frontend UI.

---

## Seed Controller (`/api/seed`)

### ⚠️ DEVELOPMENT-ONLY Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `POST` | `/seed/clear-database` | Clear all data | ⚠️ For development only - **REMOVE BEFORE PRODUCTION** |
| `POST` | `/seed/fill-database` | Fill with test data | ⚠️ For development only - **REMOVE BEFORE PRODUCTION** |

**Important:** These endpoints allow destructive database operations without authentication. Must be removed or secured before deploying to production.

---

## Frontend Integration Status

### Currently Implemented

- ✅ User authentication (login, registration)
- ✅ Zustand auth state management
- ⚠️ Protected routes (ready but no protected pages yet)

### Not Yet Implemented

- ❌ Course catalog / browsing
- ❌ Course details page
- ❌ Student enrollment
- ❌ Student dashboard (view enrollments)
- ❌ Teacher dashboard (manage courses)
- ❌ Admin dashboard (user/teacher management)
- ❌ User profile details (for the dashboard)
- ❌ Import/export features

---

## Recommendations

### High Priority (Core Features)

1. **Implement Course Listing** - Use `GET /api/courses` with search/filter
2. **Implement Course Details** - Use `GET /api/courses/{id}`
3. **Implement Enrollment** - Use `POST /api/enrollments`
4. **Implement Student Dashboard** - Use `GET /api/enrollments/student/{studentId}`

### Medium Priority (Dashboard Features)

5. **Implement User Profile** - Use `GET /api/users/profile`
6. **Implement Teacher Dashboard** - Use `POST /api/courses`, `DELETE /api/courses/{id}`, `GET /api/enrollments/course/{courseId}`
7. **Implement Admin Panel** - Use `GET /api/users`, `DELETE /api/users/student/{id}`

### Low Priority (Advanced Features)

8. **Implement Import/Export** - Use Excel import and PDF export endpoints
9. **Test Seed Endpoints** - Only for development/testing

### Security

- ⚠️ **CRITICAL:** Remove `/seed/*` endpoints before production deployment
- ✅ Good: Most endpoints already have authorization checks
- ✅ Good: Authentication checks in place

---

## Statistics by Controller

| Controller | Total | Used | Unused | Percentage |
|-----------|-------|------|--------|-----------|
| Auth | 2 | 2 | 0 | 100% ✅ |
| Users | 4 | 0 | 4 | 0% ❌ |
| Courses | 4 | 0 | 4 | 0% ❌ |
| Enrollments | 5 | 0 | 5 | 0% ❌ |
| Import/Export | 4 | 0 | 4 | 0% ❌ |
| Seed | 2 | 0 | 2 | 0% (Dev only) |
| **TOTAL** | **23** | **2** | **21** | **8.7%** |

---

## Notes

- Backend API is well-structured and complete
- Frontend is currently minimal, only handling authentication
- All major features (courses, enrollments, dashboards) have endpoints but lack frontend integration
- Codebase is ready for feature development on the frontend
- No missing backend functionality identified - all planned features have endpoints
