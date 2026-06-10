import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../lib/api'

/* 16 고정 이빨 위치 (치아 아치 형태) */
const SLOTS = [
  // 위 아치 (좌→우, 중앙이 가장 높음)
  { id: 0,  x: 5,  y: 30 }, { id: 1,  x: 16, y: 21 }, { id: 2,  x: 28, y: 14 }, { id: 3,  x: 40, y: 10 },
  { id: 4,  x: 52, y: 10 }, { id: 5,  x: 64, y: 14 }, { id: 6,  x: 76, y: 21 }, { id: 7,  x: 87, y: 30 },
  // 아래 아치
  { id: 8,  x: 5,  y: 58 }, { id: 9,  x: 16, y: 67 }, { id: 10, x: 28, y: 73 }, { id: 11, x: 40, y: 77 },
  { id: 12, x: 52, y: 77 }, { id: 13, x: 64, y: 73 }, { id: 14, x: 76, y: 67 }, { id: 15, x: 87, y: 58 },
]

const CAVITY_TYPES = {
  small:  { label: '작은 충치', points: 100, spotR: 9,  spotFill: '#8B5E3C', prob: 0.50 },
  big:    { label: '큰 충치',   points: 200, spotR: 17, spotFill: '#5C3317', prob: 0.30 },
  black:  { label: '흑충치',    points: 300, spotR: 13, spotFill: '#111111', prob: 0.15 },
  golden: { label: '황금 충치', points: 500, spotR: 11, spotFill: '#B8860B', prob: 0.05 },
}

function pickType() {
  const r = Math.random()
  let acc = 0
  for (const [k, v] of Object.entries(CAVITY_TYPES)) {
    acc += v.prob
    if (r < acc) return k
  }
  return 'small'
}

/* 칫솔 커서 — PNG 파일 사용 (브리슬 끝이 클릭 포인트) */
const BRUSH_CURSOR = `url('/toothbrush-cursor.png') 28 4, crosshair`

/* 건강한 이빨 (배경) */
function HealthyTooth() {
  return (
    <svg viewBox="0 0 80 90" width="50" height="57" style={{ display: 'block' }}>
      <ellipse cx="27" cy="76" rx="10" ry="15" fill="#EAE3CC" />
      <ellipse cx="53" cy="76" rx="10" ry="15" fill="#EAE3CC" />
      <ellipse cx="40" cy="37" rx="32" ry="27" fill="#F5F1E8" stroke="#DDD5BE" strokeWidth="1.5" />
      <ellipse cx="29" cy="27" rx="7" ry="4" fill="white" opacity="0.4" transform="rotate(-22 29 27)" />
    </svg>
  )
}

/* 충치 이빨 (클릭 대상) */
function CavityTooth({ type }) {
  const t = CAVITY_TYPES[type]
  const isGold = type === 'golden'
  return (
    <svg viewBox="0 0 80 90" width="62" height="71"
      style={{ display: 'block', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.28))' }}>
      <ellipse cx="27" cy="76" rx="10" ry="15" fill={isGold ? '#FFC107' : '#EAE3CC'} />
      <ellipse cx="53" cy="76" rx="10" ry="15" fill={isGold ? '#FFC107' : '#EAE3CC'} />
      <ellipse cx="40" cy="37" rx="32" ry="27"
        fill={isGold ? '#FFD700' : '#F5F1E8'}
        stroke={isGold ? '#DAA520' : '#DDD5BE'} strokeWidth="2" />
      <ellipse cx="40" cy="35" rx={t.spotR} ry={t.spotR * 0.8} fill={t.spotFill} />
      <ellipse cx="29" cy="27" rx="7" ry="4" fill="white" opacity="0.42" transform="rotate(-22 29 27)" />
      {isGold && <text x="40" y="42" textAnchor="middle" fontSize="14" fill="#8B6914">★</text>}
    </svg>
  )
}

/* 클릭 시 칫솔질 이펙트 — 수평 칫솔, 브리슬이 아래로 향해 위아래 문지름 */
function BrushEffect({ x, y }) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      animation: 'brushScrub 0.42s ease-out forwards',
      zIndex: 25,
    }}>
      <svg viewBox="0 0 72 36" width="36" height="18">
        {/* 손잡이 */}
        <rect x="42" y="6" width="28" height="13" rx="6.5" fill="#4A90D9"/>
        {/* 손잡이 하이라이트/그립 */}
        <rect x="51" y="8" width="5" height="9" rx="2.5" fill="white" opacity="0.22"/>
        <rect x="61" y="8" width="5" height="9" rx="2.5" fill="white" opacity="0.22"/>
        {/* 목 */}
        <rect x="29" y="8.5" width="15" height="8" rx="3" fill="#7AB8E8"/>
        {/* 헤드 (흰색 배경, 테두리) */}
        <rect x="5" y="4" width="26" height="17" rx="3.5" fill="#EEF6FF" stroke="#4A90D9" strokeWidth="1.5"/>
        {/* 브리슬 (헤드 아래로, 두 색상 교차) */}
        <rect x="8"  y="20" width="3.5" height="11" rx="1.75" fill="#1A5C3A"/>
        <rect x="13" y="20" width="3.5" height="11" rx="1.75" fill="#1A5C3A"/>
        <rect x="18" y="20" width="3.5" height="11" rx="1.75" fill="#F5C800"/>
        <rect x="23" y="20" width="3.5" height="11" rx="1.75" fill="#F5C800"/>
        <rect x="27.5" y="20" width="3.5" height="11" rx="1.75" fill="#1A5C3A"/>
      </svg>
    </div>
  )
}

function FloatingScore({ value, x, y }) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      fontSize: '1.5rem', fontWeight: 900,
      color: value >= 300 ? '#DAA520' : '#1A5C3A',
      pointerEvents: 'none',
      animation: 'floatUp 0.9s ease forwards',
      zIndex: 20, whiteSpace: 'nowrap',
      textShadow: '0 2px 6px rgba(0,0,0,0.3)',
    }}>+{value}</div>
  )
}

export default function CavityGame({ studentName }) {
  const [phase, setPhase]         = useState('idle')
  const [score, setScore]         = useState(0)
  const [timeLeft, setTimeLeft]   = useState(30)
  const [cavities, setCavities]   = useState({})   // { slotId: { type, born, life } }
  const [floats, setFloats]       = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [saving, setSaving]       = useState(false)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [brushEffects, setBrushEffects] = useState([])
  const [myAttempts, setMyAttempts] = useState(0)

  const timerRef  = useRef(null)
  const spawnRef  = useRef(null)
  const cleanRef  = useRef(null)
  const scoreRef  = useRef(0)   // 항상 최신 점수 추적

  const ATTEMPT_LIMIT = 20

  const fetchLeaderboard = useCallback(async () => {
    const data = await api.gameScores.leaderboard(studentName)
    setLeaderboard(data.leaderboard ?? [])
    setMyAttempts(data.myAttempts ?? 0)
  }, [studentName])

  useEffect(() => { fetchLeaderboard() }, [fetchLeaderboard])

  function startGame() {
    if (myAttempts >= ATTEMPT_LIMIT) return
    scoreRef.current = 0
    setScore(0)
    setTimeLeft(30)
    setCavities({})
    setFloats([])
    setBrushEffects([])
    setIsNewRecord(false)
    setMyAttempts(n => n + 1)
    setPhase('playing')
  }

  /* 게임 루프 */
  useEffect(() => {
    if (phase !== 'playing') return

    // 1초 타이머
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setPhase('result'); return 0 }
        return t - 1
      })
    }, 1000)

    // 충치 스폰
    spawnRef.current = setInterval(() => {
      setCavities(prev => {
        const now = Date.now()
        const active = Object.fromEntries(
          Object.entries(prev).filter(([_, c]) => now - c.born < c.life)
        )
        const occupied = new Set(Object.keys(active).map(Number))
        const empty = SLOTS.filter(s => !occupied.has(s.id))
        if (empty.length === 0 || Object.keys(active).length >= 5) return active

        const count = Math.min(Math.random() < 0.45 ? 2 : 1, empty.length)
        const next = { ...active }
        const shuffled = [...empty].sort(() => Math.random() - 0.5)
        for (let i = 0; i < count; i++) {
          if (!shuffled[i]) break
          next[shuffled[i].id] = { type: pickType(), born: now, life: 1800 + Math.random() * 700 }
        }
        return next
      })
    }, 750)

    // 만료 정리
    cleanRef.current = setInterval(() => {
      const now = Date.now()
      setCavities(prev =>
        Object.fromEntries(Object.entries(prev).filter(([_, c]) => now - c.born < c.life))
      )
    }, 200)

    return () => {
      clearInterval(timerRef.current)
      clearInterval(spawnRef.current)
      clearInterval(cleanRef.current)
    }
  }, [phase])

  /* 게임 종료 → 저장 */
  useEffect(() => {
    if (phase !== 'result') return
    clearInterval(timerRef.current)
    clearInterval(spawnRef.current)
    clearInterval(cleanRef.current)
    setCavities({})
    saveScore()
  }, [phase])

  /* 최고점수만 저장 */
  async function saveScore() {
    setSaving(true)
    const finalScore = scoreRef.current
    const result = await api.gameScores.upsert(studentName, finalScore)
    if (result.updated) setIsNewRecord(true)
    await fetchLeaderboard()
    setSaving(false)
  }

  /* 이빨 클릭 */
  function handleClick(slotId) {
    if (phase !== 'playing') return
    const cavity = cavities[slotId]
    if (!cavity) return

    const pts = CAVITY_TYPES[cavity.type].points
    setScore(s => {
      const next = s + pts
      scoreRef.current = next
      return next
    })

    setCavities(prev => { const n = { ...prev }; delete n[slotId]; return n })

    const slot = SLOTS.find(s => s.id === slotId)
    const fid = Date.now() + Math.random()
    setFloats(prev => [...prev, { id: fid, value: pts, x: slot.x, y: slot.y }])
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== fid)), 900)

    const bid = fid + 0.5
    setBrushEffects(prev => [...prev, { id: bid, x: slot.x, y: slot.y }])
    setTimeout(() => setBrushEffects(prev => prev.filter(b => b.id !== bid)), 480)
  }

  /* ── IDLE 화면 ── */
  if (phase === 'idle') {
    return (
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🦷</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 8 }}>충치 처치하리라!</h2>
            <p style={{ color: '#666', lineHeight: 1.7, marginBottom: 16, fontSize: '0.95rem' }}>
              이빨 위에 나타나는 충치를 30초 안에 클릭하세요!<br/>
              충치 종류마다 점수가 달라요.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
              {Object.entries(CAVITY_TYPES).map(([key, t]) => (
                <div key={key} style={{ textAlign: 'center', background: '#f9f9f9', borderRadius: 12, padding: '10px 14px' }}>
                  <CavityTooth type={key} />
                  <div style={{ color: '#1A5C3A', fontWeight: 900, fontSize: '1rem', marginTop: 4 }}>+{t.points}</div>
                  <div style={{ color: '#888', fontSize: '0.76rem' }}>{t.label}</div>
                </div>
              ))}
            </div>
            {myAttempts >= ATTEMPT_LIMIT ? (
              <div style={{ background:'#FFF3CD', border:'1.5px solid #FFC107', borderRadius:14, padding:'14px 20px', color:'#7B4F00', fontWeight:700, fontSize:'0.95rem' }}>
                🚫 오늘 게임 참여 횟수({ATTEMPT_LIMIT}회)를 모두 사용했어요!<br />
                <span style={{ fontWeight:400, fontSize:'0.85rem' }}>선생님께 도움을 요청하세요.</span>
              </div>
            ) : (
              <>
                <div style={{ color:'#aaa', fontSize:'0.82rem', marginBottom:10 }}>
                  남은 도전 횟수: <strong style={{ color: myAttempts >= 40 ? '#E74C3C' : '#1A5C3A' }}>{ATTEMPT_LIMIT - myAttempts}회</strong>
                </div>
                <button className="btn-yellow" style={{ fontSize: '1.2rem', padding: '16px 44px' }} onClick={startGame}>
                  게임 시작! 🎮
                </button>
              </>
            )}
          </div>
        </div>
        <Leaderboard data={leaderboard} studentName={studentName} />
      </div>
    )
  }

  /* ── PLAYING 화면 ── */
  if (phase === 'playing') {
    const pct = (timeLeft / 30) * 100
    const timerColor = timeLeft > 10 ? '#1A5C3A' : '#e53935'
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>
            점수: <span style={{ color: '#1A5C3A', fontSize: '2rem' }}>{score}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#e0e0e0" strokeWidth="5" />
              <circle cx="28" cy="28" r="24" fill="none" stroke={timerColor} strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - pct / 100)}`}
                strokeLinecap="round" transform="rotate(-90 28 28)"
                style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              <text x="28" y="33" textAnchor="middle" fontSize="16" fontWeight="900" fill={timerColor}>{timeLeft}</text>
            </svg>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>초</span>
          </div>
        </div>

        {/* 게임 영역: 핑크 잇몸 배경 + 고정 이빨 위치 */}
        <div style={{
          position: 'relative', width: '100%', height: 430,
          background: 'linear-gradient(180deg, #FFD6DC 0%, #FFB3BF 42%, #FFB3BF 58%, #FFD6DC 100%)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          border: '2px solid #FFC0CB',
          cursor: BRUSH_CURSOR,
        }}>
          {/* 중간 선 (위/아래 잇몸 구분) */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: '44%', height: 3, background: 'rgba(200,100,120,0.3)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: '56%', height: 3, background: 'rgba(200,100,120,0.3)' }} />

          {/* 배경: 건강한 이빨 16개 */}
          {SLOTS.map(slot => (
            <div key={slot.id} style={{
              position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none', opacity: 0.75,
            }}>
              <HealthyTooth />
            </div>
          ))}

          {/* 충치 오버레이 (클릭 가능) */}
          {SLOTS.map(slot => {
            const cavity = cavities[slot.id]
            if (!cavity) return null
            return (
              <button key={`c${slot.id}`}
                onClick={() => handleClick(slot.id)}
                style={{
                  position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'none', border: 'none', cursor: 'inherit', padding: 0,
                  animation: 'popIn 0.25s ease', zIndex: 5,
                }}>
                <CavityTooth type={cavity.type} />
              </button>
            )
          })}

          {/* 칫솔질 이펙트 */}
          {brushEffects.map(b => <BrushEffect key={b.id} {...b} />)}

          {/* 점수 팝업 */}
          {floats.map(f => <FloatingScore key={f.id} {...f} />)}
        </div>

        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.82rem', marginTop: 8 }}>
          이빨 위에 나타나는 충치를 클릭하세요! ⭐ 황금 충치는 +500점!
        </p>
      </div>
    )
  }

  /* ── RESULT 화면 ── */
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 12 }}>{isNewRecord ? '🏆' : '🎉'}</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 6 }}>게임 종료!</h2>
          <p style={{ color: '#888', marginBottom: 12 }}>{studentName} 어린이의 최종 점수</p>
          <div style={{ fontSize: '4rem', fontWeight: 900, color: '#1A5C3A', marginBottom: 4 }}>{score}</div>
          <div style={{ fontSize: '1rem', color: '#aaa', marginBottom: 20 }}>점</div>

          {saving && <p style={{ color: '#aaa', marginBottom: 16 }}>점수 저장 중...</p>}

          {!saving && isNewRecord && (
            <div style={{ background: '#FFFBEA', border: '2px solid #F5C800', borderRadius: 12, padding: '12px 20px', marginBottom: 20, fontWeight: 700, fontSize: '1rem', color: '#1A5C3A' }}>
              🏆 새 최고 기록! 명예의 전당에 올랐어요!
            </div>
          )}
          {!saving && !isNewRecord && (
            <div style={{ background: '#f5f5f5', borderRadius: 12, padding: '12px 20px', marginBottom: 20, fontSize: '0.9rem', color: '#888' }}>
              이전 기록이 더 높아요. 계속 도전해봐요! 💪
            </div>
          )}

          {myAttempts >= ATTEMPT_LIMIT ? (
            <div style={{ background:'#FFF3CD', border:'1.5px solid #FFC107', borderRadius:14, padding:'12px 18px', color:'#7B4F00', fontWeight:700, fontSize:'0.9rem' }}>
              🚫 도전 횟수({ATTEMPT_LIMIT}회)를 모두 사용했어요!
            </div>
          ) : (
            <>
              <div style={{ color:'#aaa', fontSize:'0.82rem', marginBottom:8 }}>
                남은 도전 횟수: <strong style={{ color: myAttempts >= 40 ? '#E74C3C' : '#1A5C3A' }}>{ATTEMPT_LIMIT - myAttempts}회</strong>
              </div>
              <button className="btn-yellow" style={{ fontSize: '1.1rem' }} onClick={startGame}>
                다시 도전! 🔄
              </button>
            </>
          )}
        </div>
      </div>
      <Leaderboard data={leaderboard} studentName={studentName} />
    </div>
  )
}

function Leaderboard({ data, studentName }) {
  const medals = ['🥇', '🥈', '🥉']
  return (
    <div style={{ width: 260, background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', flexShrink: 0, alignSelf: 'flex-start' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 16, textAlign: 'center' }}>🏆 명예의 전당</h3>
      {data.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', fontSize: '0.9rem' }}>
          아직 기록이 없어요.<br />첫 번째 주인공이 되어봐요!
        </p>
      ) : data.map((row, i) => {
        const isMe = row.student_name === studentName
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 10, marginBottom: 6,
            background: isMe ? '#FFFBEA' : '#F9F9F9',
            border: isMe ? '2px solid #F5C800' : '2px solid transparent',
          }}>
            <span style={{ fontSize: '1.2rem', width: 28, textAlign: 'center' }}>{medals[i] || `${i + 1}`}</span>
            <span style={{ flex: 1, fontWeight: isMe ? 900 : 500, fontSize: '0.92rem' }}>{row.student_name}</span>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontWeight: 900, color: '#1A5C3A' }}>{row.score}점</div>
              {row.attempts > 0 && <div style={{ fontSize:'0.7rem', color:'#aaa' }}>{row.attempts}회 도전</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
