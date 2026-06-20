import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Как по-шведски будет "Привет"?',
    options: ['Hej', 'God morgon', 'Hejdå', 'Tack'],
    correct: 0
  },
  {
    id: 2,
    text: 'Что означает "Tack"?',
    options: ['Пока', 'Привет', 'Спасибо', 'Пожалуйста'],
    correct: 2
  },
  {
    id: 3,
    text: 'Как спросить "Как дела?" по-шведски?',
    options: ['Var är toaletten?', 'Hur mår du?', 'Vad heter du?', 'Jag heter...'],
    correct: 1
  },
  {
    id: 4,
    text: 'Что означает "Hejdå"?',
    options: ['Привет', 'Спасибо', 'Пока', 'Доброе утро'],
    correct: 2
  },
  {
    id: 5,
    text: 'Как сказать "Меня зовут..." по-шведски?',
    options: ['Jag kommer från...', 'Jag talar...', 'Jag heter...', 'Jag är...'],
    correct: 2
  }
];

export const QuickTest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Подсчёт результатов
      let correctCount = 0;
      newAnswers.forEach((answer, idx) => {
        if (answer === questions[idx].correct) correctCount++;
      });
      const finalScore = Math.round((correctCount / questions.length) * 100);
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setScore(0);
  };

  const handleEnroll = () => {
    if (!user) {
      alert('Для записи на курсы необходимо авторизоваться');
      navigate('/login');
      return;
    }
    navigate('/courses');
  };

  if (showResult) {
    let levelText = '';
    let levelColor = '';
    let recommendation = '';
    
    if (score >= 80) {
      levelText = 'Продвинутый (B2-C1)';
      levelColor = '#f44336';
      recommendation = 'Вам подойдут курсы уровня Advanced';
    } else if (score >= 60) {
      levelText = 'Средний (A2-B1)';
      levelColor = '#ff9800';
      recommendation = 'Вам подойдут курсы уровня Intermediate';
    } else if (score >= 40) {
      levelText = 'Начинающий (A1)';
      levelColor = '#4caf50';
      recommendation = 'Вам подойдут курсы уровня Beginner';
    } else {
      levelText = 'Начальный (A0)';
      levelColor = '#2196f3';
      recommendation = 'Рекомендуем начать с вводного курса';
    }

    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Ваш результат</h2>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2f70d2', marginBottom: '8px' }}>
          {score}%
        </div>
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            backgroundColor: `${levelColor}20`,
            color: levelColor,
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            {levelText}
          </span>
        </div>
        <p style={{ color: '#666', marginBottom: '24px' }}>{recommendation}</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={handleRestart}
            style={{
              padding: '12px 24px',
              backgroundColor: '#e8f0fe',
              color: '#2f70d2',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Пройти заново
          </button>
          <button
            onClick={handleEnroll}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #2f70d2 0%, #27ace0 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Подобрать курс →
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>Вопрос {currentQuestion + 1} из {questions.length}</span>
          <span style={{ color: '#666', fontSize: '14px' }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            backgroundColor: '#2f70d2', 
            borderRadius: '4px',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '24px' }}>
        {currentQ.text}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentQ.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            style={{
              padding: '14px 20px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '15px',
              color: '#333'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e8f0fe';
              e.currentTarget.style.borderColor = '#2f70d2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};