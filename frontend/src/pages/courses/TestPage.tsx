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

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await apiClient.get(`/tests/lesson/${lessonId}`);
        setAssignment(response.data);
      } catch (err: any) {
        console.error('Ошибка загрузки теста:', err);
        
        // Если пользователь уже сдавал тест
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Загрузка теста...
      </div>
    );
  }

  // Если тест уже пройден
  if (alreadySubmitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
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
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Вернуться к уроку
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>{error}</h2>
        <Link to={`/course/${courseId}/lesson/${lessonId}`}>
          <button style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2f70d2', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
            Вернуться к уроку
          </button>
        </Link>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Тест не найден</h2>
        <Link to={`/course/${courseId}/lesson/${lessonId}`}>
          <button style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2f70d2', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
            Вернуться к уроку
          </button>
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
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
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Вернуться к курсу
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to={`/course/${courseId}/lesson/${lessonId}`} style={{ color: '#2f70d2', textDecoration: 'none' }}>
          ← Назад к уроку
        </Link>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '8px' }}>
          {assignment.title}
        </h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          {assignment.description}
        </p>
        <p style={{ color: '#888', marginBottom: '32px', fontSize: '14px' }}>
          Максимальный балл: {assignment.maxScore} | Вопросов: {assignment.questions.length}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {assignment.questions.map((question, qIndex) => (
            <div key={question.id} style={{
              borderTop: qIndex === 0 ? 'none' : '1px solid #eee',
              paddingTop: qIndex === 0 ? 0 : '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
                {qIndex + 1}. {question.text}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {question.answers.map(answer => (
                  <label
                    key={answer.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: userAnswers[question.id] === answer.id ? '#e8f0fe' : '#f9f9f9',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={answer.id}
                      checked={userAnswers[question.id] === answer.id}
                      onChange={() => handleAnswerSelect(question.id, answer.id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ color: '#333' }}>{answer.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            marginTop: '40px',
            padding: '14px',
            backgroundColor: '#2f70d2',
            color: 'white',
            border: 'none',
            borderRadius: '40px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: submitting ? 0.7 : 1
          }}
        >
          {submitting ? 'Отправка...' : 'Отправить ответы'}
        </button>
      </div>
    </div>
  );
};