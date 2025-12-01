using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.Services;
using ClosedXML.Excel;
using SchoolSwedishAPI.Models;
using Microsoft.AspNetCore.Authorization;  // ������ ��� ������
using System.Security.Claims;  // ������ ��� ������

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

    // PDF ������� ������ ����� - �������� ����
    [HttpGet("export/course/{id}/pdf")]
    public async Task<IActionResult> ExportCoursePdf(int id)
    {
        try
        {
            _logger.LogInformation("������ �������� ����� {CourseId} � PDF", id);

            var course = await _context.Courses
                .Include(c => c.Teacher)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
            {
                _logger.LogWarning("���� {CourseId} �� ������", id);
                return NotFound(new { message = "���� �� ������" });
            }

            _logger.LogInformation("���� ������: {Title}, �������������: {Teacher}",
                course.Title, course.Teacher?.Email);

            var pdfBytes = _pdfService.GenerateCoursePdf(course);

            _logger.LogInformation("PDF ������� ������, ������: {Size} ����", pdfBytes.Length);

            return File(pdfBytes, "application/pdf",
                $"course_{course.Title}_{DateTime.Now:yyyyMMdd}.pdf");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "������ ��� �������� ����� {CourseId} � PDF. �����������: {Message}",
                id, ex.Message);
            return StatusCode(500, new { message = $"������ ��� �������� PDF: {ex.Message}" });
        }
    }

    // PDF ������� ���� ������ (�������) - �������� ����
    [HttpGet("export/courses/pdf")]
    public async Task<IActionResult> ExportAllCoursesPdf()
    {
        try
        {
            _logger.LogInformation("������ �������� ���� ������ � PDF");

            var courses = await _context.Courses
                .Include(c => c.Teacher)
                .OrderBy(c => c.Title)
                .ToListAsync();

            _logger.LogInformation("������� {Count} ������ ��� ��������", courses.Count);

            var pdfBytes = _pdfService.GenerateCoursesListPdf(courses);

            _logger.LogInformation("PDF ������� ������� ������, ������: {Size} ����", pdfBytes.Length);

            return File(pdfBytes, "application/pdf",
                $"courses_catalog_{DateTime.Now:yyyyMMdd}.pdf");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "������ ��� �������� ������ � PDF. �����������: {Message}",
                ex.Message);
            return StatusCode(500, new { message = $"������ ��� �������� PDF: {ex.Message}" });
        }
    }

    // ������ ������ �� Excel - ������ ��� ������ � �������������
    [HttpPost("import/courses/excel")]
    [Authorize(Roles = "Admin,Teacher")]  // ������ ��� ������
    public async Task<ActionResult> ImportCoursesFromExcel(IFormFile file)
    {
        try
        {
            // �������� ID �������� ������������
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdClaim))
            {
                return Unauthorized(new { message = "�� ������� ���������� ������������" });
            }
            var currentUserId = int.Parse(currentUserIdClaim);

            _logger.LogInformation("������ ������� ������ �� Excel ������������� {UserId}", currentUserId);

            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("���� �� ������ ��� ������");
                return BadRequest(new { message = "���� �� ������" });
            }

            // ��������� ���������� �����
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (extension != ".xlsx" && extension != ".xls")
            {
                _logger.LogWarning("���������������� ������ �����: {Extension}", extension);
                return BadRequest(new { message = "�������������� ������ ����� Excel (.xlsx, .xls)" });
            }

            _logger.LogInformation("��������� �����: {FileName}, ������: {Size} ����",
                file.FileName, file.Length);

            var importedCourses = new List<Course>();
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1);
            var rows = worksheet.RangeUsed().RowsUsed().Skip(1); // ���������� ���������

            int rowNumber = 2; // �������� � ������ ������ (����� ���������)
            foreach (var row in rows)
            {
                try
                {
                    var title = row.Cell(1).GetValue<string>()?.Trim();
                    var description = row.Cell(2).GetValue<string>()?.Trim();

                    // ����: ��������� � ����������� ���� Level
                    var levelValue = row.Cell(3).GetValue<string>()?.Trim();
                    var level = "A1"; // �������� �� ���������
                    if (!string.IsNullOrEmpty(levelValue))
                    {
                        level = levelValue.Length > 10 ? levelValue.Substring(0, 10) : levelValue;
                        level = level.ToUpper();
                    }

                    var price = row.Cell(4).GetValue<decimal>();
                    var durationHours = row.Cell(5).GetValue<int>();
                    var maxStudents = row.Cell(6).GetValue<int?>();
                    var teacherEmail = row.Cell(7).GetValue<string>()?.Trim();

                    // ��������� ������������ �����
                    if (string.IsNullOrEmpty(title))
                    {
                        _logger.LogWarning("������� ������ {RowNumber}: ����������� �������� �����", rowNumber);
                        rowNumber++;
                        continue;
                    }

                    if (string.IsNullOrEmpty(teacherEmail))
                    {
                        _logger.LogWarning("������� ������ {RowNumber}: ����������� email �������������", rowNumber);
                        rowNumber++;
                        continue;
                    }

                    // ���� �������������
                    var teacher = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email == teacherEmail);

                    if (teacher == null)
                    {
                        _logger.LogWarning("������� ������ {RowNumber}: ������������� � email {Email} �� ������",
                            rowNumber, teacherEmail);
                        rowNumber++;
                        continue;
                    }

                    // ���������, ��� �� ��� ����� � ����� ���������
                    var existingCourse = await _context.Courses
                        .FirstOrDefaultAsync(c => c.Title == title);

                    if (existingCourse != null)
                    {
                        _logger.LogWarning("������� ������ {RowNumber}: ���� � ��������� '{Title}' ��� ����������",
                            rowNumber, title);
                        rowNumber++;
                        continue;
                    }

                    // ������� ����� ����
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
                    _logger.LogInformation("������ {RowNumber}: ���� '{Title}' ����������� � �������",
                        rowNumber, title);

                    rowNumber++;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "������ ��� ��������� ������ {RowNumber}", rowNumber);
                    rowNumber++;
                }
            }

            if (importedCourses.Any())
            {
                await _context.Courses.AddRangeAsync(importedCourses);
                await _context.SaveChangesAsync();

                _logger.LogInformation("������� ������������� {Count} ������ ������������� {UserId}",
                    importedCourses.Count, currentUserId);

                return Ok(new
                {
                    message = $"������� ������������� {importedCourses.Count} ������",
                    importedCount = importedCourses.Count,
                    courses = importedCourses.Select(c => new { c.Id, c.Title, c.Level }).ToList()
                });
            }
            else
            {
                _logger.LogWarning("�� ������������� �� ������ �����");
                return Ok(new { message = "�� ������������� �� ������ �����" });
            }
        }
        catch (Exception ex)
        {
            var innerMessage = ex.InnerException?.Message ?? "��� ���������� ������";
            _logger.LogError(ex, "������ ��� ������� ������ �� Excel. ���������� ������: {InnerError}", innerMessage);
            return StatusCode(500, new { message = $"������ ��� �������: {innerMessage}" });
        }
    }
}