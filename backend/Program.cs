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
            new SchoolSwedishAPI.Models.Course { Title = "Разговорный шведский", Description = "Развитие разговорных навыков", Level = "Intermediate", Price = 7000, DurationHours = 30, TeacherId = teacher.Id, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Course { Title = "Продвинутый шведский: литература и культура", Description = "Углубленное изучение шведского языка через литературу, историю и культуру. Изучение классических произведений шведских авторов, обсуждение культурных особенностей и современных тенденций.", Level = "Advanced", Price = 9000, DurationHours = 50, TeacherId = teacher.Id, CreatedAt = DateTime.UtcNow }
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

        // Add lessons for courses
        var lessons = new List<SchoolSwedishAPI.Models.Lesson>
        {
            // Lessons for first course (Beginner)
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[0].Id, Title = "Введение в шведский язык", Content = "На этом уроке мы познакомимся с основами шведского языка. Изучим алфавит, произношение и базовые фразы приветствия. Вы научитесь представляться и отвечать на простые вопросы.", OrderIndex = 1, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[0].Id, Title = "Основные слова и фразы", Content = "В этом уроке мы изучим самые важные шведские слова и фразы для повседневного общения. Научимся спрашивать дорогу, заказывать еду и общаться в магазине.", OrderIndex = 2, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[0].Id, Title = "Грамматика: личные местоимения", Content = "Подробное изучение личных местоимений в шведском языке. Рассмотрим формы единственного и множественного числа, а также их использование в предложениях.", OrderIndex = 3, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[0].Id, Title = "Числа и счёт", Content = "Учимся считать на шведском языке. Изучим числа от 0 до 1000000, научимся называть время, дату и производить базовые математические операции.", OrderIndex = 4, CreatedAt = DateTime.UtcNow },

            // Lessons for second course (Intermediate)
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[1].Id, Title = "Продвинутые разговорные конструкции", Content = "На этом уроке мы изучим более сложные способы выражения мыслей. Научимся дискутировать, выражать мнение и отстаивать точку зрения на шведском языке.", OrderIndex = 1, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[1].Id, Title = "Деловое общение", Content = "Специализированный урок для бизнес-коммуникации. Изучим деловую корреспонденцию, телефонные разговоры и презентации на шведском языке.", OrderIndex = 2, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[1].Id, Title = "Слушание и понимание", Content = "Развиваем навыки аудирования через аутентичные материалы. Слушаем подкасты, смотрим видео и обсуждаем услышанное на шведском языке.", OrderIndex = 3, CreatedAt = DateTime.UtcNow },

            // Lessons for third course (Advanced)
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[2].Id, Title = "Классическая шведская литература", Content = "Глубокое изучение произведений классических шведских авторов: Августа Стриндберга, Сельмы Лагерлёф и других. Анализ литературного стиля, исторического контекста и философских идей.", OrderIndex = 1, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[2].Id, Title = "Шведская культура и традиции", Content = "Изучение глубоких аспектов шведской культуры: праздники, обычаи, особенности менталитета. Разговор о влиянии природы и истории на формирование национального характера шведов.", OrderIndex = 2, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[2].Id, Title = "Современный шведский язык и медиа", Content = "Изучение современного шведского языка через СМИ, интернет-блоги и социальные сети. Анализ актуальных текстов, обсуждение современных социальных и политических вопросов на шведском языке.", OrderIndex = 3, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[2].Id, Title = "Академический шведский и исследования", Content = "Специализированный урок по академическому шведскому языку. Изучение структуры научных статей, написание эссе и презентаций на шведском языке для университетского уровня.", OrderIndex = 4, CreatedAt = DateTime.UtcNow },
            new SchoolSwedishAPI.Models.Lesson { CourseId = courses[2].Id, Title = "Региональные диалекты и варианты", Content = "Знакомство с региональными диалектами и вариантами шведского языка. Изучение различий между диалектами разных провинций и их исторического развития.", OrderIndex = 5, CreatedAt = DateTime.UtcNow }
        };

        context.Lessons.AddRange(lessons);
        context.SaveChanges();

        // Add assignments (tests) for lessons
        var assignments = new List<SchoolSwedishAPI.Models.Assignment>
        {
            // Test for first lesson of first course
            new SchoolSwedishAPI.Models.Assignment
            {
                LessonId = lessons[0].Id,
                Title = "Тест: Введение в шведский язык",
                Description = "Проверьте свои знания основ шведского языка",
                MaxScore = 100,
                CreatedAt = DateTime.UtcNow
            },
            // Test for second lesson of first course
            new SchoolSwedishAPI.Models.Assignment
            {
                LessonId = lessons[1].Id,
                Title = "Тест: Основные слова и фразы",
                Description = "Проверьте свои знания базовых слов и фраз",
                MaxScore = 100,
                CreatedAt = DateTime.UtcNow
            },
            // Test for first lesson of second course
            new SchoolSwedishAPI.Models.Assignment
            {
                LessonId = lessons[4].Id,
                Title = "Тест: Продвинутые разговорные конструкции",
                Description = "Проверьте свои навыки продвинутого разговорного шведского",
                MaxScore = 100,
                CreatedAt = DateTime.UtcNow
            },
            // Tests for third course (Advanced)
            new SchoolSwedishAPI.Models.Assignment
            {
                LessonId = lessons[7].Id,
                Title = "Тест: Классическая шведская литература",
                Description = "Проверьте свои знания о классических произведениях шведских авторов",
                MaxScore = 100,
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Assignment
            {
                LessonId = lessons[8].Id,
                Title = "Тест: Шведская культура и традиции",
                Description = "Тест на знание шведской культуры и национальных традиций",
                MaxScore = 100,
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Assignment
            {
                LessonId = lessons[9].Id,
                Title = "Тест: Современный шведский язык и медиа",
                Description = "Проверьте способность понимать современный шведский язык в медиа",
                MaxScore = 100,
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Assignments.AddRange(assignments);
        context.SaveChanges();

        // Add questions and answers for first assignment
        var questions1 = new List<SchoolSwedishAPI.Models.Question>
        {
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[0].Id,
                Text = "Как сказать 'Привет' на шведском?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[0].Id,
                Text = "Как сказать 'Спасибо' на шведском?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Questions.AddRange(questions1);
        context.SaveChanges();

        // Add answers for first assignment
        var answers1 = new List<SchoolSwedishAPI.Models.Answer>
        {
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions1[0].Id, Text = "Hej", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions1[0].Id, Text = "Tack", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions1[0].Id, Text = "Ja", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions1[0].Id, Text = "Nej", IsCorrect = false, OrderIndex = 4 },

            new SchoolSwedishAPI.Models.Answer { QuestionId = questions1[1].Id, Text = "Varsågod", IsCorrect = false, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions1[1].Id, Text = "Tack", IsCorrect = true, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions1[1].Id, Text = "Hej", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions1[1].Id, Text = "Ja tack", IsCorrect = false, OrderIndex = 4 }
        };

        context.Answers.AddRange(answers1);
        context.SaveChanges();

        // Add questions and answers for second assignment
        var questions2 = new List<SchoolSwedishAPI.Models.Question>
        {
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[1].Id,
                Text = "Как спросить 'Как дела?' на шведском?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[1].Id,
                Text = "Как сказать 'Хорошо' на шведском?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Questions.AddRange(questions2);
        context.SaveChanges();

        var answers2 = new List<SchoolSwedishAPI.Models.Answer>
        {
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions2[0].Id, Text = "Hur mår du?", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions2[0].Id, Text = "Vad heter du?", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions2[0].Id, Text = "Varifrån kommer du?", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions2[0].Id, Text = "Vem är du?", IsCorrect = false, OrderIndex = 4 },

            new SchoolSwedishAPI.Models.Answer { QuestionId = questions2[1].Id, Text = "Dålig", IsCorrect = false, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions2[1].Id, Text = "Bra", IsCorrect = true, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions2[1].Id, Text = "Tråkig", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions2[1].Id, Text = "Rolig", IsCorrect = false, OrderIndex = 4 }
        };

        context.Answers.AddRange(answers2);
        context.SaveChanges();

        // Add questions and answers for third assignment
        var questions3 = new List<SchoolSwedishAPI.Models.Question>
        {
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[2].Id,
                Text = "Как выразить несогласие на шведском?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Questions.AddRange(questions3);
        context.SaveChanges();

        var answers3 = new List<SchoolSwedishAPI.Models.Answer>
        {
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions3[0].Id, Text = "Jag håller inte med", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions3[0].Id, Text = "Jag håller med", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions3[0].Id, Text = "Jag tycker det är dåligt", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions3[0].Id, Text = "Jag förstår inte", IsCorrect = false, OrderIndex = 4 }
        };

        context.Answers.AddRange(answers3);
        context.SaveChanges();

        // Add questions and answers for fourth assignment (Advanced course)
        var questions4 = new List<SchoolSwedishAPI.Models.Question>
        {
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[3].Id,
                Text = "Какое главное произведение написал Август Стриндберг?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[3].Id,
                Text = "Кто автор 'Чудесного путешествия Нильса Хольгерссона'?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[3].Id,
                Text = "В каком веке жила Сельма Лагерлёф?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Questions.AddRange(questions4);
        context.SaveChanges();

        var answers4 = new List<SchoolSwedishAPI.Models.Answer>
        {
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[0].Id, Text = "Госпожа Юлия", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[0].Id, Text = "Красная комната", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[0].Id, Text = "Отец", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[0].Id, Text = "Привидения", IsCorrect = false, OrderIndex = 4 },

            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[1].Id, Text = "Сельма Лагерлёф", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[1].Id, Text = "Август Стриндберг", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[1].Id, Text = "Эмиль Беккер", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[1].Id, Text = "Виктор Рюдберг", IsCorrect = false, OrderIndex = 4 },

            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[2].Id, Text = "XIX-XX веках", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[2].Id, Text = "XVIII веке", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[2].Id, Text = "XX веке", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions4[2].Id, Text = "XVII веке", IsCorrect = false, OrderIndex = 4 }
        };

        context.Answers.AddRange(answers4);
        context.SaveChanges();

        // Add questions and answers for fifth assignment (Advanced course)
        var questions5 = new List<SchoolSwedishAPI.Models.Question>
        {
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[4].Id,
                Text = "Какой национальный день отмечают в Швеции 6 июня?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[4].Id,
                Text = "Как называется традиционный шведский стол с холодными закусками?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[4].Id,
                Text = "Как называется шведское летнее торжество в честь летнего солнцестояния?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Questions.AddRange(questions5);
        context.SaveChanges();

        var answers5 = new List<SchoolSwedishAPI.Models.Answer>
        {
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[0].Id, Text = "День Швеции и День флага", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[0].Id, Text = "День независимости", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[0].Id, Text = "День конституции", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[0].Id, Text = "День королевства", IsCorrect = false, OrderIndex = 4 },

            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[1].Id, Text = "Смёргосборд", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[1].Id, Text = "Юлебордд", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[1].Id, Text = "Фика", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[1].Id, Text = "Мидсоммарборд", IsCorrect = false, OrderIndex = 4 },

            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[2].Id, Text = "Мидсоммар", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[2].Id, Text = "Юль", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[2].Id, Text = "Валбург", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions5[2].Id, Text = "Апелсинскива", IsCorrect = false, OrderIndex = 4 }
        };

        context.Answers.AddRange(answers5);
        context.SaveChanges();

        // Add questions and answers for sixth assignment (Advanced course)
        var questions6 = new List<SchoolSwedishAPI.Models.Question>
        {
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[5].Id,
                Text = "Какое ведущее шведское новостное агентство?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[5].Id,
                Text = "Как называется национальная телекомпания Швеции?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            },
            new SchoolSwedishAPI.Models.Question
            {
                AssignmentId = assignments[5].Id,
                Text = "Какой популярный шведский журнал известен своей критикой и культурными обзорами?",
                QuestionType = "MultipleChoice",
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Questions.AddRange(questions6);
        context.SaveChanges();

        var answers6 = new List<SchoolSwedishAPI.Models.Answer>
        {
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[0].Id, Text = "ТТ", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[0].Id, Text = "АФП", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[0].Id, Text = "РейтерS", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[0].Id, Text = "ДНБ", IsCorrect = false, OrderIndex = 4 },

            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[1].Id, Text = "СВТ", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[1].Id, Text = "НТВ", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[1].Id, Text = "БВ", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[1].Id, Text = "ТВ4", IsCorrect = false, OrderIndex = 4 },

            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[2].Id, Text = "Dagens Nyheter", IsCorrect = true, OrderIndex = 1 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[2].Id, Text = "Svenska Dagbladet", IsCorrect = false, OrderIndex = 2 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[2].Id, Text = "Expressen", IsCorrect = false, OrderIndex = 3 },
            new SchoolSwedishAPI.Models.Answer { QuestionId = questions6[2].Id, Text = "Aftonbladet", IsCorrect = false, OrderIndex = 4 }
        };

        context.Answers.AddRange(answers6);
        context.SaveChanges();

        Log.Information("Database seeded with 4 users, 3 courses, enrollments, lessons, and comprehensive tests");
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