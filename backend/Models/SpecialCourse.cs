using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class SpecialCourse
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int MaxParticipants { get; set; }

    public int DurationMinutes { get; set; }

    public decimal? Price { get; set; }

    public bool IsActive { get; set; } = true;    // ← bool, не bool?

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<CalendarSession> CalendarSessions { get; set; } = new List<CalendarSession>();
}
