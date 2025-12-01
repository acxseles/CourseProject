using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SchoolSwedishAPI.Data;
using SchoolSwedishAPI.Services;
using System.Text;
using FluentValidation.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console(
        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {NewLine}{Exception}"
    )
    .WriteTo.File(
        path: "logs/school-api-.txt",
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
        retainedFileCountLimit: 7
    )
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

// Add FluentValidation validators (suppress obsolete warning - v11.3.1 still works)
#pragma warning disable CS0618
builder.Services.AddControllers()
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<Program>();
        fv.AutomaticValidationEnabled = true;
    });
#pragma warning restore CS0618
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "School Swedish API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 0))));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSecret = builder.Configuration["JWT:Secret"] ?? throw new InvalidOperationException("JWT:Secret configuration is missing");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                Console.WriteLine($"Token received: {token?.Substring(0, Math.Min(20, token.Length))}...");
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                Console.WriteLine($"Exception: {context.Exception}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var userName = context.Principal?.Identity?.Name ?? "Unknown";
                Console.WriteLine($"Token validated! User: {userName}");
                return Task.CompletedTask;
            },
            OnForbidden = context =>
            {
                var userName = context.HttpContext.User.Identity?.Name ?? "Unknown";
                Console.WriteLine($"Access forbidden for: {userName}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<PdfExportService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Create database and tables if they don't exist
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    Log.Information("Database tables created or verified");

    // Seed database if empty
    if (!context.Users.Any())
    {
        Log.Information("Seeding database with initial data...");

        var users = new List<SchoolSwedishAPI.Models.User>
        {
            new SchoolSwedishAPI.Models.User { Email = "admin@school.com", FirstName = "Админ", LastName = "Системный", Role = "Admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("temp123"), CreatedAt = DateTime.UtcNow, IsActive = true },
            new SchoolSwedishAPI.Models.User { Email = "teacher@school.com", FirstName = "Анна", LastName = "Преподаватель", Role = "Teacher", PasswordHash = BCrypt.Net.BCrypt.HashPassword("temp123"), CreatedAt = DateTime.UtcNow, IsActive = true },
            new SchoolSwedishAPI.Models.User { Email = "student1@school.com", FirstName = "Иван", LastName = "Студентов", Role = "Student", PasswordHash = BCrypt.Net.BCrypt.HashPassword("temp123"), CreatedAt = DateTime.UtcNow, IsActive = true },
            new SchoolSwedishAPI.Models.User { Email = "student2@school.com", FirstName = "Мария", LastName = "Ученикова", Role = "Student", PasswordHash = BCrypt.Net.BCrypt.HashPassword("temp123"), CreatedAt = DateTime.UtcNow, IsActive = true }
        };

        context.Users.AddRange(users);
        context.SaveChanges();

        var teacher = users.First(u => u.Role == "Teacher");
        var courses = new List<SchoolSwedishAPI.Models.Course>
        {
            new SchoolSwedishAPI.Models.Course { Title = "Шведский для начинающих", Description = "Базовый курс шведского языка", Level = "Beginner", Price = 5000, DurationHours = 40, TeacherId = teacher.Id, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Course { Title = "Разговорный шведский", Description = "Развитие разговорных навыков", Level = "Intermediate", Price = 7000, DurationHours = 30, TeacherId = teacher.Id, CreatedAt = DateTime.UtcNow }
        };

        context.Courses.AddRange(courses);
        context.SaveChanges();

        var students = users.Where(u => u.Role == "Student").ToList();
        var enrollments = new List<SchoolSwedishAPI.Models.Enrollment>();

        foreach (var student in students)
        {
            foreach (var course in courses)
            {
                enrollments.Add(new SchoolSwedishAPI.Models.Enrollment
                {
                    StudentId = student.Id,
                    CourseId = course.Id,
                    EnrolledAt = DateTime.UtcNow,
                    Progress = (decimal?)new Random().Next(10, 90),
                    Status = "Active"
                });
            }
        }

        context.Enrollments.AddRange(enrollments);
        context.SaveChanges();

        Log.Information("Database seeded with 4 users, 2 courses, and enrollments");
    }
    else
    {
        Log.Information("Database already contains data, skipping seed");
    }
}

Log.Information("School Swedish API запущено!");
Log.Information("База данных: {Connection}", builder.Configuration.GetConnectionString("DefaultConnection"));
Log.Information("Environment: {Environment}", app.Environment.EnvironmentName);

//app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "School Swedish API v1");
        c.RoutePrefix = "swagger";
    });
    Log.Information("Swagger доступен по /swagger");
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Log all registered endpoints
var endpointDataSource = app.Services.GetRequiredService<Microsoft.AspNetCore.Routing.EndpointDataSource>();
foreach (var endpoint in endpointDataSource.Endpoints)
{
    if (endpoint is Microsoft.AspNetCore.Routing.RouteEndpoint routeEndpoint)
    {
        Log.Information("Registered endpoint: {Route}", routeEndpoint.RoutePattern);
    }
}

try
{
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Приложение завершилось с ошибкой");
}
finally
{
    Log.CloseAndFlush();
}