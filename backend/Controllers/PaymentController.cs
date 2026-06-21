using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.Models;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace SchoolSwedishAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PaymentController> _logger;
        private readonly HttpClient _httpClient;

        private readonly string _shopId = "1338519";
        private readonly string _secretKey = "test_qTu11_rp4Eyn0Syd6MP_ToQo1tl9tN5k-XpqgQoDCMA";

        public PaymentController(ApplicationDbContext context, ILogger<PaymentController> logger)
        {
            _context = context;
            _logger = logger;
            _httpClient = new HttpClient();

            var authToken = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_shopId}:{_secretKey}"));
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
        {
            try
            {
                Console.WriteLine("=== НАЧАЛО СОЗДАНИЯ ПЛАТЕЖА ===");
                Console.WriteLine($"CourseId: {request.CourseId}");

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();
                var userId = int.Parse(userIdClaim);

                var existingEnrollment = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.StudentId == userId && e.CourseId == request.CourseId);

                if (existingEnrollment != null)
                {
                    return BadRequest(new { message = "Вы уже записаны на этот курс" });
                }

                var course = await _context.Courses.FindAsync(request.CourseId);
                if (course == null) return NotFound(new { message = "Курс не найден" });

                var enrollment = new Enrollment
                {
                    StudentId = userId,
                    CourseId = request.CourseId,
                    EnrolledAt = DateTime.UtcNow,
                    Status = "Dropped",
                    Progress = 0
                };
                _context.Enrollments.Add(enrollment);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Создана запись о зачислении ID: {enrollment.Id}");

                var idempotenceKey = Guid.NewGuid().ToString();
                _httpClient.DefaultRequestHeaders.Remove("Idempotence-Key");
                _httpClient.DefaultRequestHeaders.Add("Idempotence-Key", idempotenceKey);

                var paymentRequest = new
                {
                    amount = new
                    {
                        value = course.Price?.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture),
                        currency = "RUB"
                    },
                    capture = true,
                    confirmation = new
                    {
                        type = "redirect",
                        return_url = "https://shool.bite-code.ru/courses"
                    },
                    description = $"Оплата курса \"{course.Title}\"",
                    metadata = new
                    {
                        enrollmentId = enrollment.Id
                    }
                };

                var json = JsonSerializer.Serialize(paymentRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("https://api.yookassa.ru/v3/payments", content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Ошибка ЮKassa: {responseContent}");
                    return BadRequest(new { message = "Ошибка при создании платежа", error = responseContent });
                }

                // Используем JsonDocument для ручного извлечения confirmation_url
                using var doc = JsonDocument.Parse(responseContent);
                var root = doc.RootElement;
                var confirmationUrl = root.GetProperty("confirmation").GetProperty("confirmation_url").GetString();
                Console.WriteLine($"Confirmation URL: {confirmationUrl}");

                // Сохраняем платеж в БД
                var payment = new Payment
                {
                    EnrollmentId = enrollment.Id,
                    Amount = course.Price ?? 0,
                    YooKassaPaymentId = root.GetProperty("id").GetString(),
                    Status = root.GetProperty("status").GetString(),
                    CreatedAt = DateTime.UtcNow
                };
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new { paymentUrl = confirmationUrl, enrollmentId = enrollment.Id });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ОШИБКА: {ex.Message}");
                _logger.LogError(ex, "Ошибка при создании платежа");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("status/{enrollmentId}")]
        public async Task<IActionResult> GetPaymentStatus(int enrollmentId)
        {
            var enrollment = await _context.Enrollments.FindAsync(enrollmentId);
            if (enrollment == null)
                return NotFound();

            return Ok(new { isPaid = enrollment.Status == "Active", status = enrollment.Status });
        }
    }

    public class CreatePaymentRequest
    {
        public int CourseId { get; set; }
    }
}