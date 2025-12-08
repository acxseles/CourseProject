using System.ComponentModel.DataAnnotations;

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
        public int TeacherId { get; set; }
        public string TeacherName { get; set; } = string.Empty;
    }

    public class UpdateCourseDto
    {
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Название должно содержать от 3 до 200 символов")]
        public string? Title { get; set; }

        [StringLength(1000, ErrorMessage = "Описание не должно превышать 1000 символов")]
        public string? Description { get; set; }

        [StringLength(50, ErrorMessage = "Уровень не должен превышать 50 символов")]
        public string? Level { get; set; }

        [Range(0, 1000000, ErrorMessage = "Цена должна быть в диапазоне от 0 до 1 000 000")]
        public decimal? Price { get; set; }

        [Range(1, 500, ErrorMessage = "Длительность должна быть от 1 до 500 часов")]
        public int? DurationHours { get; set; }

        [Range(1, 100, ErrorMessage = "Максимальное количество студентов должно быть от 1 до 100")]
        public int? MaxStudents { get; set; }

        public bool? IsActive { get; set; }

        // Только для админа - смена преподавателя
        public int? TeacherId { get; set; }
    }
}