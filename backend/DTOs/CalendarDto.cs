using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.DTOs
{
    // Особый курс (разговорный шведский и т.д.)
    public class SpecialCourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int MaxParticipants { get; set; }
        public int DurationMinutes { get; set; }
        public decimal? Price { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? CreatedAt { get; set; }
    }

    public class CreateSpecialCourseDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int MaxParticipants { get; set; } = 5;
        public int DurationMinutes { get; set; } = 60;
        public decimal? Price { get; set; }
    }

    // Сессия в календаре
    public class CalendarSessionDto
    {
        public int Id { get; set; }
        public int SpecialCourseId { get; set; }
        public int TeacherId { get; set; }
        public string TeacherName { get; set; } = null!;
        public DateTime SessionDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int AvailableSlots { get; set; }
        public bool? IsBooked { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class CreateSessionDto
    {
        public required int TeacherId { get; set; }
        public required DateTime SessionDate { get; set; }
        public required TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int AvailableSlots { get; set; } = 5;
    }

    // Бронирование сессии
    public class SessionBookingDto
    {
        public int Id { get; set; }
        public int SessionId { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public DateTime? BookedAt { get; set; }
        public string Status { get; set; } = null!;
        public string? Notes { get; set; }
    }

    public class CreateBookingDto
    {
        public string? Notes { get; set; }
    }

    // Для календаря на месяц
    public class CalendarMonthDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public List<CalendarDayDto> Days { get; set; } = new();
    }

    public class CalendarDayDto
    {
        public DateTime Date { get; set; }
        public List<SessionShortDto> Sessions { get; set; } = new();
        public bool HasAvailableSlots { get; set; }
    }

    public class SessionShortDto
    {
        public int Id { get; set; }
        public string CourseTitle { get; set; } = null!;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int AvailableSlots { get; set; }
        public string TeacherName { get; set; } = null!;
    }

    public class BookWithTeacherDto
    {
        public required int TeacherId { get; set; }
        public required DateTime SessionDate { get; set; }
        public required TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string? Notes { get; set; }
    }

    public class TeacherDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Bio { get; set; }
        public double? Rating { get; set; }
        public int AvailableSessions { get; set; }
        public List<TeacherScheduleDto> Schedule { get; set; } = new();
    }

    public class TeacherScheduleDto
    {
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int AvailableSlots { get; set; }
    }
}