import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PresentationPage from './pages/PresentationPage'
import HomeworkPage from './pages/HomeworkPage'
import QuizPage from './pages/QuizPage'
import CertificatePage from './pages/CertificatePage'
import BoardPage from './pages/BoardPage'
import IntroScreen from './components/IntroScreen'

function RequireStudent({ children }) {
  const name = sessionStorage.getItem('studentName')
  if (!name) return <Navigate to="/homework" replace />
  return children
}

function RequireQuiz({ children }) {
  const name = sessionStorage.getItem('studentName')
  const done = sessionStorage.getItem('quizCompleted')
  if (!name) return <Navigate to="/homework" replace />
  if (!done) return <Navigate to="/quiz" replace />
  return children
}

export default function App() {
  const [entered, setEntered] = useState(false)

  if (!entered) return <IntroScreen onEnter={() => setEntered(true)} />

  return (
    <Routes>
      <Route path="/" element={<PresentationPage />} />
      <Route path="/homework" element={<HomeworkPage />} />
      <Route path="/quiz" element={<RequireStudent><QuizPage /></RequireStudent>} />
      <Route path="/certificate" element={<RequireQuiz><CertificatePage /></RequireQuiz>} />
      <Route path="/board" element={<RequireQuiz><BoardPage /></RequireQuiz>} />
    </Routes>
  )
}
