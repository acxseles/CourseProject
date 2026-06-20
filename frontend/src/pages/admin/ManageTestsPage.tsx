import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { apiClient } from '../../shared/api/client';
import toast from 'react-hot-toast';

interface QuestionForm {
  text: string;
  questionType: string;
  expectedAnswer?: string; // ← добавить для письменных вопросов
  answers: AnswerForm[];
}

interface AnswerForm {
  text: string;
  isCorrect: boolean;
}

export const ManageTestsPage = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingTest, setExistingTest] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maxScore: 100,
    questions: [] as QuestionForm[]
  });

  useEffect(() => {
  const fetchExistingTest = async () => {
    try {
      const response = await apiClient.get(`/tests/lesson/${lessonId}`);
      if (response.data) {
        setExistingTest(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description || '',
          maxScore: response.data.maxScore,
          questions: response.data.questions.map((q: any) => ({
            text: q.text,
            questionType: q.questionType,
            expectedAnswer: q.expectedAnswer || '',
            answers: q.answers.map((a: any) => ({
              text: a.text,
              isCorrect: a.isCorrect || false
            }))
          }))
        });
      }
    } catch (err) {
      console.log('Тест не найден, создаём новый');
    }
  };
  fetchExistingTest();
}, [lessonId]);

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: '',
          questionType: 'MultipleChoice',
          answers: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ]
        }
      ]
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index: number, field: string, value: string) => {
  const newQuestions = [...formData.questions];
  newQuestions[index] = { ...newQuestions[index], [field]: value };
  setFormData({ ...formData, questions: newQuestions });
};

  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers.push({ text: '', isCorrect: false });
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers.splice(answerIndex, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateAnswer = (questionIndex: number, answerIndex: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers[answerIndex] = {
      ...newQuestions[questionIndex].answers[answerIndex],
      [field]: value
    };
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleDeleteTest = async () => {
  if (!confirm('Удалить тест?')) return;
  try {
    await apiClient.delete(`/tests/${existingTest.id}`);
    toast.success('Тест удалён');
    navigate(`/course/${courseId}/lessons`);
  } catch (err) {
    console.error('Ошибка:', err);
    toast.success('Ошибка при удалении');
  }
};
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Валидация
  for (let i = 0; i < formData.questions.length; i++) {
    const q = formData.questions[i];
    if (!q.text.trim()) {
      alert(`Вопрос ${i + 1}: введите текст вопроса`);
      return;
    }
    
    if (q.questionType === 'MultipleChoice') {
      const hasCorrect = q.answers.some(a => a.isCorrect);
      if (!hasCorrect) {
        alert(`Вопрос ${i + 1}: отметьте хотя бы один правильный ответ`);
        return;
      }
      for (let j = 0; j < q.answers.length; j++) {
        if (!q.answers[j].text.trim()) {
          alert(`Вопрос ${i + 1}, ответ ${j + 1}: введите текст ответа`);
          return;
        }
      }
    } else if (q.questionType === 'Written') {
      if (!q.expectedAnswer?.trim()) {
        alert(`Вопрос ${i + 1}: введите ожидаемый ответ или ключевые слова`);
        return;
      }
    }
  }

  try {
    setLoading(true);
    
    const payload = {
      title: formData.title,
      description: formData.description,
      maxScore: formData.maxScore,
      questions: formData.questions.map(q => {
        if (q.questionType === 'MultipleChoice') {
          return {
            text: q.text,
            questionType: q.questionType,
            answers: q.answers.map(a => ({
              text: a.text,
              isCorrect: a.isCorrect
            }))
          };
        } else {
          return {
            text: q.text,
            questionType: q.questionType,
            expectedAnswer: q.expectedAnswer,
            answers: [] // для письменных вопросов ответов нет
          };
        }
      })
    };
    
    if (existingTest) {
      await apiClient.put(`/tests/${existingTest.id}`, payload);
      toast.success('Тест обновлён');
    } else {
      await apiClient.post(`/tests/lesson/${lessonId}`, payload);
      toast.success('Тест создан');
    }
    
    navigate(`/course/${courseId}/lessons`);
  } catch (err) {
    console.error('Ошибка:', err);
    toast.error('Не удалось сохранить тест');
  } finally {
    setLoading(false);
  }
};

  if (!user || (user.role !== 'Teacher' && user.role !== 'Admin')) {
    return <div>Доступ запрещён</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate(`/course/${courseId}/lessons`)}
          style={{ color: '#2f70d2', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Назад к урокам
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0A2F5A', marginBottom: '24px' }}>
          {existingTest ? 'Редактировать тест' : 'Создать тест для урока'}
        </h1>

        {existingTest && (
  <button
    onClick={handleDeleteTest}
    style={{
      backgroundColor: '#fee',
      color: 'red',
      border: 'none',
      borderRadius: '12px',
      padding: '8px 16px',
      cursor: 'pointer',
      marginLeft: '16px'
    }}
  >
    🗑️ Удалить тест
  </button>
)}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Название теста</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Максимальный балл</label>
            <input
              type="number"
              value={formData.maxScore}
              onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
              style={{ width: '200px', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
            />
          </div>

          <hr style={{ margin: '24px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Вопросы ({formData.questions.length})</h2>
            <button
              type="button"
              onClick={addQuestion}
              style={{ padding: '8px 16px', backgroundColor: '#2f70d2', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
            >
              + Добавить вопрос
            </button>
          </div>

          {formData.questions.map((question, qIndex) => (
  <div key={qIndex} style={{
    border: '1px solid #eee',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <h3 style={{ fontWeight: 'bold' }}>Вопрос {qIndex + 1}</h3>
      <button
        type="button"
        onClick={() => removeQuestion(qIndex)}
        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        Удалить
      </button>
    </div>

    {/* Текст вопроса */}
    <div style={{ marginBottom: '16px' }}>
      <input
        type="text"
        placeholder="Текст вопроса"
        value={question.text}
        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
        style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
      />
    </div>

    {/* Тип вопроса */}
    <div style={{ marginBottom: '16px' }}>
      <select
        value={question.questionType}
        onChange={(e) => updateQuestion(qIndex, 'questionType', e.target.value)}
        style={{ width: '200px', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
      >
        <option value="MultipleChoice">Вариантный ответ</option>
        <option value="Written">Письменный ответ</option>
      </select>
    </div>

    {/* Для письменного вопроса - поле ожидаемого ответа */}
    {question.questionType === 'Written' && (
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          Ожидаемый ответ (ключевые слова):
        </label>
        <textarea
          value={question.expectedAnswer || ''}
          onChange={(e) => updateQuestion(qIndex, 'expectedAnswer', e.target.value)}
          placeholder="Введите ожидаемый ответ или ключевые слова через запятую..."
          rows={2}
          style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ddd' }}
        />
        <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
          При проверке будут учитываться ключевые слова из этого поля
        </p>
      </div>
    )}

    {/* Для вариантного вопроса - варианты ответов */}
    {question.questionType === 'MultipleChoice' && (
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Варианты ответов:</label>
        {question.answers.map((answer, aIndex) => (
          <div key={aIndex} style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Текст ответа"
              value={answer.text}
              onChange={(e) => updateAnswer(qIndex, aIndex, 'text', e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                checked={answer.isCorrect}
                onChange={(e) => updateAnswer(qIndex, aIndex, 'isCorrect', e.target.checked)}
              />
              Правильный
            </label>
            <button
              type="button"
              onClick={() => removeAnswer(qIndex, aIndex)}
              style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addAnswer(qIndex)}
          style={{ marginTop: '8px', padding: '4px 12px', backgroundColor: '#e8f0fe', color: '#2f70d2', border: 'none', borderRadius: '16px', cursor: 'pointer' }}
        >
          + Добавить ответ
        </button>
      </div>
    )}
  </div>
))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#2f70d2',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Сохранение...' : (existingTest ? 'Обновить тест' : 'Создать тест')}
          </button>
        </form>
      </div>
    </div>
  );
};