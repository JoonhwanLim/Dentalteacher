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

  async function handleDelete(id) {
    if (!window.confirm('내 댓글을 삭제할까요?')) return
    const ok = await api.comments.remove(id, studentName)
    if (ok) setComments(prev => prev.filter(c => c.id !== id))
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
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: '2px solid #ddd', borderRadius: 50, padding: '8px 16px',
          fontSize: '0.85rem', color: '#888', fontFamily: 'inherit', cursor: 'pointer'
        }}>
          🏠 메인으로
        </button>
      </div>

      <div className="board-tabs">
        <button className={`board-tab ${tab === 'comment' ? 'active' : ''}`} onClick={() => setTab('comment')}>
          💬 댓글 쓰<span style={{ color:'#F5C800', fontSize:'1.2em', fontWeight:900 }}>리라</span>
        </button>
        <button className={`board-tab ${tab === 'game' ? 'active' : ''}`} onClick={() => setTab('game')}>
          🎮 충치 처치하<span style={{ color:'#F5C800', fontSize:'1.2em', fontWeight:900 }}>리라</span>
        </button>
      </div>

      <div className="board-content">
        {tab === 'comment' && (
          <div>
            <div style={{
              display:'flex', alignItems:'center', gap:10,
              background:'#FFF3CD', border:'1.5px solid #FFC107',
              borderRadius:12, padding:'10px 16px', marginBottom:12,
              fontSize:'0.82rem', color:'#7B4F00',
            }}>
              <span style={{ fontSize:'1.1rem', flexShrink:0 }}>🔴</span>
              <span>
                <strong>관리자 실시간 모니터링 중</strong> — 댓글은 반드시 <strong>본인 이름({studentName})</strong>으로만 작성해야 합니다.
                다른 사람의 이름으로 댓글 작성시 큰 문제가 될 수도 있습니다.
              </span>
            </div>
            <div className="comment-form">
              <div style={{ flex:1, position:'relative' }}>
                <input
                  className="comment-input"
                  value={text}
                  onChange={e => setText(e.target.value.slice(0, 60))}
                  onKeyDown={e => e.key === 'Enter' && handlePost()}
                  placeholder="오늘 배운 것 중 가장 신기했던 것은?"
                  maxLength={60}
                  style={{ width:'100%' }}
                />
                <span style={{
                  position:'absolute', right:10, bottom:6,
                  fontSize:'0.7rem', color: text.length >= 55 ? '#E74C3C' : '#bbb',
                  fontWeight: text.length >= 55 ? 700 : 400,
                  pointerEvents:'none',
                }}>{text.length}/60</span>
              </div>
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
                    {c.student_name === studentName && (
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{
                          marginLeft:'auto', background:'none', border:'none',
                          color:'#ccc', fontSize:'0.75rem', cursor:'pointer',
                          padding:'2px 6px', borderRadius:6,
                          transition:'color 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.color='#E74C3C'}
                        onMouseLeave={e => e.target.style.color='#ccc'}
                        title="내 댓글 삭제"
                      >
                        🗑 삭제
                      </button>
                    )}
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
