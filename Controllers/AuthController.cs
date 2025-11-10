using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.DTOs;
using SchoolSwedishAPI.Models;
using SchoolSwedishAPI.Services;
using BCrypt.Net;
using Serilog;

namespace SchoolSwedishAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, TokenService tokenService, ILogger<AuthController> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            try
            {
                _logger.LogInformation("Начата регистрация пользователя: {Email}", registerDto.Email);

                // Проверяем, существует ли пользователь
                if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                {
                    _logger.LogWarning("Попытка регистрации с существующим email: {Email}", registerDto.Email);
                    return BadRequest(new { message = "Пользователь с таким email уже существует" });
                }

                // Создаем пользователя
                var user = new User
                {
                    Email = registerDto.Email,
                    FirstName = registerDto.FirstName,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    LastName = registerDto.LastName,
                    Role = registerDto.Role,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Успешная регистрация: {Email}, Role: {Role}",
                    user.Email, user.Role);

                // Создаем токен
                var token = _tokenService.CreateToken(user);

                return new AuthResponseDto
                {
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt
                    },
                    Token = token
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при регистрации пользователя {Email}", registerDto.Email);
                return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            try
            {
                _logger.LogInformation("Попытка входа: {Email}", loginDto.Email);

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    _logger.LogWarning("Неудачная попытка входа: {Email}", loginDto.Email);
                    return Unauthorized("Неверный email или пароль");
                }

                _logger.LogInformation("Успешный вход: {Email}, Role: {Role}", user.Email, user.Role);

                var token = _tokenService.CreateToken(user);

                return new AuthResponseDto
                {
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role,
                        CreatedAt = user.CreatedAt
                    },
                    Token = token
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при входе пользователя {Email}", loginDto.Email);
                return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
            }
        }
    }
}