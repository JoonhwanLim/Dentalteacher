import { useState, useEffect, useCallback } from 'react'

const TOOTH_POSITIONS = [
  { top:'6%',  left:'3%',  size:'3.2rem', rot:-20, op:0.18 },
  { top:'12%', left:'88%', size:'2.6rem', rot:15,  op:0.15 },
  { top:'72%', left:'5%',  size:'2.8rem', rot:10,  op:0.14 },
  { top:'80%', left:'90%', size:'3.5rem', rot:-12, op:0.16 },
  { top:'45%', left:'1%',  size:'2.2rem', rot:25,  op:0.12 },
  { top:'30%', left:'94%', size:'2.4rem', rot:-8,  op:0.13 },
  { top:'88%', left:'42%', size:'2rem',   rot:18,  op:0.10 },
  { top:'5%',  left:'52%', size:'1.8rem', rot:-15, op:0.10 },
  { top:'55%', left:'97%', size:'1.6rem', rot:30,  op:0.09 },
  { top:'20%', left:'8%',  size:'1.5rem', rot:-25, op:0.09 },
]

const TITLE_LINES = ['치과의사는 도대체', '어떠한 삶을', '살고 있을까?']

function WaveTitle({ fontSize }) {
  const [jumped, setJumped] = useState(() => new Set())

  const fire = useCallback((i) => {
    setJumped(prev => new Set([...prev, i]))
    setTimeout(() => {
      setJumped(prev => { const n = new Set(prev); n.delete(i); return n })
    }, 680)
  }, [])

  const handleEnter = useCallback((i) => {
    fire(i)
    // 이웃 글자도 살짝 지연해서 튀어오름
    setTimeout(() => fire(i - 1), 55)
    setTimeout(() => fire(i + 1), 55)
    setTimeout(() => fire(i - 2), 110)
    setTimeout(() => fire(i + 2), 110)
  }, [fire])

  let idx = 0
  return (
    <h1 style={{ fontSize, fontWeight:900, color:'#FFCA28', lineHeight:1.3, marginBottom:10, textShadow:'0 2px 0 rgba(180,120,0,0.18)', userSelect:'none' }}>
      {TITLE_LINES.map((line, li) => (
        <span key={li} style={{ display:'block' }}>
          {[...line].map((ch) => {
            const i = idx++
            if (ch === ' ') return <span key={i} style={{ display:'inline-block', width:'0.28em' }}>&nbsp;</span>
            const isJumped = jumped.has(i)
            return (
              <span
                key={i}
                onMouseEnter={() => handleEnter(i)}
                style={{
                  display: 'inline-block',
                  cursor: 'default',
                  willChange: 'transform',
                  animation: isJumped
                    ? 'charJump 0.68s cubic-bezier(0.34,1.56,0.64,1) both'
                    : `charWave ${1.9 + (i % 5) * 0.22}s ease-in-out -${(i * 0.19) % 2.2}s infinite`,
                }}
              >{ch}</span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

export default function IntroScreen({ onEnter }) {
  const [showModal, setShowModal] = useState(false)
  const [fadeOut,   setFadeOut]   = useState(false)
  const [visible,   setVisible]   = useState(false)
  const mob = window.innerWidth < 600

  useEffect(() => { setTimeout(() => setVisible(true), 60) }, [])

  function handleEnter() {
    setFadeOut(true)
    setTimeout(onEnter, 600)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'url(/bg1.jpg) center/cover no-repeat',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Noto Sans KR', sans-serif",
      opacity: fadeOut ? 0 : visible ? 1 : 0,
      transform: fadeOut ? 'scale(1.04)' : 'scale(1)',
      transition: fadeOut ? 'opacity 0.55s ease, transform 0.55s ease' : 'opacity 0.5s ease',
      zIndex: 9999, overflow: 'hidden',
    }}>
      <style>{`
        @keyframes charWave {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-8px) rotate(-1.5deg); }
        }
        @keyframes charJump {
          0%   { transform: translateY(0px)   scale(1)    rotate(0deg); }
          28%  { transform: translateY(-26px) scale(1.3)  rotate(-10deg); }
          52%  { transform: translateY(-5px)  scale(0.88) rotate(5deg); }
          70%  { transform: translateY(-14px) scale(1.12) rotate(-4deg); }
          86%  { transform: translateY(-2px)  scale(0.97) rotate(1deg); }
          100% { transform: translateY(0px)   scale(1)    rotate(0deg); }
        }
      `}</style>

      {/* 배경 치아 패턴 */}
      {TOOTH_POSITIONS.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', top: p.top, left: p.left,
          fontSize: p.size, opacity: p.op,
          transform: `rotate(${p.rot}deg)`,
          userSelect: 'none', pointerEvents: 'none',
        }}>🦷</span>
      ))}

      {/* 배경 원 장식 */}
      <div style={{ position:'absolute', top:'-8%', right:'-6%', width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,0.12)' }} />
      <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.10)' }} />
      <div style={{ position:'absolute', top:'38%', right:'-4%', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />

      {/* 메인 카드 */}
      <div style={{
        background: 'white', borderRadius: mob ? 24 : 32,
        padding: mob ? '28px 22px 24px' : '48px 52px 44px',
        maxWidth: 560, width: '92%',
        textAlign: 'center',
        boxShadow: '0 24px 72px rgba(180,120,0,0.28), 0 4px 20px rgba(0,0,0,0.08)',
        position: 'relative',
        transform: visible && !fadeOut ? 'translateY(0)' : 'translateY(24px)',
        transition: 'transform 0.55s cubic-bezier(.22,.8,.36,1)',
      }}>
        {/* 치아 아이콘 */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 2px 6px rgba(255,180,0,0.4))' }}>🦷</span>
        </div>

        {/* 배지 */}
        <div style={{
          display: 'inline-block',
          background: '#FFF8DC', border: '2px solid #FFCA28',
          borderRadius: 50, padding: mob ? '5px 16px' : '7px 24px',
          fontSize: mob ? '0.78rem' : '0.95rem', fontWeight: 800, color: '#8B6914',
          marginBottom: mob ? 14 : 20, letterSpacing: 0.5,
        }}>
          리라초등학교 · 5학년 2반 명예교사
        </div>

        {/* 메인 타이틀 — 글자별 wave + 마우스 통통 튀기 */}
        <WaveTitle fontSize={mob ? '2rem' : '2.8rem'} />

        <p style={{
          fontSize: mob ? '1rem' : '1.25rem', fontWeight: 700, color: '#555',
          marginBottom: mob ? 24 : 38, lineHeight: 1.5,
        }}>
          치과의사에 대한 탐구
        </p>

        {/* 버튼 그룹 */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'white', border: '2.5px solid #FFCA28',
              borderRadius: 50, padding: mob ? '12px 22px' : '15px 36px',
              fontFamily: 'inherit', fontWeight: 800, fontSize: mob ? '0.92rem' : '1.05rem',
              cursor: 'pointer', color: '#8B6914',
              transition: 'all 0.18s',
              boxShadow: '0 4px 12px rgba(255,180,0,0.18)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FFF8DC'; e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            👩‍⚕️ 강사 소개
          </button>

          <button
            onClick={handleEnter}
            style={{
              background: 'linear-gradient(135deg, #FFCA28, #FFB300)',
              border: 'none', borderRadius: 50, padding: mob ? '12px 30px' : '15px 44px',
              fontFamily: 'inherit', fontWeight: 900, fontSize: mob ? '0.92rem' : '1.05rem',
              cursor: 'pointer', color: '#5C3D00',
              boxShadow: '0 6px 20px rgba(255,180,0,0.45)',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,180,0,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,180,0,0.45)' }}
          >
            Enter →
          </button>
        </div>

        {/* 강사 전용 숨김 버튼 */}
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <a href="/lira-presenter-only-2026" style={{
            fontSize: '0.6rem', color: 'rgba(180,180,180,0.35)',
            textDecoration: 'none', letterSpacing: 2,
            cursor: 'default', userSelect: 'none',
          }}>· · ·</a>
        </div>

        {/* 하단 로고 */}
        <div style={{ marginTop: 12, opacity: 0.4, display:'flex', alignItems:'center', justifyContent:'center', gap: 8 }}>
          <img src="/logo2.png" style={{ height: 22, opacity: 0.7 }} alt="" onError={e => e.currentTarget.style.display='none'} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888' }}>리라초등학교 명예교사</span>
        </div>
      </div>

      {/* 강사 소개 모달 */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.52)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000, backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: 28,
              padding: '40px 44px', maxWidth: 460, width: '88%',
              textAlign: 'center',
              boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
              animation: 'modalIn 0.28s cubic-bezier(.22,.8,.36,1)',
            }}
          >
            <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.9) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute', top: 18, right: 18,
                background: '#f0f0f0', border: 'none', borderRadius: '50%',
                width: 34, height: 34, cursor: 'pointer',
                fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>

            <div style={{
              width: 140, height: 170, borderRadius: 20, overflow: 'hidden',
              margin: '0 auto 20px', background: '#f5f5f5',
              boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
              border: '3px solid #FFCA28',
            }}>
              <img
                src="/instructor.jpg"
                alt="강사 사진"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                onError={e => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#ccc;font-size:0.75rem;">👩‍⚕️<br/>instructor.jpg<br/>파일을 넣어주세요</div>'
                }}
              />
            </div>

            <div style={{
              display: 'inline-block', background: '#FFF8DC',
              border: '1.5px solid #FFCA28', borderRadius: 50,
              padding: '4px 16px', fontSize: '0.74rem', fontWeight: 800,
              color: '#8B6914', marginBottom: 12,
            }}>
              👩‍⚕️ 오늘의 명예교사
            </div>

            <h2 style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: 4, color: '#1A1A1A' }}>
              권민정 원장님
            </h2>
            <p style={{ color: '#FFCA28', fontSize: '0.88rem', marginBottom: 16, fontWeight: 700 }}>
              👧 임하연 어머니
            </p>

            <div style={{
              background: '#FAFAFA', borderRadius: 16, padding: '16px 20px',
              textAlign: 'left', fontSize: '0.9rem', lineHeight: 1.9, color: '#444',
            }}>
              <div>🎓 서울대학교 치과대학 보철과</div>
              <div>🦷 대한민국 보철학회 정회원</div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: 22, background: 'linear-gradient(135deg,#FFCA28,#FFB300)',
                border: 'none', borderRadius: 50, padding: '11px 40px',
                fontFamily: 'inherit', fontWeight: 800, fontSize: '0.9rem',
                cursor: 'pointer', color: '#5C3D00',
                boxShadow: '0 4px 14px rgba(255,180,0,0.4)',
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
