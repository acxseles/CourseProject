export interface TestDto {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  maxScore: number;
  questions: QuestionDto[];
}

export interface QuestionDto {
  id: number;
  text: string;
  questionType: string;
  answers: AnswerDto[];
}

export interface AnswerDto {
  id: number;
  text: string;
}

export interface CreateTestDto {
  title: string;
  description: string;
  maxScore: number;
  questions: CreateQuestionDto[];
}

export interface CreateQuestionDto {
  text: string;
  questionType: string;
  answers: CreateAnswerDto[];
}

export interface CreateAnswerDto {
  text: string;
  isCorrect: boolean;
}

export interface SubmitTestDto {
  answers: TestAnswerDto[];
}

export interface TestAnswerDto {
  questionId: number;
  selectedAnswer: string;
}

export interface TestResultDto {
  score: number;
  maxScore: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
}