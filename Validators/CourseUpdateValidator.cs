using FluentValidation;
using SchoolSwedishAPI.DTOs;

public class CourseUpdateValidator : AbstractValidator<CourseDto>
{
    public CourseUpdateValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Название курса обязательно")
            .Length(3, 100).WithMessage("Название курса должно быть от 3 до 100 символов");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Описание курса обязательно")
            .Length(10, 500).WithMessage("Описание курса должно быть от 10 до 500 символов");

        RuleFor(x => x.Level)
            .NotEmpty().WithMessage("Уровень курса обязателен")
            .Must(level => new[] { "Beginner", "Intermediate", "Advanced", "A1", "A2", "B1", "B2", "C1", "C2" }.Contains(level))
            .WithMessage("Уровень должен быть: Beginner, Intermediate, Advanced или A1-C2");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Стоимость курса не может быть отрицательной")
            .When(x => x.Price.HasValue);
    }
}