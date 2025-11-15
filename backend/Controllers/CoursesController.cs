using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.DTOs;
using SchoolSwedishAPI.Models;
using Serilog;

namespace SchoolSwedishAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CoursesController> _logger;

        public CoursesController(ApplicationDbContext context, ILogger<CoursesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResponseDto<CourseDto>>> GetCourses(
            [FromQuery] PaginationDto pagination,
            [FromQuery] string? level = null,
            [FromQuery] string? search = null)
        {
            try
            {
                _logger.LogInformation("Запрос списка курсов. Page: {Page}, PageSize: {PageSize}",
                    pagination.Page, pagination.PageSize);

                var query = _context.Courses.AsQueryable();

                // Фильтрация по уровню
                if (!string.IsNullOrEmpty(level))
                {
                    query = query.Where(c => c.Level == level);
                    _logger.LogInformation("Фильтр по уровню: {Level}", level);
                }

                // Поиск по названию
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(c => (c.Title ?? "").Contains(search) || (c.Description ?? "").Contains(search));
                    _logger.LogInformation("Поиск по запросу: {Search}", search);
                }

                // Получаем общее количество для метаданных
                var totalCount = await query.CountAsync();

                // Применяем пагинацию
                var courses = await query
                    .OrderBy(c => c.Title)
                    .Skip(pagination.Skip)
                    .Take(pagination.Take)
                    .Select(c => new CourseDto
                    {
                        Id = c.Id,
                        Title = c.Title ?? "",
                        Description = c.Description ?? "",
                        Level = c.Level ?? "",
                        Price = c.Price,
                        DurationHours = c.DurationHours,
                        TeacherName = "Oxana"
                    })
                    .ToListAsync();

                _logger.LogInformation("Получено {Count} курсов из {Total}", courses.Count, totalCount);

                var result = new PagedResponseDto<CourseDto>
                {
                    Items = courses,
                    TotalCount = totalCount,
                    Page = pagination.Page,
                    PageSize = pagination.PageSize
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка курсов");
                return StatusCode(500, new { message = "Ошибка при получении курсов" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(int id)
        {
            try
            {
                _logger.LogInformation("Запрос курса ID: {CourseId}", id);

                var course = await _context.Courses
                    .Where(c => c.Id == id)
                    .Select(c => new CourseDto
                    {
                        Id = c.Id,
                        Title = c.Title ?? "",
                        Description = c.Description ?? "",
                        Level = c.Level ?? "",
                        Price = c.Price,
                        DurationHours = c.DurationHours,
                        TeacherName = "System"
                    })
                    .FirstOrDefaultAsync();

                if (course == null)
                {
                    _logger.LogWarning("Курс не найден ID: {CourseId}", id);
                    return NotFound(new { message = "Курс не найден" });
                }

                _logger.LogInformation("Курс найден: {Title}", course.Title);
                return Ok(course);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении курса ID: {CourseId}", id);
                return StatusCode(500, new { message = "Ошибка при получении курса" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<CourseDto>> CreateCourse([FromBody] CreateCourseDto createCourseDto)
        {
            try
            {
                _logger.LogInformation("Создание нового курса: {Title}", createCourseDto.Title);

                var course = new Course
                {
                    Title = createCourseDto.Title,
                    Description = createCourseDto.Description,
                    Level = createCourseDto.Level,
                    Price = createCourseDto.Price,
                    DurationHours = createCourseDto.DurationHours,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Courses.Add(course);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Курс создан: {Title} (ID: {CourseId})", course.Title, course.Id);

                return Ok(new CourseDto
                {
                    Id = course.Id,
                    Title = course.Title,
                    Description = course.Description,
                    Level = course.Level,
                    Price = course.Price,
                    DurationHours = course.DurationHours,
                    TeacherName = "Oxana" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании курса {Title}", createCourseDto.Title);
                return StatusCode(500, new { message = "Ошибка при создании курса" });
            }
        }
    }
}