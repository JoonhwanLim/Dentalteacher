import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import CavityGame from '../components/CavityGame'

export default function BoardPage() {
  const [tab, setTab] = useState('comment')
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [showWarning, setShowWarning] = useState(
    !sessionStorage.getItem('boardWarningDismissed')
  )
  const navigate = useNavigate()
  const studentName = sessionStorage.getItem('studentName') || '학생'

  function dismissWarning() {
    sessionStorage.setItem('boardWarningDismissed', '1')
    setShowWarning(false)
  }

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
      {showWarning && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.65)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:999, padding:20,
        }}>
          <div style={{
            background:'white', borderRadius:20, padding:'36px 28px',
            maxWidth:380, width:'100%', textAlign:'center',
            boxShadow:'0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontSize:'2.8rem', marginBottom:8 }}>📹</div>
            <div style={{
              display:'inline-block', background:'#E53935', color:'white',
              fontSize:'0.7rem', fontWeight:900, padding:'3px 10px',
              borderRadius:4, letterSpacing:2, marginBottom:16,
            }}>● LIVE  실시간 모니터링</div>

            <h2 style={{ fontSize:'1.3rem', fontWeight:900, marginBottom:12, color:'#1A1A1A' }}>
              모든 댓글은 시스템에<br/>로그가 기록됩니다
            </h2>

            <div style={{
              background:'#FFF3CD', border:'1.5px solid #FFC107',
              borderRadius:12, padding:'14px 16px', marginBottom:20,
              fontSize:'0.9rem', color:'#7B4F00', lineHeight:1.7,
            }}>
              반드시 <strong style={{ fontSize:'1.05rem' }}>{studentName}</strong> 이름으로만<br/>
              댓글을 작성해야 합니다.
            </div>

            <button onClick={dismissWarning} style={{
              width:'100%', background:'#1A5C3A', color:'white',
              border:'none', borderRadius:50, padding:'14px',
              fontSize:'1rem', fontWeight:900, cursor:'pointer',
              fontFamily:'inherit',
            }}>
              알겠어요! 내 이름으로만 쓸게요 ✅
            </button>
          </div>
        </div>
      )}
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
        @keyframes cctvBlink {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 3px rgba(229,57,53,0.25); }
          50%  { opacity: 0.35; box-shadow: 0 0 0 3px rgba(229,57,53,0); }
        }
      `}</style>

      <div className="board-header">
        <div className="board-header-left">
          <img src="/logo2.png" alt="리라" className="board-logo" />
          <div>
            <p className="board-title">리라 초등학교 5학년 2반 명예교사</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
              <span style={{
                width:6, height:6, borderRadius:'50%', flexShrink:0,
                background:'#E53935', display:'inline-block',
                animation:'cctvBlink 1.4s ease-in-out infinite',
              }}/>
              <span className="board-student" style={{ margin:0 }}>{studentName}</span>
              <span style={{ fontSize:'0.7rem', color:'#bbb' }}>·</span>
              <span style={{ fontSize:'0.72rem', color:'#aaa', fontWeight:600, whiteSpace:'nowrap' }}>📹 모니터링 중</span>
            </div>
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
