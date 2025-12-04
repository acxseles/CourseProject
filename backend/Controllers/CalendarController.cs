using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.DTOs;
using SchoolSwedishAPI.Models;
using Serilog;

namespace SchoolSwedishAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CalendarController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CalendarController> _logger;

        public CalendarController(ApplicationDbContext context, ILogger<CalendarController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Получить все особые курсы
        [HttpGet("special-courses")]
        [AllowAnonymous]
        public async Task<ActionResult<List<SpecialCourseDto>>> GetSpecialCourses()
        {
            try
            {
                var courses = await _context.SpecialCourses
                    .Where(sc => sc.IsActive)
                    .Select(sc => new SpecialCourseDto
                    {
                        Id = sc.Id,
                        Title = sc.Title,
                        Description = sc.Description,
                        MaxParticipants = sc.MaxParticipants,
                        DurationMinutes = sc.DurationMinutes,
                        Price = sc.Price,
                        IsActive = sc.IsActive,
                        CreatedAt = sc.CreatedAt
                    })
                    .ToListAsync();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при получении особых курсов");
                return StatusCode(500, new { message = "Ошибка при получении курсов" });
            }
        }

        // Получить преподавателей особого курса
        [HttpGet("special-courses/{courseId}/teachers")]
        [AllowAnonymous]
        public async Task<ActionResult> GetCourseTeachers(int courseId)
        {
            try
            {
                // Проверяем что курс существует
                var course = await _context.SpecialCourses.FindAsync(courseId);
                if (course == null)
                {
                    return NotFound(new { message = "Курс не найден" });
                }

                var teachers = await _context.Users
                    .Where(u => u.Role == "Teacher" && (u.IsActive == null || u.IsActive == true))
                    .Select(u => new
                    {
                        Id = u.Id,
                        Name = $"{u.FirstName} {u.LastName}",
                        Email = u.Email,
                        Bio = "Опытный преподаватель шведского языка",
                        Rating = 4.5,
                        AvailableSessions = _context.CalendarSessions
                            .Count(s => s.TeacherId == u.Id &&
                                        s.SpecialCourseId == courseId &&
                                        (s.IsBooked == null || s.IsBooked == false) &&
                                        s.SessionDate >= DateTime.Today)
                    })
                    .OrderByDescending(t => t.AvailableSessions)
                    .ToListAsync();

                return Ok(teachers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при получении преподавателей курса {CourseId}", courseId);
                return StatusCode(500, new { message = "Ошибка при получении преподавателей" });
            }
        }

        // Получить расписание преподавателя
        [HttpGet("teachers/{teacherId}/schedule")]
        [AllowAnonymous]
        public async Task<ActionResult> GetTeacherSchedule(int teacherId, [FromQuery] DateTime? date = null)
        {
            try
            {
                var teacher = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == teacherId && u.Role == "Teacher");

                if (teacher == null)
                {
                    return NotFound(new { message = "Преподаватель не найден" });
                }

                var targetDate = date ?? DateTime.Today;
                var startDate = targetDate.AddDays(-7);
                var endDate = targetDate.AddDays(30);

                var sessions = await _context.CalendarSessions
                    .Include(s => s.SpecialCourse)
                    .Where(s => s.TeacherId == teacherId &&
                                s.SessionDate >= startDate &&
                                s.SessionDate <= endDate &&
                                (s.IsBooked == null || s.IsBooked == false))
                    .OrderBy(s => s.SessionDate)
                    .ThenBy(s => s.StartTime)
                    .Select(s => new
                    {
                        s.Id,
                        CourseTitle = s.SpecialCourse.Title,
                        s.SessionDate,
                        s.StartTime,
                        s.EndTime,
                        s.AvailableSlots,
                        Duration = (s.EndTime - s.StartTime).TotalMinutes
                    })
                    .ToListAsync();

                return Ok(new
                {
                    TeacherId = teacherId,
                    TeacherName = $"{teacher.FirstName} {teacher.LastName}",
                    Schedule = sessions
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при получении расписания преподавателя {TeacherId}", teacherId);
                return StatusCode(500, new { message = "Ошибка при получении расписания" });
            }
        }

        // Записаться на курс с выбором преподавателя (Student)
        [HttpPost("special-courses/{courseId}/book-with-teacher")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult> BookWithTeacher(int courseId, [FromBody] BookWithTeacherDto bookDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int studentId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                // 1. Проверяем существование курса
                var course = await _context.SpecialCourses.FindAsync(courseId);
                if (course == null || !course.IsActive)
                {
                    return NotFound(new { message = "Курс не найден или не активен" });
                }

                // 2. Проверяем что преподаватель существует
                var teacher = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == bookDto.TeacherId && u.Role == "Teacher");

                if (teacher == null)
                {
                    return BadRequest(new { message = "Преподаватель не найден" });
                }

                // 3. Проверяем доступность времени у преподавателя
                var conflictingSession = await _context.CalendarSessions
                    .AnyAsync(s =>
                        s.TeacherId == bookDto.TeacherId &&
                        s.SessionDate.Date == bookDto.SessionDate.Date &&
                        ((s.StartTime <= bookDto.StartTime && s.EndTime > bookDto.StartTime) ||
                         (s.StartTime < bookDto.EndTime && s.EndTime >= bookDto.EndTime) ||
                         (bookDto.StartTime <= s.StartTime && bookDto.EndTime > s.StartTime)));

                if (conflictingSession)
                {
                    return BadRequest(new { message = "У преподавателя уже есть занятие в это время" });
                }

                // 4. Ищем существующую сессию в это время
                var existingSession = await _context.CalendarSessions
                    .FirstOrDefaultAsync(s =>
                        s.SpecialCourseId == courseId &&
                        s.TeacherId == bookDto.TeacherId &&
                        s.SessionDate.Date == bookDto.SessionDate.Date &&
                        s.StartTime == bookDto.StartTime);

                CalendarSession session;

                if (existingSession != null)
                {
                    // Используем существующую сессию
                    session = existingSession;
                    if (session.AvailableSlots <= 0)
                    {
                        return BadRequest(new { message = "Нет свободных мест на этой сессии" });
                    }
                }
                else
                {
                    // Создаем новую сессию
                    var endTime = bookDto.EndTime == TimeSpan.Zero
                        ? bookDto.StartTime.Add(TimeSpan.FromMinutes(course.DurationMinutes))
                        : bookDto.EndTime;

                    session = new CalendarSession
                    {
                        SpecialCourseId = courseId,
                        TeacherId = bookDto.TeacherId,
                        SessionDate = bookDto.SessionDate.Date,
                        StartTime = bookDto.StartTime,
                        EndTime = endTime,
                        AvailableSlots = course.MaxParticipants - 1, // -1 для текущего студента
                        IsBooked = false,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.CalendarSessions.Add(session);
                    await _context.SaveChangesAsync();
                }

                // 5. Проверяем не записан ли уже студент
                var existingBooking = await _context.SessionBookings
                    .FirstOrDefaultAsync(b => b.SessionId == session.Id && b.StudentId == studentId);

                if (existingBooking != null)
                {
                    return BadRequest(new { message = "Вы уже записаны на эту сессию" });
                }

                // 6. Создаем бронирование
                var booking = new SessionBooking
                {
                    SessionId = session.Id,
                    StudentId = studentId,
                    BookedAt = DateTime.UtcNow,
                    Status = "Booked",
                    Notes = bookDto.Notes
                };

                session.AvailableSlots--;
                if (session.AvailableSlots <= 0)
                {
                    session.IsBooked = true;
                }

                _context.SessionBookings.Add(booking);
                await _context.SaveChangesAsync();

                _logger.LogInformation("✅ Студент {StudentId} записался к преподавателю {TeacherId} на курс {CourseId}",
                    studentId, bookDto.TeacherId, courseId);

                return Ok(new
                {
                    message = "Запись на курс успешна",
                    sessionId = session.Id,
                    bookingId = booking.Id,
                    teacherName = $"{teacher.FirstName} {teacher.LastName}",
                    sessionDate = session.SessionDate,
                    startTime = session.StartTime,
                    endTime = session.EndTime,
                    availableSlots = session.AvailableSlots
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при записи к преподавателю курса {CourseId}", courseId);
                return StatusCode(500, new { message = "Ошибка при записи на курс" });
            }
        }

        // Получить сессии на месяц
        [HttpGet("month/{year}/{month}")]
        public async Task<ActionResult<CalendarMonthDto>> GetMonthSessions(int year, int month)
        {
            try
            {
                var startDate = new DateTime(year, month, 1);
                var endDate = startDate.AddMonths(1).AddDays(-1);

                var sessions = await _context.CalendarSessions
                    .Include(s => s.SpecialCourse)
                    .Include(s => s.Teacher)
                    .Where(s => s.SessionDate >= startDate && s.SessionDate <= endDate)
                    .Where(s => s.IsBooked == null || s.IsBooked == false)
                    .OrderBy(s => s.SessionDate)
                    .ThenBy(s => s.StartTime)
                    .ToListAsync();

                var result = new CalendarMonthDto
                {
                    Year = year,
                    Month = month
                };

                // Заполняем дни месяца
                for (var date = startDate; date <= endDate; date = date.AddDays(1))
                {
                    var daySessions = sessions.Where(s => s.SessionDate.Date == date.Date)
                        .Select(s => new SessionShortDto
                        {
                            Id = s.Id,
                            CourseTitle = s.SpecialCourse.Title,
                            StartTime = s.StartTime,
                            EndTime = s.EndTime,
                            AvailableSlots = s.AvailableSlots,
                            TeacherName = $"{s.Teacher.FirstName} {s.Teacher.LastName}"
                        }).ToList();

                    result.Days.Add(new CalendarDayDto
                    {
                        Date = date,
                        Sessions = daySessions,
                        HasAvailableSlots = daySessions.Any(s => s.AvailableSlots > 0)
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при получении сессий на месяц {Year}-{Month}", year, month);
                return StatusCode(500, new { message = "Ошибка при получении расписания" });
            }
        }

        // Создать сессию (Teacher/Admin)
        [HttpPost("sessions")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<ActionResult<CalendarSessionDto>> CreateSession(CreateSessionDto createDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
                var teacherId = (userRole == "Teacher") ? userId : createDto.TeacherId;

                // Проверяем что преподаватель существует и имеет роль Teacher
                var teacher = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == teacherId && u.Role == "Teacher");

                if (teacher == null)
                {
                    return BadRequest(new { message = "Преподаватель не найден" });
                }

                // Получаем особый курс "Разговорный шведский" (ID=1)
                var specialCourse = await _context.SpecialCourses
                    .FirstOrDefaultAsync(sc => sc.Title.Contains("Разговорный") || sc.Id == 1);

                if (specialCourse == null)
                {
                    return BadRequest(new { message = "Особый курс не найден" });
                }

                var endTime = createDto.EndTime == TimeSpan.Zero
                    ? createDto.StartTime.Add(TimeSpan.FromMinutes(specialCourse.DurationMinutes))
                    : createDto.EndTime;

                var session = new CalendarSession
                {
                    SpecialCourseId = specialCourse.Id,
                    TeacherId = teacherId,
                    SessionDate = createDto.SessionDate.Date,
                    StartTime = createDto.StartTime,
                    EndTime = endTime,
                    AvailableSlots = createDto.AvailableSlots,
                    IsBooked = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.CalendarSessions.Add(session);
                await _context.SaveChangesAsync();

                _logger.LogInformation("✅ Сессия создана: {Date} {StartTime}-{EndTime}",
                    session.SessionDate, session.StartTime, session.EndTime);

                return Ok(new CalendarSessionDto
                {
                    Id = session.Id,
                    SpecialCourseId = session.SpecialCourseId,
                    TeacherId = session.TeacherId,
                    TeacherName = $"{teacher.FirstName} {teacher.LastName}",
                    SessionDate = session.SessionDate,
                    StartTime = session.StartTime,
                    EndTime = session.EndTime,
                    AvailableSlots = session.AvailableSlots,
                    IsBooked = session.IsBooked,
                    CreatedAt = session.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при создании сессии");
                return StatusCode(500, new { message = "Ошибка при создании сессии" });
            }
        }

        // Забронировать сессию (Student)
        // Забронировать сессию (Student)
        [HttpPost("sessions/{sessionId}/book")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult> BookSession(int sessionId, CreateBookingDto bookingDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int studentId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                // ИСПРАВЛЕННАЯ СТРОКА: используем GetValueOrDefault для nullable bool
                var session = await _context.CalendarSessions
                    .Include(s => s.SpecialCourse)
                    .FirstOrDefaultAsync(s => s.Id == sessionId && s.IsBooked != true);
                if (session == null)
                {
                    return NotFound(new { message = "Сессия не найдена или уже забронирована" });
                }

                if (session.AvailableSlots <= 0)
                {
                    return BadRequest(new { message = "Нет свободных мест" });
                }

                // Проверяем не забронировал ли уже студент эту сессию
                var existingBooking = await _context.SessionBookings
                    .FirstOrDefaultAsync(b => b.SessionId == sessionId && b.StudentId == studentId);

                if (existingBooking != null)
                {
                    return BadRequest(new { message = "Вы уже забронировали эту сессию" });
                }

                var booking = new SessionBooking
                {
                    SessionId = sessionId,
                    StudentId = studentId,
                    BookedAt = DateTime.UtcNow,
                    Status = "Booked",
                    Notes = bookingDto.Notes
                };

                session.AvailableSlots--;
                if (session.AvailableSlots <= 0)
                {
                    session.IsBooked = true;
                }

                _context.SessionBookings.Add(booking);
                await _context.SaveChangesAsync();

                _logger.LogInformation("✅ Сессия забронирована студентом {StudentId}", studentId);

                return Ok(new
                {
                    message = "Сессия забронирована",
                    bookingId = booking.Id,
                    availableSlots = session.AvailableSlots
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при бронировании сессии {SessionId}", sessionId);
                return StatusCode(500, new { message = "Ошибка при бронировании" });
            }
        }

        // Получить мои бронирования (Student)
        [HttpGet("my-bookings")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult> GetMyBookings()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int studentId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                var bookings = await _context.SessionBookings
                    .Include(b => b.Session)
                        .ThenInclude(s => s.SpecialCourse)
                    .Include(b => b.Session)
                        .ThenInclude(s => s.Teacher)
                    .Include(b => b.Student)
                    .Where(b => b.StudentId == studentId)
                    .OrderByDescending(b => b.BookedAt)
                    .Select(b => new SessionBookingDto
                    {
                        Id = b.Id,
                        SessionId = b.SessionId,
                        StudentId = b.StudentId,
                        StudentName = b.Student != null ? $"{b.Student.FirstName} {b.Student.LastName}" : "Неизвестный студент",
                        BookedAt = b.BookedAt,
                        Status = b.Status,
                        Notes = b.Notes
                    })
                    .ToListAsync();

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при получении бронирований");
                return StatusCode(500, new { message = "Ошибка при получении бронирований" });
            }
        }
    }
}