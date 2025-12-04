using System;
using System.Collections.Generic;

namespace SchoolSwedishAPI.Models;

public partial class Question
{
    public int Id { get; set; }

    public int AssignmentId { get; set; }

    public string Text { get; set; } = null!;

    public string QuestionType { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public virtual Assignment Assignment { get; set; } = null!;
}
