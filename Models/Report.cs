using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class Report
{
    public int Id { get; set; }

    public int TeacherId { get; set; }

    public string Title { get; set; } = null!;

    public string ReportType { get; set; } = null!;

    public DateTime? GeneratedAt { get; set; }

    public string? Data { get; set; }

    public virtual User Teacher { get; set; } = null!;
}
