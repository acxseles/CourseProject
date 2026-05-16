using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.DTOs;
using SchoolSwedishAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Serilog;
using System.Security.Claims;

namespace SchoolSwedishAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(ApplicationDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] // Только админы могут видеть всех пользователей
        public async Task<ActionResult<PagedResponseDto<UserDto>>> GetUsers(
            [FromQuery] PaginationDto pagination,
            [FromQuery] string? role = null,
            [FromQuery] string? search = null)
        {
            try
            {
                _logger.LogInformation("Запрос списка пользователей. Page: {Page}, PageSize: {PageSize}",
                    pagination.Page, pagination.PageSize);

                var query = _context.Users.AsQueryable();

                // Фильтрация по роли
                if (!string.IsNullOrEmpty(role))
                {
                    query = query.Where(u => u.Role == role);
                    _logger.LogInformation("Фильтр по роли: {Role}", role);
                }

                // Поиск по имени, фамилии или email
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(u =>
                        u.FirstName.Contains(search) ||
                        u.LastName.Contains(search) ||
                        u.Email.Contains(search));
                    _logger.LogInformation("Поиск пользователей: {Search}", search);
                }

                // Получаем общее количество
                var totalCount = await query.CountAsync();

                // Применяем пагинацию
                var users = await query
                    .OrderBy(u => u.LastName)
                    .ThenBy(u => u.FirstName)
                    .Skip(pagination.Skip)
                    .Take(pagination.Take)
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Role = u.Role,
                        CreatedAt = u.CreatedAt
                    })
                    .ToListAsync();

                _logger.LogInformation("Получено {Count} пользователей из {Total}", users.Count, totalCount);

                var result = new PagedResponseDto<UserDto>
                {
                    Items = users,
                    TotalCount = totalCount,
                    Page = pagination.Page,
                    PageSize = pagination.PageSize
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка пользователей");
                return StatusCode(500, new { message = "Ошибка при получении пользователей" });
            }
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                _logger.LogInformation("Запрос пользователя ID: {UserId}", id);

                var user = await _context.Users
                    .Where(u => u.Id == id)
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Role = u.Role,
                        CreatedAt = u.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    _logger.LogWarning("Пользователь не найден ID: {UserId}", id);
                    return NotFound(new { message = "Пользователь не найден" });
                }

                _logger.LogInformation("Пользователь найден: {Email}", user.Email);
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении пользователя ID: {UserId}", id);
                return StatusCode(500, new { message = "Ошибка при получении пользователя" });
            }
        }

        // GET: api/users/profile
        [HttpGet("profile")]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                    ?? throw new UnauthorizedAccessException("User ID claim not found");
                var userId = int.Parse(userIdClaim);
                _logger.LogInformation("Запрос профиля пользователя ID: {UserId}", userId);

                var user = await _context.Users
                    .Where(u => u.Id == userId)
                    .Select(u => new UserDto
                    {
                        Id = u.Id,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Role = u.Role,
                        CreatedAt = u.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    _logger.LogWarning("Профиль не найден для пользователя ID: {UserId}", userId);
                    return NotFound(new { message = "Профиль не найден" });
                }

                _logger.LogInformation("Профиль получен: {Email}", user.Email);
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении профиля");
                return StatusCode(500, new { message = "Ошибка при получении профиля" });
            }
        }

        [HttpDelete("student/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                _logger.LogInformation("Попытка удаления студента {StudentId}", id);

                // Ищем студента
                var student = await _context.Users
                    .Include(u => u.Enrollments)
                    .Include(u => u.Studentassignments)
                    .Include(u => u.SessionBookings)
                    .FirstOrDefaultAsync(u => u.Id == id && u.Role == "Student");

                if (student == null)
                {
                    return NotFound(new { message = "Студент не найден" });
                }

                // Удаляем связанные записи, если они есть
                if (student.Enrollments.Any())
                    _context.Enrollments.RemoveRange(student.Enrollments);

                if (student.Studentassignments.Any())
                    _context.Studentassignments.RemoveRange(student.Studentassignments);

                if (student.SessionBookings.Any())
                    _context.SessionBookings.RemoveRange(student.SessionBookings);

                // Удаляем самого студента
                _context.Users.Remove(student);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Студент {StudentId} успешно удален", id);

                return Ok(new { message = "Студент успешно удален" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении студента {StudentId}", id);
                return StatusCode(500, new { message = "Ошибка при удалении студента" });
            }
        }

        // Обновить пользователя (только для админа)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateDto)
        {
            try
            {
                _logger.LogInformation("Обновление пользователя ID: {UserId}", id);

                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "Пользователь не найден" });
                }

                user.FirstName = updateDto.FirstName;
                user.LastName = updateDto.LastName;
                user.Email = updateDto.Email;
                user.Role = updateDto.Role;
                user.IsActive = updateDto.IsActive;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Пользователь {UserId} обновлён", id);

                return Ok(new
                {
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.Role,
                    user.IsActive,
                    user.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении пользователя ID: {UserId}", id);
                return StatusCode(500, new { message = "Ошибка при обновлении пользователя" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                _logger.LogInformation("Попытка удаления пользователя ID: {UserId}", id);

                var user = await _context.Users
                    .Include(u => u.Enrollments)
                        .ThenInclude(e => e.Course)
                    .Include(u => u.Studentassignments)
                        .ThenInclude(sa => sa.Assignment)
                            .ThenInclude(a => a.Lesson)
                    .Include(u => u.Courses)  // курсы, которые создал преподаватель
                        .ThenInclude(c => c.Lessons)
                            .ThenInclude(l => l.Assignments)
                                .ThenInclude(a => a.Questions)
                                    .ThenInclude(q => q.Answers)
                    .Include(u => u.Courses)
                        .ThenInclude(c => c.Enrollments)
                 
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "Пользователь не найден" });
                }

                // 1. Удаляем записи о прогрессе уроков
                var lessonProgress = await _context.LessonProgress
                    .Where(lp => lp.StudentId == id)
                    .ToListAsync();
                if (lessonProgress.Any())
                    _context.LessonProgress.RemoveRange(lessonProgress);

                // 2. Удаляем записи о зачислениях на курсы
                if (user.Enrollments.Any())
                    _context.Enrollments.RemoveRange(user.Enrollments);

                // 3. Удаляем выполненные задания
                if (user.Studentassignments.Any())
                    _context.Studentassignments.RemoveRange(user.Studentassignments);

                // 4. Если пользователь преподаватель - удаляем его курсы со всеми связанными данными
                if (user.Role == "Teacher" && user.Courses.Any())
                {
                    foreach (var course in user.Courses)
                    {
                        // Удаляем записи о зачислениях на курс
                        if (course.Enrollments.Any())
                            _context.Enrollments.RemoveRange(course.Enrollments);

                        // Удаляем уроки и связанные с ними данные
                        foreach (var lesson in course.Lessons)
                        {
                            foreach (var assignment in lesson.Assignments)
                            {
                                foreach (var question in assignment.Questions)
                                {
                                    if (question.Answers.Any())
                                        _context.Answers.RemoveRange(question.Answers);
                                }
                                if (assignment.Questions.Any())
                                    _context.Questions.RemoveRange(assignment.Questions);

                                var studentResults = await _context.Studentassignments
                                    .Where(sa => sa.AssignmentId == assignment.Id)
                                    .ToListAsync();
                                if (studentResults.Any())
                                    _context.Studentassignments.RemoveRange(studentResults);
                            }
                            if (lesson.Assignments.Any())
                                _context.Assignments.RemoveRange(lesson.Assignments);
                        }
                        if (course.Lessons.Any())
                            _context.Lessons.RemoveRange(course.Lessons);
                    }
                    _context.Courses.RemoveRange(user.Courses);
                }

                

                // 6. Удаляем самого пользователя
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Пользователь {UserId} удалён", id);

                return Ok(new { message = "Пользователь успешно удалён" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении пользователя ID: {UserId}", id);
                return StatusCode(500, new { message = "Ошибка при удалении пользователя: " + ex.Message });
            }
        }
    }
}