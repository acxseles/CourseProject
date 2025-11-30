namespace SchoolSwedishAPI.DTOs;

public class CreateEnrollmentDto
{
    public int CourseId { get; set; }
    public int StudentId { get; set; }
}

public class EnrollmentDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public int StudentId { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public string? Status { get; set; }
    public string? StudentName { get; set; }
    public string? CourseTitle { get; set; }
}