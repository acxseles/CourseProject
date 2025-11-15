namespace SchoolSwedishAPI.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public int DurationHours { get; set; }
        public string TeacherName { get; set; } = string.Empty;
    }
}