using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class Studentassignment
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public int AssignmentId { get; set; }

    public decimal? Score { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public string? FileUrl { get; set; }

    public string? Feedback { get; set; }

    public virtual Assignment Assignment { get; set; } = null!;

    public virtual User Student { get; set; } = null!;
}
