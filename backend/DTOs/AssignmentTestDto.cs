namespace SchoolSwedishAPI.DTOs
{
    // Для создания теста (преподаватель)
    public class CreateTestDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int MaxScore { get; set; } = 100;
        //public DateTime? Deadline { get; set; }
        public List<CreateQuestionDto> Questions { get; set; } = new();
    }

    public class CreateQuestionDto
    {
        public required string Text { get; set; }
        public string QuestionType { get; set; } = "MultipleChoice";
        public List<CreateAnswerDto> Answers { get; set; } = new();
    }

    public class CreateAnswerDto
    {
        public required string Text { get; set; }
        public bool IsCorrect { get; set; }
    }

    // Для получения теста (студент)
    public class TestDto
    {
        public int Id { get; set; }
        public int LessonId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int MaxScore { get; set; }
        //public DateTime? Deadline { get; set; }
        public List<QuestionDto> Questions { get; set; } = new();
    }

    public class QuestionDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public string QuestionType { get; set; } = null!;
        public List<AnswerDto> Answers { get; set; } = new();
    }

    public class AnswerDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
    }

    // Для сдачи теста
    public class SubmitTestDto
    {
        public List<AnswerSubmissionDto> Answers { get; set; } = new();
    }

    public class AnswerSubmissionDto
    {
        public int QuestionId { get; set; }
        public string SelectedAnswer { get; set; } = null!;
    }

    // Результат теста
    public class TestResultDto
    {
        public int Score { get; set; }
        public int MaxScore { get; set; }
        public double Percentage { get; set; }
        public int CorrectAnswers { get; set; }
        public int TotalQuestions { get; set; }
    }
}