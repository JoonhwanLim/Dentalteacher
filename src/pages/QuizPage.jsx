import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import questions from '../data/quiz.json'

const LETTERS = ['①', '②', '③', '④']

export default function QuizPage() {
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()
  const studentName = sessionStorage.getItem('studentName')

  const q = questions[qIdx]
  const answered = selected !== null
  const isCorrect = selected === q.answer

  function handleSelect(idx) {
    if (answered) return
    setSelected(idx)
    if (idx === q.answer) setScore(s => s + 1)
  }

  async function handleNext() {
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1)
      setSelected(null)
    } else {
      const finalScore = isCorrect ? score + 1 : score
      sessionStorage.setItem('quizCompleted', 'true')
      sessionStorage.setItem('quizScore', finalScore)

      await api.quizResults.insert(studentName, finalScore, questions.length)

      navigate('/certificate')
    }
  }

  const progress = ((qIdx + (answered ? 1 : 0)) / questions.length) * 100

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <img src="/logo2.png" alt="리라" className="quiz-logo" />
        <div className="quiz-progress-wrap">
          <p className="quiz-progress-label">
            {studentName} · {qIdx + 1} / {questions.length}
          </p>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="quiz-card">
        <span className="quiz-num">문제 {qIdx + 1}</span>
        <span className="quiz-emoji">{q.emoji}</span>
        <p className="quiz-question">{q.question}</p>

        <div className="quiz-options">
          {q.options.map((opt, i) => {
            let cls = 'quiz-option'
            if (answered) {
              if (i === q.answer) cls += ' revealed'
              else if (i === selected && !isCorrect) cls += ' wrong'
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={answered}>
                <span className="opt-letter">{LETTERS[i]}</span>
                {opt}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className={`quiz-feedback ${!isCorrect ? 'wrong-fb' : ''}`}>
            {isCorrect ? '🎉 정답이에요! ' : '😅 아쉬워요! '}
            {q.explanation}
          </div>
        )}

        {answered && (
          <button className="btn-yellow" style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleNext}>
            {qIdx < questions.length - 1 ? '다음 문제 →' : '결과 보기 🎓'}
          </button>
        )}
      </div>
    </div>
  )
}
