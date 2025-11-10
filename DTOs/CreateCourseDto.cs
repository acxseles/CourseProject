namespace SchoolSwedishAPI.DTOs
{
    public class CreateCourseDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public int DurationHours { get; set; }
    }
}