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
                <h2>반가워요! 🎉</h2>
                <p>
                  <span className="modal-name">{selected}</span>
                  님은 이미 퀴즈를 수료했어요!<br /><br />
                  점수가 마음에 안 들면 <strong>다시 도전</strong>할 수 있어요 🔄<br />
                  아니면 <strong>댓글을 쓰거나 게임</strong>을 즐겨요 🎮
                </p>
                <div className="modal-actions" style={{ flexDirection:'column', gap:8 }}>
                  <button className="btn-yellow" onClick={handleConfirm}>
                    댓글 / 게임 참여하기 🎮
                  </button>
                  <button className="btn-cancel" onClick={handleRetake}>
                    퀴즈 다시 풀기 🔄
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
