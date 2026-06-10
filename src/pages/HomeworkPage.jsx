import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import students from '../data/students.json'

export default function HomeworkPage() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  function handleSelect(name) {
    setSelected(name)
  }

  function handleConfirm() {
    sessionStorage.setItem('studentName', selected)
    navigate('/board')
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
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            {localStorage.getItem(`completed_${selected}`) ? (
              <>
                {/* 이름 + 수료 뱃지 */}
                <div style={{ textAlign:'center', marginBottom:16 }}>
                  <div style={{ fontSize:'2.4rem', fontWeight:900, color:'#1A1A1A', lineHeight:1.1 }}>{selected}</div>
                  <div style={{ display:'inline-block', marginTop:8, background:'#E8F5E9', color:'#1A5C3A', fontSize:'0.78rem', fontWeight:800, padding:'4px 14px', borderRadius:20 }}>✅ 퀴즈 수료 완료</div>
                </div>

                {/* 경고 */}
                <div style={{ background:'#FFF3CD', border:'1.5px solid #FFC107', borderRadius:12, padding:'10px 14px', marginBottom:14, fontSize:'0.82rem', color:'#7B4F00', textAlign:'center', lineHeight:1.6 }}>
                  ⚠️ <strong>본인 이름으로만 접속해야 합니다</strong><br />
                  다른 사람 이름으로 접속하면 큰일남!!!!!
                </div>

                {/* 선택지 */}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <button className="btn-yellow" onClick={handleConfirm} style={{ width:'100%', justifyContent:'center' }}>
                    🎮 댓글 / 게임 참여하기
                  </button>
                  <div style={{ textAlign:'center', fontSize:'0.78rem', color:'#aaa' }}>점수가 마음에 안들면</div>
                  <button className="btn-cancel" onClick={handleRetake} style={{ width:'100%', justifyContent:'center' }}>
                    🔄 퀴즈 다시 풀기
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>내 이름이 맞나요?</h2>
                <p>
                  <span className="modal-name">{selected}</span>
                  본인의 이름만 접속해야합니다<br />
                  <strong>(경고: 다른 사람 이름 접속하면 큰일남!!!!!)</strong>
                </p>
                <div className="modal-actions">
                  <button className="btn-cancel" onClick={() => setSelected(null)}>
                    아니에요
                  </button>
                  <button className="btn-yellow" onClick={handleConfirm}>
                    맞아요! 시작하기 →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
