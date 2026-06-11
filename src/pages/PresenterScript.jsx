import { useState, useEffect } from 'react'

const DEFAULT_SECTIONS = [
  {
    id: 1, time: '00:00 – 02:00', screen: '🖥 인트로 화면',
    title: '인사 및 자기소개',
    script: `안녕하세요, 여러분! 저는 오늘 여러분의 명예 치과 선생님으로 온 [이름]입니다.\n여러분, 치과 가는 거 좋아하는 사람? (손 들어보기)\n무서운 사람? (손 들어보기) — 그럼 오늘 치과가 무서운 곳이 아니라 정말 신기하고 멋진 곳이라는 걸 알게 될 거예요!\n오늘 제가 특별히 만든 홈페이지를 함께 보면서 치과의사라는 직업을 알아볼 거예요.`,
    tip: '인트로 화면 띄워두고 아이들이 집중할 때 "시작" 클릭'
  },
  {
    id: 2, time: '02:00 – 04:00', screen: '🏠 메인 화면 (4개 버튼)',
    title: '메인 화면 소개',
    script: `자, 화면을 보세요! 여기에 4개의 문이 있어요.\n첫 번째 🦷 — 치과의사의 하루. 선생님이 아침에 일어나서 저녁까지 어떻게 지내는지!\n두 번째 ⚕️ — 치과에서 어떤 치료를 하는지. 충치 치료부터 신경 치료까지!\n세 번째 🎓 — 치과의사가 되려면 얼마나 공부해야 하는지!\n네 번째 🌍 — 치과의사에도 여러 전문 분야가 있다는 것!\n자, 첫 번째 문부터 열어볼까요?`,
    tip: '각 버튼을 마우스로 가리키며 설명. hover 효과 보여주기'
  },
  {
    id: 3, time: '04:00 – 10:00', screen: '🦷 치과의사의 하루',
    title: '치과의사의 하루 (6분)',
    script: `치과의사 선생님은 아침 8시 30분에 출근해요. 출근하자마자 뭘 할까요?\n오늘 만날 환자 차트를 미리 확인해요. 철저하게 준비하죠.\n\n하루에 20~30명 환자를 봐요! 집중력이 엄청 중요한 직업이에요.\n\n여러분처럼 무서워하는 어린이도 많아요. 치과의사 선생님은 달래고 또 달래면서 용기를 줘요.\n\n집에 가서도 공부를 해요. 의학은 매일 발전하거든요. 평생 공부하는 직업이에요!`,
    tip: '← → 키보드로 타임라인 이동. 이미지에 마우스 올리면 거울 이펙트!'
  },
  {
    id: 4, time: '10:00 – 17:00', screen: '⚕️ 치과에서 어떤 치료를?',
    title: '치료 종류 (7분)',
    script: `치과에서는 어떤 치료를 할까요? 6가지 치료가 있어요.\n\n🦷 충치 치료 — 나쁜 세균이 이빨을 녹여요. 드릴로 갈아내고 레진으로 채워요.\n🔬 스케일링 — 초음파로 치석 제거!\n😁 교정 치료 — 삐뚤빼뚤한 이를 가지런하게! 초등학생 때가 최적기예요.\n👑 보철 치료 — 빠진 이 자리에 인공 치아!\n🏥 신경 치료 — 충치를 오래 놔두면 신경까지 감염돼요.\n💉 발치 — 도저히 살릴 수 없을 때 뽑는 거예요.`,
    tip: '각 버블 클릭해서 팝업 보여주기. 치아정보 탭도 클릭!'
  },
  {
    id: 5, time: '17:00 – 22:00', screen: '🎓 치과의사가 되는 법',
    title: '치과의사 되는 법 (5분)',
    script: `치과의사가 되고 싶다면 얼마나 공부해야 할까요?\n\n초등학교 6년 → 중학교 3년 → 고등학교 3년 → 치과대학 6년!\n그리고 국가면허시험에 합격해야 해요.\n\n여러분 지금 5학년이죠? 치과대학은 지금부터 약 8~9년 후예요.\n지금부터 수학, 과학, 생물에 관심을 가지면 좋아요!`,
    tip: '타임라인 화살표로 단계별로 넘기며 설명'
  },
  {
    id: 6, time: '22:00 – 27:00', screen: '🌍 치과의사의 여러 얼굴',
    title: '치과 전문 분야 (5분)',
    script: `치과의사가 다 같은 일을 하는 게 아니에요! 전문 분야가 8가지나 있어요.\n\n교정과 / 구강악안면외과 / 치주과 / 소아치과\n보철과 / 치과마취과 / 보존과 / 구강내과\n\n여러분 중에 어떤 전문의가 되고 싶은 사람 있나요?`,
    tip: '각 이미지 클릭하면 설명 팝업이 나와요'
  },
  {
    id: 7, time: '27:00 – 30:00', screen: '🌐 주니어 커리어넷',
    title: '적성검사 안내 (3분)',
    script: `메인 화면 오른쪽 위에 있는 "주니어 커리어넷" 버튼을 눌러볼게요!\n\n이 사이트는 교육부에서 만든 진로 탐색 사이트예요.\n내가 어떤 걸 좋아하는지, 어떤 직업이 나한테 맞는지 알 수 있어요.\n집에 가서 꼭 한번 해보세요!`,
    tip: '실제로 버튼 클릭해서 새 탭으로 사이트 열어 보여주기'
  },
  {
    id: 8, time: '30:00 – 38:00', screen: '📝 퀴즈 & 게임',
    title: '퀴즈 & 게임 소개 (8분)',
    script: `오늘 배운 내용을 퀴즈로 확인해볼 수 있어요!\n메인 화면 노란색 "학생 참여" 버튼을 클릭하세요.\n\n① 홈페이지 주소 접속\n② 내 이름 찾기\n③ 퀴즈 10문제 풀기\n④ 수료증 캡처 → 선생님께 보내기!\n⑤ 댓글 게시판 + 충치 게임 참여!\n\n⚠️ 반드시 본인 이름으로만 접속!`,
    tip: '실제로 이름 클릭해서 퀴즈 화면 보여주기. 게임도 시연!'
  },
  {
    id: 9, time: '38:00 – 40:00', screen: '🏠 메인 화면',
    title: '마무리 (2분)',
    script: `오늘 치과의사라는 직업, 어떠셨나요?\n\n숙제! 집에서 꼭 세 가지 해오세요:\n✅ 1. 퀴즈 풀고 수료증 받기\n✅ 2. 충치 게임 도전하기\n✅ 3. 주니어 커리어넷 적성검사 해보기\n\n오늘 잘 들어줘서 고마워요! 질문 있는 사람?`,
    tip: '질문 2~3개 받고 마무리'
  },
]

const STORAGE_KEY = 'lila_presenter_script_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_SECTIONS
  } catch { return DEFAULT_SECTIONS }
}

function save(sections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
}

export default function PresenterScript() {
  const [sections, setSections] = useState(load)
  const [editing, setEditing] = useState(null) // id of section being edited
  const [draft, setDraft] = useState({})

  function startEdit(s) {
    setEditing(s.id)
    setDraft({ time: s.time, screen: s.screen, title: s.title, script: s.script, tip: s.tip })
  }

  function commitEdit() {
    const updated = sections.map(s => s.id === editing ? { ...s, ...draft } : s)
    setSections(updated)
    save(updated)
    setEditing(null)
  }

  function deleteSection(id) {
    if (!window.confirm('이 섹션을 삭제할까요?')) return
    const updated = sections.filter(s => s.id !== id)
    setSections(updated)
    save(updated)
  }

  function addSection() {
    const newId = Date.now()
    const updated = [...sections, { id: newId, time: '', screen: '', title: '새 섹션', script: '', tip: '' }]
    setSections(updated)
    save(updated)
    startEdit({ id: newId, time: '', screen: '', title: '새 섹션', script: '', tip: '' })
  }

  function resetAll() {
    if (!window.confirm('기본값으로 초기화할까요? 작성한 내용이 모두 사라져요.')) return
    setSections(DEFAULT_SECTIONS)
    save(DEFAULT_SECTIONS)
  }

  const inputStyle = {
    width: '100%', background: '#0D1B2A', border: '1px solid #4A90D9',
    borderRadius: 8, padding: '8px 12px', color: '#D0E8FF',
    fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem',
    boxSizing: 'border-box', marginBottom: 8,
  }

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", background: '#1A1A2E', minHeight: '100vh', padding: '32px 24px', color: '#E0E0E0' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🦷 발표 스크립트</div>
          <div style={{ fontSize: '1.1rem', color: '#F5C800', fontWeight: 700 }}>LILA초등학교 5학년 2반 명예교사 — 총 40분</div>
          <div style={{ marginTop: 8, fontSize: '0.82rem', color: '#888' }}>이 페이지는 비공개입니다. 내용은 이 브라우저에 자동 저장돼요.</div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={addSection} style={{ background: '#1A5C3A', border: 'none', borderRadius: 50, padding: '8px 20px', color: 'white', fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>+ 섹션 추가</button>
            <button onClick={resetAll} style={{ background: 'none', border: '1px solid #555', borderRadius: 50, padding: '8px 20px', color: '#aaa', fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>↺ 기본값 초기화</button>
          </div>
        </div>

        {/* 섹션 목록 */}
        {sections.map((s, i) => (
          <div key={s.id} style={{ background: '#16213E', borderRadius: 16, padding: '24px 28px', marginBottom: 20, border: editing === s.id ? '1.5px solid #4A90D9' : '1px solid #0F3460', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>

            {editing === s.id ? (
              /* ── 편집 모드 ── */
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input value={draft.time} onChange={e => setDraft(d => ({ ...d, time: e.target.value }))} placeholder="시간 (예: 00:00 – 02:00)" style={{ ...inputStyle, flex: 1 }} />
                  <input value={draft.screen} onChange={e => setDraft(d => ({ ...d, screen: e.target.value }))} placeholder="화면 (예: 🖥 인트로 화면)" style={{ ...inputStyle, flex: 2 }} />
                </div>
                <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="섹션 제목" style={{ ...inputStyle, fontWeight: 700, fontSize: '1rem' }} />
                <textarea value={draft.script} onChange={e => setDraft(d => ({ ...d, script: e.target.value }))} placeholder="발표 스크립트 내용..." rows={8} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.8 }} />
                <textarea value={draft.tip} onChange={e => setDraft(d => ({ ...d, tip: e.target.value }))} placeholder="진행 팁..." rows={2} style={{ ...inputStyle, color: '#6FCF97', resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                  <button onClick={() => setEditing(null)} style={{ background: 'none', border: '1px solid #555', borderRadius: 50, padding: '7px 18px', color: '#aaa', fontFamily: 'inherit', cursor: 'pointer' }}>취소</button>
                  <button onClick={commitEdit} style={{ background: '#4A90D9', border: 'none', borderRadius: 50, padding: '7px 22px', color: 'white', fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer' }}>저장</button>
                </div>
              </div>
            ) : (
              /* ── 보기 모드 ── */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                  {s.time && <span style={{ background: '#F5C800', color: '#1A1A1A', borderRadius: 50, padding: '4px 14px', fontWeight: 900, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>⏱ {s.time}</span>}
                  {s.screen && <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{s.screen}</span>}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    <button onClick={() => startEdit(s)} style={{ background: 'rgba(74,144,217,0.15)', border: '1px solid #4A90D9', borderRadius: 8, padding: '4px 12px', color: '#4A90D9', fontFamily: 'inherit', fontSize: '0.78rem', cursor: 'pointer' }}>✏️ 수정</button>
                    <button onClick={() => deleteSection(s.id)} style={{ background: 'rgba(231,76,60,0.12)', border: '1px solid #E74C3C', borderRadius: 8, padding: '4px 12px', color: '#E74C3C', fontFamily: 'inherit', fontSize: '0.78rem', cursor: 'pointer' }}>🗑 삭제</button>
                  </div>
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#F5C800', marginBottom: 14 }}>{i + 1}. {s.title}</h2>
                {s.script && (
                  <div style={{ background: '#0D1B2A', borderRadius: 10, padding: '16px 20px', fontSize: '0.95rem', lineHeight: 2, color: '#D0E8FF', whiteSpace: 'pre-line', marginBottom: 12, borderLeft: '4px solid #4A90D9' }}>
                    {s.script}
                  </div>
                )}
                {s.tip && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#0A2416', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: '#6FCF97' }}>
                    <span style={{ flexShrink: 0 }}>💡 진행 팁:</span>
                    <span>{s.tip}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* 시간 요약 */}
        <div style={{ background: '#16213E', borderRadius: 16, padding: '20px 28px', border: '1px solid #F5C800', marginTop: 8 }}>
          <div style={{ fontWeight: 900, color: '#F5C800', marginBottom: 10 }}>📋 전체 시간 요약</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
            {sections.map((s, i) => (
              <div key={s.id} style={{ fontSize: '0.82rem', color: '#aaa' }}>
                <span style={{ color: '#F5C800', fontWeight: 700 }}>{s.time || '—'}</span> {s.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
