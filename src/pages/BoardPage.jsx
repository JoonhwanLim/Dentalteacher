import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import CavityGame from '../components/CavityGame'

export default function BoardPage() {
  const [tab, setTab] = useState('comment')
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const navigate = useNavigate()
  const studentName = sessionStorage.getItem('studentName') || '학생'

  useEffect(() => {
    fetchComments()
    const timer = setInterval(fetchComments, 5000)
    return () => clearInterval(timer)
  }, [])

  async function fetchComments() {
    const data = await api.comments.list()
    setComments(data)
  }

  async function handlePost() {
    if (!text.trim() || posting) return
    setPosting(true)
    const newComment = await api.comments.insert(studentName, text.trim())
    if (newComment) setComments(prev => [newComment, ...prev])
    setText('')
    setPosting(false)
  }

  function formatTime(ts) {
    const d = new Date(ts)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="board-page">
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -130%) scale(0.9); }
        }
        @keyframes popIn {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          70% { transform: translate(-50%, -50%) scale(1.15); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes brushScrub {
          0%   { transform: translate(-50%, calc(-50% - 12px)); opacity: 1; }
          28%  { transform: translate(-50%, calc(-50% + 9px)); }
          55%  { transform: translate(-50%, calc(-50% - 6px)); }
          78%  { transform: translate(-50%, calc(-50% + 4px)); opacity: 0.8; }
          100% { transform: translate(-50%, -50%); opacity: 0; }
        }
      `}</style>

      <div className="board-header">
        <div className="board-header-left">
          <img src="/logo2.png" alt="리라" className="board-logo" />
          <div>
            <p className="board-title">리라 초등학교 5학년 2반 명예교사</p>
            <p className="board-student">접속 중: {studentName}</p>
          </div>
        </div>
        <button onClick={() => navigate('/homework')} style={{
          background: 'none', border: '2px solid #ddd', borderRadius: 50, padding: '8px 16px',
          fontSize: '0.85rem', color: '#888', fontFamily: 'inherit', cursor: 'pointer'
        }}>
          이름 변경
        </button>
      </div>

      <div className="board-tabs">
        <button className={`board-tab ${tab === 'comment' ? 'active' : ''}`} onClick={() => setTab('comment')}>
          💬 댓글 게시판
        </button>
        <button className={`board-tab ${tab === 'game' ? 'active' : ''}`} onClick={() => setTab('game')}>
          🎮 충치 처치하리라
        </button>
      </div>

      <div className="board-content">
        {tab === 'comment' && (
          <div>
            <div className="comment-form">
              <input
                className="comment-input"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePost()}
                placeholder="오늘 배운 것 중 가장 신기했던 것은?"
                maxLength={100}
              />
              <button className="btn-yellow" onClick={handlePost} disabled={posting || !text.trim()}>
                {posting ? '...' : '올리기'}
              </button>
            </div>

            <div className="comment-list">
              {comments.length === 0 && (
                <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
                  첫 번째 댓글을 남겨보세요! 🦷
                </div>
              )}
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-meta">
                    <span className="comment-author">🦷 {c.student_name}</span>
                    <span className="comment-time">{formatTime(c.created_at)}</span>
                  </div>
                  <p className="comment-text">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'game' && <CavityGame studentName={studentName} />}
      </div>
    </div>
  )
}
