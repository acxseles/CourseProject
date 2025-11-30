using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.DTOs;
using SchoolSwedishAPI.Models;

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
                EnrollmentDate = e.EnrolledAt ?? DateTime.UtcNow, // ИСПРАВЛЕНО
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
                EnrollmentDate = e.EnrolledAt ?? DateTime.UtcNow, // ИСПРАВЛЕНО
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
                EnrollmentDate = e.EnrolledAt ?? DateTime.UtcNow, // ИСПРАВЛЕНО
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

            // Проверяем существует ли курс
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == createEnrollmentDto.CourseId);

            if (course == null)
            {
                _logger.LogWarning("Курс {CourseId} не найден", createEnrollmentDto.CourseId);
                return NotFound(new { message = "Курс не найден" });
            }
            _logger.LogInformation("Курс найден: {Title}", course.Title);

            // Проверяем существует ли студент
            var student = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == createEnrollmentDto.StudentId);

            if (student == null)
            {
                _logger.LogWarning("Студент {StudentId} не найден", createEnrollmentDto.StudentId);
                return NotFound(new { message = "Студент не найден" });
            }
            _logger.LogInformation("Студент найден: {Name}", student.FirstName + " " + student.LastName);

            // Проверяем не записан ли уже студент на этот курс
            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == createEnrollmentDto.StudentId &&
                                         e.CourseId == createEnrollmentDto.CourseId);

            if (existingEnrollment != null)
            {
                _logger.LogWarning("Студент {StudentId} уже записан на курс {CourseId}",
                    createEnrollmentDto.StudentId, createEnrollmentDto.CourseId);
                return BadRequest(new { message = "Студент уже записан на этот курс" });
            }

            // Проверяем есть ли свободные места на курсе
            var currentEnrollmentsCount = await _context.Enrollments
                .CountAsync(e => e.CourseId == createEnrollmentDto.CourseId && e.Status == "Active"); // Только активные

            _logger.LogInformation("Текущее количество записей на курс: {Count}, максимум: {Max}",
                currentEnrollmentsCount, course.MaxStudents);

            if (course.MaxStudents.HasValue && currentEnrollmentsCount >= course.MaxStudents.Value)
            {
                _logger.LogWarning("На курсе {CourseId} нет свободных мест", createEnrollmentDto.CourseId);
                return BadRequest(new { message = "На курсе нет свободных мест" });
            }

            // Создаем запись на курс
            var enrollment = new Enrollment
            {
                CourseId = createEnrollmentDto.CourseId,
                StudentId = createEnrollmentDto.StudentId,
                EnrolledAt = DateTime.UtcNow,
                Status = "Active",
                Progress = 0,
                Grade = null
            };

            _logger.LogInformation("Создана новая запись: CourseId={CourseId}, StudentId={StudentId}",
                enrollment.CourseId, enrollment.StudentId);

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Студент {StudentId} успешно записан на курс {CourseId}. ID записи: {EnrollmentId}",
                createEnrollmentDto.StudentId, createEnrollmentDto.CourseId, enrollment.Id);

            // Возвращаем созданную запись с дополнительной информацией
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
            var fullError = $"Внешняя: {ex.Message}, Внутренняя: {innerMessage}";

            _logger.LogError(ex, "Ошибка при записи студента на курс. Полная ошибка: {FullError}", fullError);
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

            // Меняем статус на Dropped вместо удаления
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
}
  
     