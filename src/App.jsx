import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import PresentationPage from './pages/PresentationPage'
import HomeworkPage from './pages/HomeworkPage'
import QuizPage from './pages/QuizPage'
import CertificatePage from './pages/CertificatePage'
import BoardPage from './pages/BoardPage'
import IntroScreen from './components/IntroScreen'
import PresenterScript from './pages/PresenterScript'

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
  const navigate = useNavigate()

  useEffect(() => {
    // 앱 시작 시 sentinel 항목 삽입 — 뒤로가기가 앱 밖으로 나가는 것을 방지
    window.history.pushState({ liraApp: true }, '', window.location.href)

    const handlePop = (e) => {
      // React Router 항목은 state.key 를 갖고, 우리 sentinel 은 liraApp 을 가짐
      // 둘 다 없으면 앱 시작 이전 외부 항목 → 메인으로 돌려보냄
      if (!e.state || (!e.state.key && !e.state.liraApp)) {
        navigate('/')
      }
    }

    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [navigate])

  if (!entered) return <IntroScreen onEnter={() => setEntered(true)} />

  return (
    <Routes>
      <Route path="/" element={<PresentationPage onGoIntro={() => setEntered(false)} />} />
      <Route path="/homework" element={<HomeworkPage />} />
      <Route path="/quiz" element={<RequireStudent><QuizPage /></RequireStudent>} />
      <Route path="/certificate" element={<RequireQuiz><CertificatePage /></RequireQuiz>} />
      <Route path="/board" element={<RequireQuiz><BoardPage /></RequireQuiz>} />
      <Route path="/lira-presenter-only-2026" element={<PresenterScript />} />
    </Routes>
  )
}
