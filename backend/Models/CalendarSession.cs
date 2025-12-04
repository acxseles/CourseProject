using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class CalendarSession
{
    public int Id { get; set; }

    public int SpecialCourseId { get; set; }

    public int TeacherId { get; set; }

    public DateTime SessionDate { get; set; }     // ← DateTime
    public TimeSpan StartTime { get; set; }       // ← TimeSpan
    public TimeSpan EndTime { get; set; }

    public int AvailableSlots { get; set; }

    public bool? IsBooked { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<SessionBooking> SessionBookings { get; set; } = new List<SessionBooking>();

    public virtual SpecialCourse SpecialCourse { get; set; } = null!;

    public virtual User Teacher { get; set; } = null!;
}
