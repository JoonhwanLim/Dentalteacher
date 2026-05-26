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
    if (localStorage.getItem(`completed_${selected}`)) {
      navigate('/board')
    } else {
      navigate('/quiz')
    }
  }

  return (
    <div className="hw-page">
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
                  이미 퀴즈를 수료했어요!<br />
                  <strong>바로 참여할 수 있어요.</strong>
                </p>
                <div className="modal-actions">
                  <button className="btn-cancel" onClick={() => setSelected(null)}>
                    아니에요
                  </button>
                  <button className="btn-yellow" onClick={handleConfirm}>
                    바로 참여하기 →
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>내 이름이 맞나요?</h2>
                <p>
                  <span className="modal-name">{selected}</span>
                  이름은 비밀번호가 없어요.<br />
                  <strong>본인의 이름만 접속해야 합니다!</strong>
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
