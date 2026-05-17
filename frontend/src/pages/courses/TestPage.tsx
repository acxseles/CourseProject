import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';

interface Question {
  id: number;
  text: string;
  questionType: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  text: string;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  maxScore: number;
  questions: Question[];
}

export const TestPage = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [existingScore, setExistingScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await apiClient.get(`/tests/lesson/${lessonId}`);
        setAssignment(response.data);
      } catch (err: any) {
        console.error('Ошибка загрузки теста:', err);
        
        if (err.response?.status === 400 && err.response?.data?.message === 'Вы уже сдавали этот тест') {
          setAlreadySubmitted(true);
          setExistingScore(err.response?.data?.score || 0);
        } else if (err.response?.status === 404) {
          setError('Тест для этого урока не найден');
        } else {
          setError('Не удалось загрузить тест');
        }
        setAssignment(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [lessonId]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(userAnswers).length !== assignment?.questions.length) {
      alert('Ответьте на все вопросы');
      return;
    }

    try {
      setSubmitting(true);
      
      const answers = Object.entries(userAnswers).map(([questionId, answerId]) => {
        const question = assignment?.questions.find(q => q.id === parseInt(questionId));
        const answerText = question?.answers.find(a => a.id === answerId)?.text || '';
        return {
          questionId: parseInt(questionId),
          selectedAnswer: answerText
        };
      });
      
      const response = await apiClient.post(`/tests/${assignment?.id}/submit`, { answers });
      
      const result = response.data;
      setScore(result.score);
      setSubmitted(true);
      
    } catch (err: any) {
      console.error('Ошибка при сохранении:', err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Не удалось сохранить результат');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < (assignment?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', color: '#666' }}>Загрузка теста...</div>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>Тест уже пройден</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '16px' }}>
              Ваш результат: <strong style={{ fontSize: '32px', color: '#2f70d2' }}>{existingScore}</strong>%
            </p>
            <Link to={`/course/${courseId}/lesson/${lessonId}`}>
              <button style={{
                padding: '12px 32px',
                backgroundColor: '#2f70d2',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                Вернуться к уроку
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2>{error}</h2>
          <Link to={`/course/${courseId}/lesson/${lessonId}`}>
            <button style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#2f70d2', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>
              Вернуться к уроку
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <h2>Тест не найден</h2>
          <Link to={`/course/${courseId}/lesson/${lessonId}`}>
            <button style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#2f70d2', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>
              Вернуться к уроку
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>Тест завершён!</h1>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '16px' }}>
              Ваш результат: <strong style={{ fontSize: '32px', color: '#2f70d2' }}>{score}</strong>%
            </p>
            <Link to={`/course/${courseId}/lessons`}>
              <button style={{
                padding: '12px 32px',
                backgroundColor: '#2f70d2',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                Вернуться к курсу
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = assignment.questions[currentQuestion];
  const isLastQuestion = currentQuestion === assignment.questions.length - 1;

  return (
    <div style={{ background: '#e8f0fe', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Прогресс */}
        <div style={{ marginBottom: '24px' }}>
          <Link to={`/course/${courseId}/lesson/${lessonId}`} style={{ color: '#2f70d2', textDecoration: 'none' }}>
            ← Назад к уроку
          </Link>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          {/* Заголовок */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '8px' }}>
              {assignment.title}
            </h1>
            <p style={{ color: '#666' }}>{assignment.description}</p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #eee'
            }}>
              <span style={{ color: '#888', fontSize: '14px' }}>
                Вопрос {currentQuestion + 1} из {assignment.questions.length}
              </span>
              <span style={{ color: '#888', fontSize: '14px' }}>
                Макс. балл: {assignment.maxScore}
              </span>
            </div>
          </div>

          {/* Вопрос */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
              {currentQ.text}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentQ.answers.map(answer => (
                <label
                  key={answer.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 20px',
                    backgroundColor: userAnswers[currentQ.id] === answer.id ? '#e8f0fe' : '#f8f9fa',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: userAnswers[currentQ.id] === answer.id ? '1px solid #2f70d2' : '1px solid #e0e0e0'
                  }}
                >
                  <input
                    type="radio"
                    name={`question_${currentQ.id}`}
                    value={answer.id}
                    checked={userAnswers[currentQ.id] === answer.id}
                    onChange={() => handleAnswerSelect(currentQ.id, answer.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ color: '#333', fontSize: '15px' }}>{answer.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Навигация между вопросами */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <button
              onClick={goToPrevQuestion}
              disabled={currentQuestion === 0}
              style={{
                padding: '12px 24px',
                backgroundColor: currentQuestion > 0 ? '#e8f0fe' : '#f0f0f0',
                color: currentQuestion > 0 ? '#2f70d2' : '#999',
                border: 'none',
                borderRadius: '30px',
                cursor: currentQuestion > 0 ? 'pointer' : 'default',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              ← Назад
            </button>
            
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Отправка...' : 'Отправить ответы'}
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#2f70d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Далее →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};