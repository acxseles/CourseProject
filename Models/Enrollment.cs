using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class Enrollment
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public int CourseId { get; set; }

    public DateTime? EnrolledAt { get; set; }

    public decimal? Progress { get; set; }

    public decimal? Grade { get; set; }

    public string? Status { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual User Student { get; set; } = null!;
}
