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
    public class TestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TestsController> _logger;

        public TestsController(ApplicationDbContext context, ILogger<TestsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Получить все тесты для курса
        [HttpGet("course/{courseId}")]
        [Authorize(Roles = "Student,Teacher,Admin")]
        public async Task<ActionResult<List<TestDto>>> GetTestsForCourse(int courseId)
        {
            try
            {
                _logger.LogInformation("📋 Запрос тестов для курса {CourseId}", courseId);

                var assignments = await _context.Assignments
                    .Include(a => a.Lesson)
                    .Include(a => a.Questions)
                        .ThenInclude(q => q.Answers)
                    .Where(a => a.Lesson.CourseId == courseId)
                    .OrderBy(a => a.Lesson.OrderIndex)
                    .ToListAsync();

                var result = assignments.Select(a => new TestDto
                {
                    Id = a.Id,
                    LessonId = a.LessonId,
                    Title = a.Title,
                    Description = a.Description,
                    MaxScore = a.MaxScore ?? 100,
                    Questions = a.Questions
                        .OrderBy(q => q.Id)
                        .Select(q => new QuestionDto
                        {
                            Id = q.Id,
                            Text = q.Text,
                            QuestionType = q.QuestionType,
                            Answers = q.Answers
                                .OrderBy(a => a.OrderIndex ?? 0)
                                .Select(a => new AnswerDto
                                {
                                    Id = a.Id,
                                    Text = a.Text
                                }).ToList()
                        }).ToList()
                }).ToList();

                _logger.LogInformation("✅ Найдено {Count} тестов для курса {CourseId}", result.Count, courseId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при получении тестов для курса {CourseId}", courseId);
                return StatusCode(500, new { message = "Ошибка при получении тестов" });
            }
        }

        // Получить тест для урока (для студентов)
        [HttpGet("lesson/{lessonId}")]
        [Authorize(Roles = "Student,Teacher,Admin")]
        public async Task<ActionResult<TestDto>> GetTestForLesson(int lessonId)
        {
            try
            {
                if (!int.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out int userId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                _logger.LogInformation("🎯 Студент {UserId} запрашивает тест для урока {LessonId}", userId, lessonId);

                var assignment = await _context.Assignments
                    .Include(a => a.Questions)
                        .ThenInclude(q => q.Answers)
                    .Where(a => a.LessonId == lessonId)
                    .FirstOrDefaultAsync();

                if (assignment == null)
                {
                    _logger.LogInformation("📭 Тест не найден для урока {LessonId}", lessonId);
                    return NotFound(new { message = "Тест не найден" });
                }

                // Проверяем дедлайн
                //if (assignment.Deadline.HasValue && assignment.Deadline < DateTime.UtcNow)
                //{
                //    _logger.LogWarning("⏰ Срок сдачи теста истек для урока {LessonId}", lessonId);
                //    return BadRequest(new { message = "Срок сдачи теста истек" });
                //}

                // Проверяем не сдавал ли уже студент этот тест (только для студентов)
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
                if (userRole == "Student")
                {
                    var existingSubmission = await _context.Studentassignments
                        .FirstOrDefaultAsync(sa => sa.StudentId == userId && sa.AssignmentId == assignment.Id);

                    if (existingSubmission != null)
                    {
                        _logger.LogInformation("📝 Студент уже сдавал этот тест, результат: {Score}", existingSubmission.Score);
                        return BadRequest(new
                        {
                            message = "Вы уже сдавали этот тест",
                            score = existingSubmission.Score
                        });
                    }
                }

                var result = new TestDto
                {
                    Id = assignment.Id,
                    LessonId = assignment.LessonId,
                    Title = assignment.Title,
                    Description = assignment.Description,
                    MaxScore = assignment.MaxScore ?? 100,
                    //Deadline = assignment.Deadline,
                    Questions = assignment.Questions
                        .OrderBy(q => q.Id)
                        .Select(q => new QuestionDto
                        {
                            Id = q.Id,
                            Text = q.Text,
                            QuestionType = q.QuestionType,
                            Answers = q.Answers
                                .OrderBy(a => a.OrderIndex ?? 0)
                                .Select(a => new AnswerDto
                                {
                                    Id = a.Id,
                                    Text = a.Text
                                    // Не показываем IsCorrect студентам!
                                }).ToList()
                        }).ToList()
                };

                _logger.LogInformation("✅ Тест отправлен студенту: {Title}", assignment.Title);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при получении теста для урока {LessonId}", lessonId);
                return StatusCode(500, new { message = "Ошибка при получении теста" });
            }
        }

        // Создать тест для урока (преподаватель/админ)
        [HttpPost("lesson/{lessonId}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<ActionResult> CreateTest(int lessonId, CreateTestDto createTestDto)
        {
            try
            {
                if (!int.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out int userId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                _logger.LogInformation("👨‍🏫 Преподаватель {UserId} создает тест для урока {LessonId}", userId, lessonId);

                var lesson = await _context.Lessons.FindAsync(lessonId);
                if (lesson == null)
                {
                    return NotFound(new { message = "Урок не найден" });
                }

                // Проверяем не существует ли уже тест
                var existingTest = await _context.Questions
                    .AnyAsync(q => q.Assignment.LessonId == lessonId);

                if (existingTest)
                {
                    _logger.LogWarning("❌ Тест уже существует для урока {LessonId}", lessonId);
                    return BadRequest(new { message = "Тест уже существует для этого урока" });
                }


                // Создаем задание (тест)
                var assignment = new Assignment
                {
                    LessonId = lessonId,
                    Title = createTestDto.Title,
                    Description = createTestDto.Description,
                    MaxScore = createTestDto.MaxScore,
                    //Deadline = createTestDto.Deadline,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Assignments.Add(assignment);
                await _context.SaveChangesAsync();

                // Добавляем вопросы
                foreach (var questionDto in createTestDto.Questions)
                {
                    var question = new Question
                    {
                        AssignmentId = assignment.Id,
                        Text = questionDto.Text,
                        QuestionType = questionDto.QuestionType,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.Questions.Add(question);
                    await _context.SaveChangesAsync();

                    // Добавляем ответы
                    int orderIndex = 1;
                    foreach (var answerDto in questionDto.Answers)
                    {
                        var answer = new Answer
                        {
                            QuestionId = question.Id,
                            Text = answerDto.Text,
                            IsCorrect = answerDto.IsCorrect,
                            OrderIndex = orderIndex++
                        };

                        _context.Answers.Add(answer);
                    }
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("✅ Тест создан: {Title} (ID: {AssignmentId})", assignment.Title, assignment.Id);
                return Ok(new
                {
                    message = "Тест создан",
                    assignmentId = assignment.Id,
                    questionsCount = createTestDto.Questions.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при создании теста для урока {LessonId}", lessonId);
                return StatusCode(500, new { message = "Ошибка при создании теста" });
            }
        }

        // Сдать тест (студент)
        [HttpPost("{assignmentId}/submit")]
        [Authorize(Roles = "Student")]
        public async Task<ActionResult<TestResultDto>> SubmitTest(int assignmentId, SubmitTestDto submitDto)
        {
            try
            {
                if (!int.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out int studentId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                _logger.LogInformation("📤 Студент {StudentId} сдает тест {AssignmentId}", studentId, assignmentId);

                var assignment = await _context.Assignments
                    .Include(a => a.Questions)
                        .ThenInclude(q => q.Answers)
                    .FirstOrDefaultAsync(a => a.Id == assignmentId);

                if (assignment == null)
                {
                    return NotFound(new { message = "Тест не найден" });
                }

                // Проверяем не сдавал ли уже
                var existingSubmission = await _context.Studentassignments
                    .FirstOrDefaultAsync(sa => sa.StudentId == studentId && sa.AssignmentId == assignmentId);

                if (existingSubmission != null)
                {
                    return BadRequest(new { message = "Вы уже сдавали этот тест" });
                }

                // Проверяем ответы
                int correctAnswers = 0;
                int totalQuestions = assignment.Questions.Count;

                foreach (var question in assignment.Questions)
                {
                    var submittedAnswer = submitDto.Answers
                        .FirstOrDefault(a => a.QuestionId == question.Id);

                    if (submittedAnswer != null)
                    {
                        // Находим правильный ответ
                        var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect == true);

                        // Сравниваем текст ответа
                        if (correctAnswer != null &&
                            submittedAnswer.SelectedAnswer.Trim().ToLower() == correctAnswer.Text.Trim().ToLower())
                        {
                            correctAnswers++;
                        }
                    }
                }

                // Рассчитываем баллы
                double scorePercentage = totalQuestions > 0 ? (correctAnswers * 100.0) / totalQuestions : 0;
                int score = (int)Math.Round(scorePercentage);

                // Сохраняем результат
                var studentAssignment = new Studentassignment
                {
                    StudentId = studentId,
                    AssignmentId = assignmentId,
                    Score = score,
                    SubmittedAt = DateTime.UtcNow
                };

                _context.Studentassignments.Add(studentAssignment);
                await _context.SaveChangesAsync();

                var result = new TestResultDto
                {
                    Score = score,
                    MaxScore = assignment.MaxScore ?? 100,
                    Percentage = scorePercentage,
                    CorrectAnswers = correctAnswers,
                    TotalQuestions = totalQuestions
                };

                _logger.LogInformation("✅ Тест сдан: {Score}% правильных ответов", scorePercentage);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при сдаче теста {AssignmentId}", assignmentId);
                return StatusCode(500, new { message = "Ошибка при сдаче теста" });
            }
        }

        // Получить результаты теста (преподаватель/студент)
        [HttpGet("{assignmentId}/results")]
        public async Task<ActionResult> GetTestResults(int assignmentId)
        {
            try
            {
                if (!int.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out int userId))
                {
                    return Unauthorized(new { message = "Пользователь не авторизован" });
                }

                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                _logger.LogInformation("📊 Запрос результатов теста {AssignmentId} пользователем {UserId}", assignmentId, userId);

                if (userRole == "Student")
                {
                    // Студент видит только свой результат
                    var result = await _context.Studentassignments
                        .Where(sa => sa.AssignmentId == assignmentId && sa.StudentId == userId)
                        .Select(sa => new
                        {
                            Score = sa.Score,
                            SubmittedAt = sa.SubmittedAt,
                            Feedback = sa.Feedback
                        })
                        .FirstOrDefaultAsync();

                    if (result == null)
                    {
                        return NotFound(new { message = "Результат не найден" });
                    }

                    return Ok(result);
                }
                else if (userRole == "Teacher" || userRole == "Admin")
                {
                    // Преподаватель видит все результаты
                    var results = await _context.Studentassignments
                        .Include(sa => sa.Student)
                        .Where(sa => sa.AssignmentId == assignmentId)
                        .Select(sa => new
                        {
                            StudentId = sa.StudentId,
                            StudentName = sa.Student.FirstName + " " + sa.Student.LastName,
                            Score = sa.Score,
                            SubmittedAt = sa.SubmittedAt,
                            Feedback = sa.Feedback
                        })
                        .ToListAsync();

                    return Ok(results);
                }

                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Ошибка при получении результатов теста {AssignmentId}", assignmentId);
                return StatusCode(500, new { message = "Ошибка при получении результатов" });
            }
        }
    }
}