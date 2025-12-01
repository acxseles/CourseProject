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
[Route("api/import-export")]
public class ImportExportController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ImportExportController> _logger;
    private readonly PdfExportService _pdfService;

    public ImportExportController(ApplicationDbContext context, ILogger<ImportExportController> logger, PdfExportService pdfService)
    {
        _context = context;
        _logger = logger;
        _pdfService = pdfService;
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("ImportExport controller is working!");
    }

    [HttpGet("export-all-pdf")]
    public IActionResult ExportAllPdfSimple()
    {
        return Ok(new { message = "Simple PDF export works" });
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
        _logger.LogInformation("ExportAllCoursesPdf method called!");
        try
        {
            _logger.LogInformation("Starting to fetch courses for PDF export");

            var courses = await _context.Courses
                .Include(c => c.Teacher)
                .OrderBy(c => c.Title)
                .ToListAsync();

            _logger.LogInformation("Fetched {Count} courses", courses.Count);

            var pdfBytes = _pdfService.GenerateCoursesListPdf(courses);

            _logger.LogInformation("PDF generated successfully, size: {Size} bytes", pdfBytes.Length);

            return File(pdfBytes, "application/pdf",
                $"courses_catalog_{DateTime.Now:yyyyMMdd}.pdf");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting courses to PDF. Message: {Message}",
                ex.Message);
            return StatusCode(500, new { message = $"Error generating PDF: {ex.Message}" });
        }
    }

    // Import courses from Excel - Admin only
    [HttpPost("import/courses/excel")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> ImportCoursesFromExcel(IFormFile file)
    {
        _logger.LogInformation("========== ImportCoursesFromExcel called ==========");
        _logger.LogInformation("File object: {File}, IsNull: {IsNull}", file?.FileName ?? "null", file == null);
        try
        {
            // Get current user ID from JWT token
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _logger.LogInformation("Current user claim: {Claim}", currentUserIdClaim ?? "null");
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
            if (worksheet == null)
            {
                _logger.LogWarning("Worksheet 1 not found in Excel file");
                return BadRequest(new { message = "Worksheet not found in Excel file" });
            }

            var rangeUsed = worksheet.RangeUsed();
            if (rangeUsed == null)
            {
                _logger.LogInformation("No data found in worksheet");
                return Ok(new { message = "No data found in worksheet", importedCount = 0, courses = new List<object>() });
            }

            var rows = rangeUsed.RowsUsed().Skip(1); // ���������� ���������

            int rowNumber = 2; // Starting from row 2 (after header)
            _logger.LogInformation("Total rows to process: {RowCount}", rows.Count());
            foreach (var row in rows)
            {
                try
                {
                    var title = row.Cell(1).GetValue<string>()?.Trim();
                    var description = row.Cell(2).GetValue<string>()?.Trim();
                    _logger.LogInformation("Row {RowNumber}: title='{Title}', description='{Description}'", rowNumber, title, description);

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

                    // MaxStudents is optional - handle conversion carefully
                    int? maxStudents = null;
                    try
                    {
                        var maxStudentsCell = row.Cell(6);
                        var strValue = maxStudentsCell.GetValue<string>()?.Trim();
                        if (!string.IsNullOrEmpty(strValue) && int.TryParse(strValue, out int parsedValue))
                        {
                            maxStudents = parsedValue;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning("Could not parse maxStudents in row {RowNumber}: {Error}", rowNumber, ex.Message);
                    }

                    var teacherEmail = row.Cell(7).GetValue<string>()?.Trim();

                    _logger.LogInformation("Row {RowNumber} values: level='{Level}', price={Price}, durationHours={Duration}, maxStudents={MaxStudents}, teacherEmail='{TeacherEmail}'",
                        rowNumber, levelValue, price, durationHours, maxStudents, teacherEmail);

                    // Validate required fields
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