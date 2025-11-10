using Microsoft.AspNetCore.Mvc;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.Models;
using BCrypt.Net; 

namespace SchoolSwedishAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeedController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("clear-database")]
        public async Task<ActionResult> ClearDatabase()
        {
            try
            {
                _context.Enrollments.RemoveRange(_context.Enrollments);
                _context.Courses.RemoveRange(_context.Courses);
                _context.Users.RemoveRange(_context.Users);

                await _context.SaveChangesAsync();

                return Ok(new { message = "База данных очищена!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpPost("fill-database")]
        public async Task<ActionResult> FillDatabase()
        {
            try
            {
                // Добавляем пользователей
                var users = new List<User>
                {
                    new User { Email = "admin@school.com", FirstName = "Админ", LastName = "Системный", Role = "Admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("temp123"), CreatedAt = DateTime.UtcNow },
                    new User { Email = "teacher@school.com", FirstName = "Анна", LastName = "Преподаватель", Role = "Teacher", PasswordHash = BCrypt.Net.BCrypt.HashPassword("temp123"), CreatedAt = DateTime.UtcNow },
                    new User { Email = "student1@school.com", FirstName = "Иван", LastName = "Студентов", Role = "Student", PasswordHash = BCrypt.Net.BCrypt.HashPassword("temp123"), CreatedAt = DateTime.UtcNow },
                    new User { Email = "student2@school.com", FirstName = "Мария", LastName = "Ученикова", Role = "Student", PasswordHash = BCrypt.Net.BCrypt.HashPassword("temp123"), CreatedAt = DateTime.UtcNow }
                };

                _context.Users.AddRange(users);
                await _context.SaveChangesAsync();

                // Добавляем курсы
                var teacher = users.First(u => u.Role == "Teacher");
                var courses = new List<Course>
                {
                    new Course { Title = "Шведский для начинающих", Description = "Базовый курс шведского языка", Level = "Beginner", Price = 5000, DurationHours = 40, TeacherId = teacher.Id, CreatedAt = DateTime.UtcNow },
                    new Course { Title = "Разговорный шведский", Description = "Развитие разговорных навыков", Level = "Intermediate", Price = 7000, DurationHours = 30, TeacherId = teacher.Id, CreatedAt = DateTime.UtcNow }
                };

                _context.Courses.AddRange(courses);
                await _context.SaveChangesAsync();

                // Добавляем записи на курсы
                var students = users.Where(u => u.Role == "Student").ToList();
                var enrollments = new List<Enrollment>();

                foreach (var student in students)
                {
                    foreach (var course in courses)
                    {
                        enrollments.Add(new Enrollment
                        {
                            StudentId = student.Id,
                            CourseId = course.Id,
                            EnrolledAt = DateTime.UtcNow,
                            Progress = (decimal?)new Random().Next(10, 90)
                        });
                    }
                }

                _context.Enrollments.AddRange(enrollments);
                await _context.SaveChangesAsync();

                return Ok(new { message = "База данных заполнена тестовыми данными!", usersCount = users.Count, coursesCount = courses.Count, enrollmentsCount = enrollments.Count });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}