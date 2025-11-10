using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class Assignment
{
    public int Id { get; set; }

    public int LessonId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int? MaxScore { get; set; }

    public DateTime? Deadline { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Lesson Lesson { get; set; } = null!;

    public virtual ICollection<Studentassignment> Studentassignments { get; set; } = new List<Studentassignment>();
}
