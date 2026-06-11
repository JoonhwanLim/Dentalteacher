import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import students from '../data/students.json'
import { api } from '../lib/api'

export default function HomeworkPage() {
  const [selected, setSelected] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [checking, setChecking] = useState(false)
  const navigate = useNavigate()

  async function handleSelect(name) {
    setSelected(name)
    setChecking(true)
    const result = await api.quizResults.isCompleted(name)
    const dbCompleted = result.completed
    if (dbCompleted) {
      localStorage.setItem(`completed_${name}`, '1')
      sessionStorage.setItem('quizCompleted', '1')
      sessionStorage.setItem('quizScore', String(result.score ?? 0))
    }
    setCompleted(dbCompleted || !!localStorage.getItem(`completed_${name}`))
    setChecking(false)
  }

  function handleViewCert() {
    sessionStorage.setItem('studentName', selected)
    navigate('/certificate')
  }

  function handleGoBoard() {
    sessionStorage.setItem('studentName', selected)
    sessionStorage.setItem('quizCompleted', '1')
    navigate('/board')
  }

  function handleStartQuiz() {
    sessionStorage.setItem('studentName', selected)
    navigate('/quiz')
  }

  function handleRetake() {
    sessionStorage.setItem('studentName', selected)
    localStorage.removeItem(`completed_${selected}`)
    sessionStorage.removeItem('quizCompleted')
    sessionStorage.removeItem('quizScore')
    navigate('/quiz')
  }

  return (
    <div className="hw-page">
      <button onClick={() => navigate('/')} style={{
        position:'absolute', top:16, left:16,
        background:'rgba(0,0,0,0.07)', border:'none', borderRadius:50,
        padding:'8px 16px', fontSize:'0.82rem', fontWeight:700,
        cursor:'pointer', fontFamily:'inherit', color:'#555',
      }}>← 메인으로</button>
      <img src="/logo2.png" alt="리라" className="hw-logo" />
      <p className="hw-school">리라초등학교 5학년 2반</p>
      <h1 className="hw-title">내 이름을 찾아요! 🦷</h1>
      <p className="hw-subtitle">아래에서 본인의 이름을 클릭하세요</p>

      <div className="student-grid">
        {students.map((name) => (
          <button key={name} className="student-btn" onClick={() => handleSelect(name)}>
            {name}
          </button>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => { setSelected(null); setCompleted(false) }}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding:'36px 32px 28px' }}>
            {checking ? (
              <div style={{ textAlign:'center', padding:'32px 0', color:'#bbb', fontSize:'0.9rem' }}>
                확인 중…
              </div>
            ) : completed ? (
              <>
                <div style={{ textAlign:'center', marginBottom:24 }}>
                  <div style={{
                    width:68, height:68, borderRadius:'50%',
                    background:'linear-gradient(135deg, #FFE066, #FFC107)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.7rem', fontWeight:900, color:'#7B4F00',
                    margin:'0 auto 14px',
                  }}>{selected.charAt(0)}</div>
                  <div style={{ fontSize:'1.7rem', fontWeight:900, color:'#1A1A1A', lineHeight:1.2 }}>{selected}</div>
                  <button onClick={handleViewCert} style={{
                    display:'inline-flex', alignItems:'center', gap:5, marginTop:8,
                    background:'#E8F5E9', color:'#2E7D32',
                    fontSize:'0.72rem', fontWeight:800, padding:'3px 12px', borderRadius:20,
                    border:'none', cursor:'pointer', fontFamily:'inherit',
                  }}>✅ 퀴즈 수료 완료</button>
                </div>

                <div style={{ borderTop:'1px solid #f0f0f0', margin:'0 -32px 22px' }} />

                <button className="btn-yellow" onClick={handleGoBoard}
                  style={{ width:'100%', justifyContent:'center', fontSize:'1rem', padding:'14px' }}>
                  댓글 쓰고 게임 하러 가기 →
                </button>

                <div style={{ textAlign:'center', marginTop:16 }}>
                  <button onClick={handleRetake} style={{
                    background:'none', border:'none', color:'#bbb',
                    fontSize:'0.78rem', cursor:'pointer',
                    textDecoration:'underline', fontFamily:'inherit', padding:0,
                  }}>퀴즈 다시 풀기</button>
                </div>

                <p style={{ textAlign:'center', color:'#E53935', fontSize:'0.68rem', marginTop:14, lineHeight:1.5, marginBottom:0, fontWeight:700 }}>
                  반드시 본인 이름으로만 접속하세요
                </p>
              </>
            ) : (
              <>
                <div style={{ textAlign:'center', marginBottom:22 }}>
                  <div style={{ fontSize:'0.82rem', color:'#aaa', marginBottom:10, fontWeight:600 }}>
                    내 이름이 맞나요?
                  </div>
                  <div style={{ fontSize:'2.2rem', fontWeight:900, color:'#1A1A1A', lineHeight:1.1 }}>
                    {selected}
                  </div>
                </div>

                <div style={{ borderTop:'1px solid #f0f0f0', margin:'0 -32px 22px' }} />

                <div style={{ display:'flex', gap:10 }}>
                  <button className="btn-cancel"
                    onClick={() => { setSelected(null); setCompleted(false) }}
                    style={{ flex:1, justifyContent:'center', padding:'13px 0' }}>
                    아니에요
                  </button>
                  <button className="btn-yellow" onClick={handleStartQuiz}
                    style={{ flex:2, justifyContent:'center', padding:'13px 0' }}>
                    맞아요! 시작하기 →
                  </button>
                </div>

                <p style={{ textAlign:'center', color:'#E53935', fontSize:'0.68rem', marginTop:14, lineHeight:1.5, marginBottom:0, fontWeight:700 }}>
                  반드시 본인 이름으로만 접속하세요
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
