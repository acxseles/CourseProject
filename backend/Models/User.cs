using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Role { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<CalendarSession> CalendarSessions { get; set; } = new List<CalendarSession>();

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual ICollection<SessionBooking> SessionBookings { get; set; } = new List<SessionBooking>();

    public virtual ICollection<Studentassignment> Studentassignments { get; set; } = new List<Studentassignment>();
}
