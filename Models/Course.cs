using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class Course
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string Level { get; set; } = null!;

    public decimal? Price { get; set; }

    public int DurationHours { get; set; }

    public int? MaxStudents { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int TeacherId { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    public virtual User Teacher { get; set; } = null!;
}
