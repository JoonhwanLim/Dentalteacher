import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CertificatePage() {
  const navigate = useNavigate()
  const studentName = sessionStorage.getItem('studentName') || '학생'

  useEffect(() => {
    if (studentName !== '학생') {
      localStorage.setItem(`completed_${studentName}`, 'true')
    }
  }, [])
  const score = sessionStorage.getItem('quizScore') || '0'
  const today = new Date()
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`

  return (
    <div className="cert-page">
      <div className="cert-wrap" id="certificate">
        <div className="cert-top-bar" />
        <div className="cert-inner">
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, marginBottom:28 }}>
            <img src="/logo2.png" alt="리라" className="cert-logo" />
            <div className="cert-badge">CERTIFICATE</div>
          </div>
          <h1 className="cert-title">수료증</h1>
          <div className="cert-body">
            <p>리라초등학교 5학년 2반</p>
            <p className="cert-name">{studentName} 어린이</p>
            <p>는 치과 명예교사 수업에 성실히 참여하고</p>
            <p>퀴즈 10문제 중 <strong>{score}문제</strong>를 맞혔습니다.</p>
          </div>
          <div className="cert-divider" />
          <div className="cert-bottom">
            <p className="cert-date">{dateStr}</p>
            <p className="cert-sign">🦷 치과 명예교사 드림</p>
          </div>
        </div>
        <div className="cert-bot-bar" />
      </div>

      <div className="cert-actions">
        <button className="btn-green" onClick={() => window.print()}>
          🖨️ 수료증 인쇄하기
        </button>
        <button className="btn-yellow" onClick={() => navigate('/board')}>
          댓글 쓰고 게임하기 🎮
        </button>
      </div>
    </div>
  )
}
