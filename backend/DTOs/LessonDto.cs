namespace SchoolSwedishAPI.DTOs
{
    public class LessonDto
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; } = null!;
        public string? Content { get; set; } 
        public int OrderIndex { get; set; }
        public DateTime? CreatedAt { get; set; }
        
    }

    public class CreateLessonDto
    {
        public string Title { get; set; } = null!;
        public string? Content { get; set; } 
        public int OrderIndex { get; set; }
       
    }
}