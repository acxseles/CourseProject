using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class SessionBooking
{
    public int Id { get; set; }

    public int SessionId { get; set; }

    public int StudentId { get; set; }

    public DateTime? BookedAt { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public virtual CalendarSession Session { get; set; } = null!;

    public virtual User Student { get; set; } = null!;
}
