using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolSwedishAPI.Models
{
    [Table("LessonProgress")]
    public class LessonProgress
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int LessonId { get; set; }

        public bool IsCompleted { get; set; }

        public int? TestScore { get; set; }  // ← добавить
        public int TestAttempts { get; set; }  // ← добавить
        public DateTime? CompletedAt { get; set; }
        public DateTime? TestCompletedAt { get; set; }  // ← добавить

        [ForeignKey("StudentId")]
        public virtual User Student { get; set; }

        [ForeignKey("LessonId")]
        public virtual Lesson Lesson { get; set; }
    }
}