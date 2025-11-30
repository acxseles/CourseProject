namespace SchoolSwedishAPI.DTOs;

public class CourseImportDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Level { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DurationHours { get; set; }
    public int? MaxStudents { get; set; }
    public string TeacherEmail { get; set; } = string.Empty;
}