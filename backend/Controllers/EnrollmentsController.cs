using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.DTOs;
using SchoolSwedishAPI.Models;
using System.Security.Claims;

namespace SchoolSwedishAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<EnrollmentsController> _logger;

    public EnrollmentsController(ApplicationDbContext context, ILogger<EnrollmentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/enrollments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EnrollmentDto>>> GetEnrollments()
    {
        var enrollments = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .Select(e => new EnrollmentDto
            {
                Id = e.Id,
                CourseId = e.CourseId,
                StudentId = e.StudentId,
                EnrollmentDate = e.EnrolledAt ?? DateTime.UtcNow,
                Status = e.Status,
                StudentName = e.Student.FirstName + " " + e.Student.LastName,
                CourseTitle = e.Course.Title
            })
            .ToListAsync();

        return Ok(enrollments);
    }

    // GET: api/enrollments/course/5
    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<EnrollmentDto>>> GetEnrollmentsByCourse(int courseId)
    {
        var enrollments = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .Where(e => e.CourseId == courseId)
            .Select(e => new EnrollmentDto
            {
                Id = e.Id,
                CourseId = e.CourseId,
                StudentId = e.StudentId,
                EnrollmentDate = e.EnrolledAt ?? DateTime.UtcNow,
                Status = e.Status,
                StudentName = e.Student.FirstName + " " + e.Student.LastName,
                CourseTitle = e.Course.Title
            })
            .ToListAsync();

        return Ok(enrollments);
    }

    // GET: api/enrollments/student/5
    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<IEnumerable<EnrollmentDto>>> GetEnrollmentsByStudent(int studentId)
    {
        var enrollments = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Course)
            .Where(e => e.StudentId == studentId)
            .Select(e => new EnrollmentDto
            {
                Id = e.Id,
                CourseId = e.CourseId,
                StudentId = e.StudentId,
                EnrollmentDate = e.EnrolledAt ?? DateTime.UtcNow,
                Status = e.Status,
                StudentName = e.Student.FirstName + " " + e.Student.LastName,
                CourseTitle = e.Course.Title
            })
            .ToListAsync();

        return Ok(enrollments);
    }

    // POST: api/enrollments
    [HttpPost]
    public async Task<ActionResult<EnrollmentDto>> CreateEnrollment([FromBody] CreateEnrollmentDto createEnrollmentDto)
    {
        try
        {
            _logger.LogInformation("Начало записи студента {StudentId} на курс {CourseId}",
                createEnrollmentDto.StudentId, createEnrollmentDto.CourseId);

            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == createEnrollmentDto.CourseId);

            if (course == null)
            {
                _logger.LogWarning("Курс {CourseId} не найден", createEnrollmentDto.CourseId);
                return NotFound(new { message = "Курс не найден" });
            }

            var student = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == createEnrollmentDto.StudentId);

            if (student == null)
            {
                _logger.LogWarning("Студент {StudentId} не найден", createEnrollmentDto.StudentId);
                return NotFound(new { message = "Студент не найден" });
            }

            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == createEnrollmentDto.StudentId &&
                                         e.CourseId == createEnrollmentDto.CourseId);

            if (existingEnrollment != null)
            {
                _logger.LogWarning("Студент {StudentId} уже записан на курс {CourseId}",
                    createEnrollmentDto.StudentId, createEnrollmentDto.CourseId);
                return BadRequest(new { message = "Студент уже записан на этот курс" });
            }

            var currentEnrollmentsCount = await _context.Enrollments
                .CountAsync(e => e.CourseId == createEnrollmentDto.CourseId && e.Status == "Active");

            if (course.MaxStudents.HasValue && currentEnrollmentsCount >= course.MaxStudents.Value)
            {
                _logger.LogWarning("На курсе {CourseId} нет свободных мест", createEnrollmentDto.CourseId);
                return BadRequest(new { message = "На курсе нет свободных мест" });
            }

            var enrollment = new Enrollment
            {
                CourseId = createEnrollmentDto.CourseId,
                StudentId = createEnrollmentDto.StudentId,
                EnrolledAt = DateTime.UtcNow,
                Status = "Active",
                Progress = 0,
                Grade = null
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            var result = await _context.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Course)
                .Where(e => e.Id == enrollment.Id)
                .Select(e => new EnrollmentDto
                {
                    Id = e.Id,
                    CourseId = e.CourseId,
                    StudentId = e.StudentId,
                    EnrollmentDate = e.EnrolledAt ?? DateTime.UtcNow,
                    Status = e.Status,
                    StudentName = e.Student.FirstName + " " + e.Student.LastName,
                    CourseTitle = e.Course.Title
                })
                .FirstOrDefaultAsync();

            return Ok(result);
        }
        catch (Exception ex)
        {
            var innerException = ex.InnerException;
            var innerMessage = innerException?.Message ?? "Нет внутренней ошибки";
            _logger.LogError(ex, "Ошибка при записи студента на курс");
            return StatusCode(500, new { message = $"Ошибка при записи на курс: {innerMessage}" });
        }
    }

    // DELETE: api/enrollments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelEnrollment(int id)
    {
        try
        {
            var enrollment = await _context.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (enrollment == null)
            {
                return NotFound(new { message = "Запись на курс не найдена" });
            }

            enrollment.Status = "Dropped";
            await _context.SaveChangesAsync();

            _logger.LogInformation("Запись на курс {EnrollmentId} отменена (Dropped)", id);

            return Ok(new { message = "Запись на курс отменена" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при отмене записи на курс {EnrollmentId}", id);
            return StatusCode(500, new { message = "Ошибка при отмене записи" });
        }
    }

    // Получить всех студентов на курсе (для учителя/админа)
    [HttpGet("course/{courseId}/students")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> GetCourseStudents(int courseId)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Проверяем, что учитель ведёт этот курс
            if (userRole == "Teacher")
            {
                var course = await _context.Courses.FindAsync(courseId);
                if (course == null || course.TeacherId != userId)
                    return Forbid();
            }

            // Получаем ВСЕХ студентов на курсе (не только Active)
            var students = await _context.Enrollments
                .Include(e => e.Student)
                .Where(e => e.CourseId == courseId)  // Убираем фильтр по статусу
                .Select(e => new
                {
                    e.Id,
                    e.StudentId,
                    e.Student.FirstName,
                    e.Student.LastName,
                    e.Student.Email,
                    e.Progress,
                    e.EnrolledAt,
                    e.Status
                })
                .ToListAsync();

            Console.WriteLine($"Найдено студентов на курсе {courseId}: {students.Count}");

            return Ok(students);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка: {ex.Message}");
            return StatusCode(500, new { message = ex.Message });
        }
    }

    // Удалить студента с курса (только для админа) - альтернативный вариант
    [HttpDelete("enrollment/{enrollmentId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RemoveStudentFromCourse(int enrollmentId)
    {
        try
        {
            var enrollment = await _context.Enrollments.FindAsync(enrollmentId);
            if (enrollment == null)
                return NotFound(new { message = "Запись не найдена" });

            // Удаляем связанные платежи вручную
            var payments = await _context.Payments
                .Where(p => p.EnrollmentId == enrollmentId)
                .ToListAsync();

            if (payments.Any())
            {
                _context.Payments.RemoveRange(payments);
                await _context.SaveChangesAsync();
            }

            // Удаляем запись о зачислении
            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Студент удалён с курса" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка удаления: {ex.Message}");
            return StatusCode(500, new { message = ex.Message });
        }
    }
}