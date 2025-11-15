using FluentValidation;
using SchoolSwedishAPI.DTOs;

public class UserRegisterValidator : AbstractValidator<RegisterDto>
{
    public UserRegisterValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email обязателен")
            .EmailAddress().WithMessage("Некорректный формат email")
            .MaximumLength(100).WithMessage("Email не должен превышать 100 символов");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обязателен")
            .MinimumLength(6).WithMessage("Пароль должен содержать минимум 6 символов")
            .MaximumLength(100).WithMessage("Пароль не должен превышать 100 символов")
            .Matches("[A-Z]").WithMessage("Пароль должен содержать хотя бы одну заглавную букву")
            .Matches("[a-z]").WithMessage("Пароль должен содержать хотя бы одну строчную букву")
            .Matches("[0-9]").WithMessage("Пароль должен содержать хотя бы одну цифру");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Имя обязательно")
            .Length(2, 50).WithMessage("Имя должно быть от 2 до 50 символов")
            .Matches(@"^[a-zA-Zа-яА-Я]+$").WithMessage("Имя может содержать только буквы");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Фамилия обязательна")
            .Length(2, 50).WithMessage("Фамилия должна быть от 2 до 50 символов")
            .Matches(@"^[a-zA-Zа-яА-Я]+$").WithMessage("Фамилия может содержать только буквы");
    }
}