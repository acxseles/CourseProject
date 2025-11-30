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

        // DELETE: api/users/
        [HttpDelete("student/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                _logger.LogInformation("Удаление студента {StudentId}", id);

                // Ищем студента
                var student = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == id && u.Role == "Student");

                if (student == null)
                {
                    return NotFound(new { message = "Студент не найден" });
                }

                // Меняем статус записей на "Dropped" вместо удаления
                var studentEnrollments = await _context.Enrollments
                    .Where(e => e.StudentId == id && e.Status == "Active")
                    .ToListAsync();

                if (studentEnrollments.Any())
                {
                    foreach (var enrollment in studentEnrollments)
                    {
                        enrollment.Status = "Dropped";
                    }
                    await _context.SaveChangesAsync();
                }

                // Удаляем студента
                _context.Users.Remove(student);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Студент {StudentId} удален, {Count} записей помечено как Dropped",
                    id, studentEnrollments.Count);

                return Ok(new
                {
                    message = "Студент успешно удален",
                    droppedEnrollments = studentEnrollments.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении студента {StudentId}", id);
                return StatusCode(500, new { message = "Ошибка при удалении студента" });
            }
        }
    }
}