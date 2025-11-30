using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.Services;
using ClosedXML.Excel;
using SchoolSwedishAPI.Models;
using Microsoft.AspNetCore.Authorization;  // ДОБАВЬ ЭТУ СТРОКУ
using System.Security.Claims;  // ДОБАВЬ ЭТУ СТРОКУ

namespace SchoolSwedishAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportExportController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ImportExportController> _logger;
    private readonly PdfExportService _pdfService;

    public ImportExportController(ApplicationDbContext context, ILogger<ImportExportController> logger)
    {
        _context = context;
        _logger = logger;
        _pdfService = new PdfExportService();
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("ImportExport controller is working!");
    }

    // PDF экспорт одного курса - доступен всем
    [HttpGet("export/course/{id}/pdf")]
    public async Task<IActionResult> ExportCoursePdf(int id)
    {
        try
        {
            _logger.LogInformation("Начало экспорта курса {CourseId} в PDF", id);

            var course = await _context.Courses
                .Include(c => c.Teacher)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
            {
                _logger.LogWarning("Курс {CourseId} не найден", id);
                return NotFound(new { message = "Курс не найден" });
            }

            _logger.LogInformation("Курс найден: {Title}, преподаватель: {Teacher}",
                course.Title, course.Teacher?.Email);

            var pdfBytes = _pdfService.GenerateCoursePdf(course);

            _logger.LogInformation("PDF успешно создан, размер: {Size} байт", pdfBytes.Length);

            return File(pdfBytes, "application/pdf",
                $"course_{course.Title}_{DateTime.Now:yyyyMMdd}.pdf");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при экспорте курса {CourseId} в PDF. Подробности: {Message}",
                id, ex.Message);
            return StatusCode(500, new { message = $"Ошибка при создании PDF: {ex.Message}" });
        }
    }

    // PDF экспорт всех курсов (каталог) - доступен всем
    [HttpGet("export/courses/pdf")]
    public async Task<IActionResult> ExportAllCoursesPdf()
    {
        try
        {
            _logger.LogInformation("Начало экспорта всех курсов в PDF");

            var courses = await _context.Courses
                .Include(c => c.Teacher)
                .OrderBy(c => c.Title)
                .ToListAsync();

            _logger.LogInformation("Найдено {Count} курсов для экспорта", courses.Count);

            var pdfBytes = _pdfService.GenerateCoursesListPdf(courses);

            _logger.LogInformation("PDF каталог успешно создан, размер: {Size} байт", pdfBytes.Length);

            return File(pdfBytes, "application/pdf",
                $"courses_catalog_{DateTime.Now:yyyyMMdd}.pdf");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при экспорте курсов в PDF. Подробности: {Message}",
                ex.Message);
            return StatusCode(500, new { message = $"Ошибка при создании PDF: {ex.Message}" });
        }
    }

    // ИМПОРТ курсов из Excel - ТОЛЬКО ДЛЯ АДМИНА И ПРЕПОДАВАТЕЛЯ
    [HttpPost("import/courses/excel")]
    [Authorize(Roles = "Admin,Teacher")]  // ДОБАВЬ ЭТУ СТРОКУ
    public async Task<ActionResult> ImportCoursesFromExcel(IFormFile file)
    {
        try
        {
            // ПОЛУЧАЕМ ID ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdClaim))
            {
                return Unauthorized(new { message = "Не удалось определить пользователя" });
            }
            var currentUserId = int.Parse(currentUserIdClaim);

            _logger.LogInformation("Начало импорта курсов из Excel пользователем {UserId}", currentUserId);

            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("Файл не выбран или пустой");
                return BadRequest(new { message = "Файл не выбран" });
            }

            // Проверяем расширение файла
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (extension != ".xlsx" && extension != ".xls")
            {
                _logger.LogWarning("Неподдерживаемый формат файла: {Extension}", extension);
                return BadRequest(new { message = "Поддерживаются только файлы Excel (.xlsx, .xls)" });
            }

            _logger.LogInformation("Обработка файла: {FileName}, размер: {Size} байт",
                file.FileName, file.Length);

            var importedCourses = new List<Course>();
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1);
            var rows = worksheet.RangeUsed().RowsUsed().Skip(1); // Пропускаем заголовок

            int rowNumber = 2; // Начинаем с второй строки (после заголовка)
            foreach (var row in rows)
            {
                try
                {
                    var title = row.Cell(1).GetValue<string>()?.Trim();
                    var description = row.Cell(2).GetValue<string>()?.Trim();

                    // ФИКС: Валидация и ограничение поля Level
                    var levelValue = row.Cell(3).GetValue<string>()?.Trim();
                    var level = "A1"; // значение по умолчанию
                    if (!string.IsNullOrEmpty(levelValue))
                    {
                        level = levelValue.Length > 10 ? levelValue.Substring(0, 10) : levelValue;
                        level = level.ToUpper();
                    }

                    var price = row.Cell(4).GetValue<decimal>();
                    var durationHours = row.Cell(5).GetValue<int>();
                    var maxStudents = row.Cell(6).GetValue<int?>();
                    var teacherEmail = row.Cell(7).GetValue<string>()?.Trim();

                    // Валидация обязательных полей
                    if (string.IsNullOrEmpty(title))
                    {
                        _logger.LogWarning("Пропуск строки {RowNumber}: отсутствует название курса", rowNumber);
                        rowNumber++;
                        continue;
                    }

                    if (string.IsNullOrEmpty(teacherEmail))
                    {
                        _logger.LogWarning("Пропуск строки {RowNumber}: отсутствует email преподавателя", rowNumber);
                        rowNumber++;
                        continue;
                    }

                    // Ищем преподавателя
                    var teacher = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email == teacherEmail);

                    if (teacher == null)
                    {
                        _logger.LogWarning("Пропуск строки {RowNumber}: преподаватель с email {Email} не найден",
                            rowNumber, teacherEmail);
                        rowNumber++;
                        continue;
                    }

                    // Проверяем, нет ли уже курса с таким названием
                    var existingCourse = await _context.Courses
                        .FirstOrDefaultAsync(c => c.Title == title);

                    if (existingCourse != null)
                    {
                        _logger.LogWarning("Пропуск строки {RowNumber}: курс с названием '{Title}' уже существует",
                            rowNumber, title);
                        rowNumber++;
                        continue;
                    }

                    // Создаем новый курс
                    var course = new Course
                    {
                        Title = title,
                        Description = description,
                        Level = level,
                        Price = price,
                        DurationHours = durationHours,
                        MaxStudents = maxStudents,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        TeacherId = teacher.Id
                    };

                    importedCourses.Add(course);
                    _logger.LogInformation("Строка {RowNumber}: курс '{Title}' подготовлен к импорту",
                        rowNumber, title);

                    rowNumber++;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при обработке строки {RowNumber}", rowNumber);
                    rowNumber++;
                }
            }

            if (importedCourses.Any())
            {
                await _context.Courses.AddRangeAsync(importedCourses);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Успешно импортировано {Count} курсов пользователем {UserId}",
                    importedCourses.Count, currentUserId);

                return Ok(new
                {
                    message = $"Успешно импортировано {importedCourses.Count} курсов",
                    importedCount = importedCourses.Count,
                    courses = importedCourses.Select(c => new { c.Id, c.Title, c.Level }).ToList()
                });
            }
            else
            {
                _logger.LogWarning("Не импортировано ни одного курса");
                return Ok(new { message = "Не импортировано ни одного курса" });
            }
        }
        catch (Exception ex)
        {
            var innerMessage = ex.InnerException?.Message ?? "Нет внутренней ошибки";
            _logger.LogError(ex, "Ошибка при импорте курсов из Excel. Внутренняя ошибка: {InnerError}", innerMessage);
            return StatusCode(500, new { message = $"Ошибка при импорте: {innerMessage}" });
        }
    }
}