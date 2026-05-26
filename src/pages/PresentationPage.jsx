import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── TREATMENT DATA ── */
const treatments = [
  {
    emoji: '🦷', name: '충치 치료', english: 'Cavity Treatment',
    badge: '가장 흔한 치료', badgeColor: '#1A5C3A',
    what: '썩은 치아를 드릴로 제거하고 치아 색 레진으로 채우는 치료예요.',
    why: '뮤탄스균이 당분을 먹고 산을 만들어 치아가 녹아요. 방치하면 신경까지 손상돼 훨씬 힘든 치료를 받아야 해요!',
    steps: ['마취 주사로 통증 차단', '드릴(핸드피스)로 충치 제거', '레진 재료로 채우기', '광중합기 파란 빛 20초로 굳히기', '연마기로 매끄럽게 마무리'],
    time: '30분 ~ 1시간',
    tip: '초기 충치는 쌀알만큼 작게 치료할 수 있어요. 6개월마다 검진받으면 초기에 발견해 간단히 치료해요!',
  },
  {
    emoji: '🔬', name: '스케일링', english: 'Dental Scaling',
    badge: '예방 치료', badgeColor: '#4A90D9',
    what: '초음파 진동과 특수 기구로 치아에 굳어버린 치석을 깔끔하게 제거해요.',
    why: '치석은 아무리 양치해도 없어지지 않아요! 방치하면 잇몸이 붓고 피가 나는 잇몸병(치주염)으로 이가 흔들려요.',
    steps: ['초음파 스케일러로 치석 진동·분리', '손 기구로 치석 제거', '물과 흡입기로 구강 청소', '치아 표면 연마', '불소 도포(선택)'],
    time: '30분 ~ 1시간',
    tip: '1년에 한두 번 받으면 잇몸 건강을 지킬 수 있어요. 20세 이상은 건강보험도 돼요!',
  },
  {
    emoji: '😁', name: '교정 치료', english: 'Orthodontic Treatment',
    badge: '치아 배열 교정', badgeColor: '#E67E22',
    what: '브라켓과 와이어, 또는 투명 장치로 비뚤어진 치아를 가지런하게 배열해요.',
    why: '치아 배열이 나쁘면 충치·잇몸병이 쉽게 생기고, 음식을 제대로 못 씹어 소화에도 영향을 줘요.',
    steps: ['정밀 X-레이·구강 스캔', '치료 계획 수립', '브라켓 부착 + 와이어 연결', '4~8주마다 조정 방문', '교정 완료 후 유지장치 착용'],
    time: '보통 1 ~ 3년',
    tip: '초등·중학생 성장기가 교정 최적기예요! 턱뼈가 아직 자라는 중이라 치아 이동이 더 빠르고 효과적이에요.',
  },
  {
    emoji: '👑', name: '보철 치료', english: 'Prosthetic Treatment',
    badge: '인공 치아 제작', badgeColor: '#8E44AD',
    what: '빠지거나 심하게 손상된 치아에 인공 치아를 만들어 씌우거나 심어요.',
    why: '치아가 빠지면 옆 치아가 쓰러지고, 음식을 제대로 씹지 못해 위장·영양에도 큰 문제가 생겨요.',
    steps: ['현재 치아 상태 정밀 검사', '디지털 스캔으로 본 뜨기', '치과기공소에서 제작 (1~2주)', '임시 치아로 생활', '최종 보철물 장착·조정'],
    time: '2 ~ 6회 방문 (수 주 ~ 수 개월)',
    tip: '임플란트는 뼈에 심는 인공 치아 뿌리예요. 틀니와 달리 자연 치아처럼 편하게 씹을 수 있어요!',
  },
  {
    emoji: '🏥', name: '신경 치료', english: 'Root Canal Treatment',
    badge: '치아 살리기', badgeColor: '#E74C3C',
    what: '충치가 깊어 신경까지 감염되었을 때, 신경관을 청소·소독해 치아를 살리는 치료예요.',
    why: '신경 감염을 방치하면 뼈까지 녹아 결국 이를 뽑아야 해요. 치아를 살리는 마지막 방법이에요!',
    steps: ['마취로 통증 차단', '신경관 입구 개방', '감염된 신경·혈관 제거', '신경관 소독 및 성형', '충전재로 완전히 밀봉', '크라운으로 치아 보호'],
    time: '보통 2 ~ 4회 방문',
    tip: '신경 치료 후 치아가 약해져 꼭 크라운(왕관 모양 덮개)을 씌워 보호해야 해요. 안 씌우면 치아가 깨질 수 있어요!',
  },
  {
    emoji: '💉', name: '발치', english: 'Tooth Extraction',
    badge: '최후의 수단', badgeColor: '#555',
    what: '너무 심하게 망가졌거나, 교정을 위해, 또는 문제를 일으키는 사랑니를 뽑는 거예요.',
    why: '치료 불가능한 치아를 방치하면 주변 치아와 뼈까지 손상시켜요. 제때 빼야 더 큰 문제를 막아요.',
    steps: ['마취 주사', '치주인대 분리 기구 삽입', '치아를 좌우로 흔들어 탈구', '치아 제거', '거즈로 지혈 (30분)', '항생제·진통제 처방'],
    time: '10분 ~ 1시간',
    tip: '빠진 자리는 임플란트나 브릿지로 채우는 게 좋아요. 그냥 두면 옆 치아가 그쪽으로 기울어져요!',
  },
]

/* ── TOOLS DATA ── */
const ToolSVGs = {
  mirror: () => (
    <svg viewBox="0 0 100 200" style={{ width:'100%', height:'auto' }}>
      <rect x="44" y="90" width="12" height="105" rx="6" fill="#C8C8C8"/>
      <rect x="43" y="78" width="14" height="18" rx="4" fill="#B0B0B0"/>
      <circle cx="50" cy="62" r="26" fill="#B8B8B8"/>
      <circle cx="50" cy="62" r="23" fill="#E8E8E8"/>
      <ellipse cx="42" cy="54" rx="7" ry="4.5" fill="white" opacity="0.55" transform="rotate(-25 42 54)"/>
    </svg>
  ),
  explorer: () => (
    <svg viewBox="0 0 100 200" style={{ width:'100%', height:'auto' }}>
      {[0,1,2,3,4,5,6].map(i=><rect key={i} x="38" y={92+i*14} width="24" height="10" rx="5" fill={i%2===0?'#C8C8C8':'#B0B0B0'}/>)}
      <rect x="46" y="58" width="8" height="38" rx="4" fill="#C0C0C0"/>
      <path d="M50,58 Q50,28 72,12" stroke="#B0B0B0" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <circle cx="73" cy="10" r="3.5" fill="#999"/>
    </svg>
  ),
  scaler: () => (
    <svg viewBox="0 0 100 200" style={{ width:'100%', height:'auto' }}>
      <rect x="38" y="90" width="24" height="100" rx="12" fill="#90BADF"/>
      <rect x="41" y="95" width="18" height="80" rx="6" fill="#A8CFEE"/>
      <rect x="44" y="58" width="12" height="38" rx="6" fill="#80AACF"/>
      <path d="M50,58 Q50,32 68,18" stroke="#80AACF" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <circle cx="69" cy="16" r="4" fill="#5A8AAF"/>
      <text x="62" y="60" fontSize="18" fill="#FFD700" opacity="0.9">≈</text>
    </svg>
  ),
  handpiece: () => (
    <svg viewBox="0 0 100 200" style={{ width:'100%', height:'auto' }}>
      {/* 호스 커넥터 */}
      <circle cx="50" cy="10" r="9" fill="#888"/>
      <circle cx="50" cy="10" r="5" fill="#666"/>
      <rect x="44" y="8" width="12" height="22" rx="3" fill="#999"/>
      {/* 상단 연결부 */}
      <rect x="41" y="26" width="18" height="14" rx="5" fill="#B5B5B5"/>
      {/* 메인 몸통 */}
      <rect x="34" y="38" width="32" height="106" rx="16" fill="#D8D8D8"/>
      {/* 그립 링 */}
      {[...Array(8)].map((_,i)=>(
        <rect key={i} x="34" y={50+i*11} width="32" height="5" rx="2.5" fill="rgba(0,0,0,0.11)"/>
      ))}
      {/* 몸통 하이라이트 */}
      <rect x="36" y="42" width="9" height="88" rx="4.5" fill="rgba(255,255,255,0.3)"/>
      {/* 헤드 연결부 */}
      <rect x="39" y="140" width="22" height="16" rx="5" fill="#C0C0C0"/>
      {/* 헤드 (둥근 머리) */}
      <ellipse cx="50" cy="166" rx="14" ry="14" fill="#CACACA"/>
      <ellipse cx="50" cy="166" rx="9" ry="9" fill="#B8B8B8"/>
      {/* 광섬유 링 */}
      <ellipse cx="50" cy="166" rx="12.5" ry="12.5" fill="none" stroke="#40D0FF" strokeWidth="2.5" opacity="0.85"/>
      {/* 버 홀더 */}
      <rect x="47.5" y="173" width="5" height="8" rx="2" fill="#AAA"/>
      {/* 버 (드릴 비트) */}
      <rect x="49" y="179" width="2" height="14" rx="1" fill="#E8E8E8"/>
      <polygon points="48,179 52,179 50,172" fill="#D0D0D0"/>
    </svg>
  ),
  suction: () => (
    <svg viewBox="0 0 100 200" style={{ width:'100%', height:'auto' }}>
      <rect x="40" y="90" width="20" height="105" rx="10" fill="#4A90D9"/>
      <rect x="43" y="95" width="14" height="85" rx="5" fill="#6AAAF0"/>
      <path d="M50,90 Q50,55 76,32" stroke="#4A90D9" strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M50,90 Q50,55 76,32" stroke="#6AAAF0" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <circle cx="78" cy="29" r="7" fill="#2A70B9"/>
    </svg>
  ),
  light: () => (
    <svg viewBox="0 0 100 200" style={{ width:'100%', height:'auto' }}>
      <rect x="30" y="65" width="40" height="110" rx="12" fill="#3A3A8A"/>
      <rect x="33" y="68" width="34" height="80" rx="8" fill="#4A4AAA"/>
      <rect x="44" y="15" width="12" height="56" rx="6" fill="#5A5AB0"/>
      <circle cx="50" cy="12" r="10" fill="#00BFFF"/>
      <circle cx="50" cy="12" r="6" fill="white" opacity="0.8"/>
      <line x1="50" y1="1" x2="50" y2="-2" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="41" y1="4" x2="38" y2="2" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="59" y1="4" x2="62" y2="2" stroke="#00BFFF" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
}

const tools = [
  { key:'mirror',    name:'구강 거울',    english:'Dental Mirror',         desc:'입 안을 환하게 들여다볼 수 있어요. 작은 거울로 치아 뒤쪽과 구석구석 확인해요!', fact:'치과 진료의 시작점! 이 거울 없이는 아무것도 못 봐요.', Svg: ToolSVGs.mirror },
  { key:'explorer',  name:'치아 탐침',    english:'Dental Explorer',       desc:'뾰족한 끝으로 치아 표면을 살살 눌러 확인해요. 충치가 있으면 탐침이 걸려요!', fact:'전혀 아프지 않아요~ 살살 확인만 하는 도구예요.', Svg: ToolSVGs.explorer },
  { key:'scaler',    name:'초음파 스케일러', english:'Ultrasonic Scaler', desc:'초음파 진동으로 치석을 분리·제거해요. 물도 같이 나와서 시원하게 청소해줘요!', fact:'"끼이잉~" 소리의 정체예요! 무섭게 들리지만 전혀 위험하지 않아요.', Svg: ToolSVGs.scaler },
  { key:'handpiece', name:'핸드피스',     english:'High-speed Handpiece', desc:'충치를 정밀하게 깎아내는 드릴이에요. 무려 분당 40만 번이나 회전해요!', fact:'마취 후에는 전혀 아프지 않아요! 소리만 무섭지 안심해도 돼요 😊', Svg: ToolSVGs.handpiece },
  { key:'suction',   name:'석션 팁',      english:'Suction Tip',          desc:'치료 중 입 안의 침과 물을 빨아들여요. 덕분에 치료 내내 입을 다물지 않아도 돼요!', fact:'입 안의 작은 청소기예요. 이게 없으면 물이 가득 차서 힘들어요!', Svg: ToolSVGs.suction },
  { key:'light',     name:'광중합기',     english:'Curing Light',         desc:'파란 빛으로 레진 재료를 딱딱하게 굳혀요. 단 20초면 완성!', fact:'눈이 부셔서 치과의사도 선글라스를 쓰고 사용해요 😎', Svg: ToolSVGs.light },
]

/* ── FACTS DATA ── */
const facts = [
  { emoji:'💎', text:'치아의 에나멜(법랑질)은\n우리 몸에서 가장 딱딱한 조직!', sub:'모스 경도 5~7로 강철(4.5)보다 더 딱딱해요. 그런데도 충치균 앞에선 녹아버려요.', bg:['#EAF6FF','#BDD7EF'] },
  { emoji:'🦈', text:'상어는 평생 이빨이\n2만 개 이상 새로 나요!', sub:'우리 인간은 평생 딱 52개(유치 20 + 영구치 32)뿐이에요. 소중하게 써야겠죠?', bg:['#E8F0FF','#C0D0F0'] },
  { emoji:'🦕', text:'공룡 화석의 치아를 보면\n무엇을 먹었는지 알 수 있어요!', sub:'이빨이 뾰족하면 육식공룡, 납작하면 초식공룡! 치과학이 고생물학에도 쓰여요.', bg:['#E8FFE8','#B0E0B0'] },
  { emoji:'🔬', text:'치아에서 수천 년이 지나도\nDNA를 추출할 수 있어요!', sub:'치아는 뼈보다 훨씬 단단해 DNA가 잘 보존돼요. 신원 확인에도 치의학이 사용돼요.', bg:['#F3E8FF','#D8B8F8'] },
  { emoji:'🏺', text:'3,000년 전 고대 이집트에도\n치과 치료가 있었어요!', sub:'황금 와이어로 흔들리는 치아를 고정했어요. 치과의 역사는 생각보다 훨씬 오래됐어요!', bg:['#FFF3E0','#FFD9A0'] },
  { emoji:'❌', text:'치아는 한 번 손상되면\n스스로 회복이 안 돼요!', sub:'뼈는 부러져도 다시 붙지만 치아 에나멜은 재생 불가! 그래서 예방과 치료가 모두 중요해요.', bg:['#FDE8E8','#F8C0C0'] },
]

/* ── CAREER DATA ── */
const careerSteps = [
  { emoji:'📚', label:'초등학교', desc:'수학·과학 기초' },
  { emoji:'🔭', label:'중학교', desc:'생물·화학 탐구' },
  { emoji:'⚗️', label:'고등학교', desc:'이과·화학·생물' },
  { emoji:'🦷', label:'치과대학\n(6년)', desc:'기초+임상+실습', highlight:true },
  { emoji:'📋', label:'국가면허\n시험', desc:'치과의사 면허' },
  { emoji:'🏥', label:'인턴·레지던트', desc:'전문의 취득(선택)' },
  { emoji:'👨‍⚕️', label:'치과의사', desc:'개업 or 취직', final:true },
]

const specialties = [
  { emoji:'😁', name:'교정과', desc:'브라켓·와이어·투명교정으로 비뚤어진 치아 교정', color:'#E67E22' },
  { emoji:'🔪', name:'구강악안면외과', desc:'임플란트 수술, 사랑니, 얼굴뼈 수술 전문', color:'#E74C3C' },
  { emoji:'🦠', name:'치주과', desc:'잇몸병(치주염) 치료와 잇몸 수술 전문', color:'#27AE60' },
  { emoji:'👶', name:'소아치과', desc:'어린이·청소년 전문 치과 진료', color:'#3498DB' },
  { emoji:'👑', name:'보철과', desc:'임플란트·틀니·크라운 등 인공 치아 전문', color:'#8E44AD' },
  { emoji:'💤', name:'치과마취과', desc:'전신마취·수면치료 등 통증 없는 치과 전문', color:'#16A085' },
]

/* hubCards 제거 — MainHub가 SVG 일러스트로 대체됨 */

/* ── SHARED BACK BUTTON ── */
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background:'rgba(0,0,0,0.12)', border:'none', borderRadius:50,
      padding:'10px 20px', fontFamily:"'Noto Sans KR', sans-serif",
      fontWeight:700, fontSize:'0.9rem', cursor:'pointer',
      display:'flex', alignItems:'center', gap:6, color:'inherit',
      backdropFilter:'blur(8px)',
    }}>← 메인으로</button>
  )
}

/* ── PRESENTATION PAGE ── */
export default function PresentationPage({ onGoIntro }) {
  const [section, setSection] = useState(null)
  const [visible, setVisible] = useState(true)
  const navigate = useNavigate()

  function goTo(s) {
    setVisible(false)
    setTimeout(() => { setSection(s); setVisible(true) }, 220)
  }

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.97)',
    transition: 'opacity 0.22s ease, transform 0.22s ease',
    width:'100vw', height:'100vh', overflow:'hidden',
    fontFamily:"'Noto Sans KR', sans-serif",
  }

  return (
    <div style={style}>
      {section === null && <MainHub onEnter={s => goTo(s)} onHomework={() => navigate('/homework')} onGoIntro={onGoIntro} />}
      {section === 0 && <DaySection onBack={() => goTo(null)} />}
      {section === 1 && <ToolsSection onBack={() => goTo(null)} />}
      {section === 2 && <CareerSection onBack={() => goTo(null)} />}
      {section === 3 && <FactsSection onBack={() => goTo(null)} />}
    </div>
  )
}

/* ── MAIN HUB: 치과 진료실 일러스트 ── */
function MainHub({ onEnter, onHomework, onGoIntro }) {
  const [hovered, setHovered] = useState(null)
  const labels = ['🦷 치과의사의 하루','🔬 진료실 엿보기','🎓 치과의사가 되는 길','✨ 치아의 놀라운 비밀']
  const glow = id => ({ cursor:'pointer', filter: hovered===id ? 'drop-shadow(0 0 18px rgba(245,200,0,0.95))' : 'none', transition:'filter 0.18s' })

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', flexDirection:'column', fontFamily:"'Noto Sans KR', sans-serif", background:'#D5E8F0' }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', padding:'13px 30px', gap:14, background:'white', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', zIndex:10, flexShrink:0 }}>
        <img src="/logo2.png" style={{ height:42 }}/>
        <div>
          <p style={{ fontWeight:900, fontSize:'1rem', color:'#1A1A1A', lineHeight:1.2 }}>리라초등학교 5학년 2반 명예교사</p>
          <p style={{ fontSize:'0.78rem', color:'#888' }}>함께 알아보는 치과의 세계 🦷</p>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button onClick={onGoIntro} style={{ background:'white', border:'1.5px solid #E0E0E0', borderRadius:50, padding:'9px 18px', fontFamily:'inherit', fontWeight:700, fontSize:'0.88rem', cursor:'pointer', color:'#888' }}>🏠 처음으로</button>
          <button onClick={onHomework} style={{ background:'#F5C800', border:'none', borderRadius:50, padding:'9px 20px', fontFamily:'inherit', fontWeight:700, fontSize:'0.88rem', cursor:'pointer', boxShadow:'0 4px 12px rgba(245,200,0,0.4)', color:'#1A1A1A' }}>학생 참여 (퀴즈 & 게임)</button>
        </div>
      </div>

      {/* Room */}
      <div style={{ flex:1, position:'relative' }}>
        {hovered !== null && (
          <div style={{ position:'absolute', top:12, left:'50%', transform:'translateX(-50%)', background:'rgba(10,20,10,0.88)', color:'white', borderRadius:50, padding:'8px 26px', fontWeight:700, fontSize:'1rem', zIndex:20, pointerEvents:'none', whiteSpace:'nowrap', boxShadow:'0 4px 20px rgba(0,0,0,0.35)' }}>
            {labels[hovered]} — 클릭해서 탐험하기 →
          </div>
        )}

        <svg viewBox="0 0 1000 520" style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="xMidYMid slice">
          {/* ── 방 배경 ── */}
          <rect x="0" y="0" width="1000" height="385" fill="#D5E8F0"/>
          <rect x="0" y="0" width="1000" height="22" fill="#B0CCDA"/>
          <rect x="0" y="375" width="1000" height="10" fill="#B09070"/>
          <rect x="0" y="385" width="1000" height="135" fill="#C4905C"/>
          {[0,1,2,3,4,5,6,7,8,9].map(i=><line key={i} x1={i*110} y1="385" x2={i*110+180} y2="520" stroke="#B07040" strokeWidth="1" opacity="0.35"/>)}
          {/* 천장 조명 */}
          <rect x="464" y="0" width="14" height="58" rx="5" fill="#AAA"/>
          <rect x="444" y="54" width="114" height="20" rx="5" fill="#CCC"/>
          <rect x="434" y="71" width="134" height="24" rx="6" fill="#EEE" stroke="#CCC" strokeWidth="1"/>
          <ellipse cx="501" cy="100" rx="85" ry="28" fill="rgba(255,255,215,0.32)"/>
          {/* 왼쪽 창문 */}
          <rect x="22" y="68" width="112" height="148" rx="4" fill="#A8D8F0" stroke="#7AAABB" strokeWidth="3"/>
          <line x1="78" y1="68" x2="78" y2="216" stroke="#7AAABB" strokeWidth="2"/>
          <line x1="22" y1="142" x2="134" y2="142" stroke="#7AAABB" strokeWidth="2"/>
          <rect x="22" y="68" width="112" height="148" fill="rgba(255,255,255,0.15)" rx="4"/>
          {/* 커튼 */}
          <path d="M18,64 Q34,106 26,166 Q22,192 30,216" stroke="#E0CC9A" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.75"/>
          <path d="M138,64 Q122,106 130,166 Q134,192 126,216" stroke="#E0CC9A" strokeWidth="11" fill="none" strokeLinecap="round" opacity="0.75"/>

          {/* ── ZONE 0: 여의사 캐릭터 ── */}
          <g style={glow(0)} onClick={()=>onEnter(0)} onMouseEnter={()=>setHovered(0)} onMouseLeave={()=>setHovered(null)}>
            {hovered===0 && <ellipse cx="155" cy="404" rx="74" ry="13" fill="rgba(245,200,0,0.3)"/>}
            <g transform="translate(34, 90) scale(0.78)">
            {/* 구두 */}
            <ellipse cx="135" cy="408" rx="19" ry="7" fill="#222"/>
            <ellipse cx="174" cy="408" rx="19" ry="7" fill="#222"/>
            {/* 바지 */}
            <rect x="125" y="354" width="25" height="58" rx="10" fill="#3A5890"/>
            <rect x="157" y="354" width="25" height="58" rx="10" fill="#3A5890"/>
            {/* 긴 옆머리 — 가운 뒤로 */}
            <path d="M116,222 Q96,265 100,315 Q102,350 115,372" stroke="#4A2010" strokeWidth="28" fill="none" strokeLinecap="round"/>
            <path d="M194,222 Q214,265 210,315 Q208,350 195,372" stroke="#4A2010" strokeWidth="28" fill="none" strokeLinecap="round"/>
            {/* 가운 몸통 */}
            <rect x="112" y="275" width="86" height="92" rx="14" fill="white" stroke="#DDD" strokeWidth="1.5"/>
            {/* 안에 스크럽 */}
            <rect x="141" y="275" width="28" height="36" rx="4" fill="#5A9FD4"/>
            {/* 명찰 */}
            <rect x="118" y="293" width="36" height="18" rx="3" fill="#4A90D9"/>
            <text x="136" y="305" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">치과의사</text>
            {/* 청진기 */}
            <path d="M141,285 Q131,308 124,320 Q118,330 123,338" stroke="#777" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="123" cy="340" r="6" fill="#777"/>
            <path d="M169,285 Q179,308 186,320 Q192,330 187,338" stroke="#777" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="187" cy="340" r="6" fill="#777"/>
            {/* 팔 */}
            <rect x="93" y="282" width="21" height="60" rx="9" fill="white" stroke="#DDD" strokeWidth="1.5"/>
            <rect x="196" y="282" width="21" height="60" rx="9" fill="white" stroke="#DDD" strokeWidth="1.5"/>
            {/* 왼손 + 치경 */}
            <circle cx="103" cy="347" r="11" fill="#FFCEA0"/>
            <rect x="97" y="342" width="5" height="34" rx="2.5" fill="#C8C8C8"/>
            <circle cx="99" cy="337" r="8" fill="#B8B8B8"/>
            <circle cx="99" cy="337" r="6" fill="#E0E0E0"/>
            {/* 오른손 */}
            <circle cx="207" cy="347" r="11" fill="#FFCEA0"/>
            {/* 목 */}
            <rect x="143" y="252" width="24" height="27" rx="10" fill="#FFCEA0"/>
            {/* 머리 */}
            <ellipse cx="155" cy="232" rx="38" ry="39" fill="#FFCEA0"/>
            {/* 머리카락 위 */}
            <ellipse cx="155" cy="196" rx="40" ry="20" fill="#4A2010"/>
            <rect x="115" y="198" width="80" height="22" rx="6" fill="#4A2010"/>
            {/* 귀 */}
            <ellipse cx="117" cy="234" rx="8" ry="10" fill="#FFCEA0"/>
            <ellipse cx="193" cy="234" rx="8" ry="10" fill="#FFCEA0"/>
            {/* 안경 */}
            <circle cx="143" cy="232" r="9.5" fill="none" stroke="#555" strokeWidth="2"/>
            <circle cx="170" cy="232" r="9.5" fill="none" stroke="#555" strokeWidth="2"/>
            <line x1="152.5" y1="232" x2="160.5" y2="232" stroke="#555" strokeWidth="2"/>
            <line x1="133.5" y1="230" x2="126" y2="228" stroke="#555" strokeWidth="2"/>
            <line x1="179.5" y1="230" x2="187" y2="228" stroke="#555" strokeWidth="2"/>
            {/* 눈썹 */}
            <path d="M135,221 Q143,217 151,221" stroke="#4A2010" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <path d="M160,221 Q168,217 176,221" stroke="#4A2010" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            {/* 눈 */}
            <circle cx="143" cy="232" r="5" fill="#2A1808"/>
            <circle cx="170" cy="232" r="5" fill="#2A1808"/>
            <circle cx="144.5" cy="230" r="1.8" fill="white"/>
            <circle cx="171.5" cy="230" r="1.8" fill="white"/>
            {/* 속눈썹 */}
            <line x1="138" y1="224" x2="136.5" y2="221" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="143" y1="222.5" x2="143" y2="219.5" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="148" y1="224" x2="149.5" y2="221" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="165" y1="224" x2="163.5" y2="221" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="170" y1="222.5" x2="170" y2="219.5" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="175" y1="224" x2="176.5" y2="221" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            {/* 미소 */}
            <path d="M143,250 Q155,262 168,250" stroke="#C07050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {/* 볼터치 */}
            <ellipse cx="130" cy="245" rx="12" ry="7" fill="#FFB0A0" opacity="0.55"/>
            <ellipse cx="180" cy="245" rx="12" ry="7" fill="#FFB0A0" opacity="0.55"/>
            </g>
            {/* 라벨 */}
            <rect x="82" y="420" width="148" height="30" rx="15" fill="#1A5C3A"/>
            <text x="156" y="440" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">치과의사의 하루 →</text>
          </g>

          {/* ── ZONE 1: 치과 유닛 체어 ── */}
          <g style={glow(1)} onClick={()=>onEnter(1)} onMouseEnter={()=>setHovered(1)} onMouseLeave={()=>setHovered(null)}>
            {hovered===1 && <ellipse cx="398" cy="404" rx="125" ry="13" fill="rgba(245,200,0,0.3)"/>}
            <g transform="translate(88, 89) scale(0.78)">
            {/* 페달 베이스 */}
            <rect x="386" y="358" width="24" height="46" rx="5" fill="#777"/>
            <ellipse cx="398" cy="404" rx="46" ry="9" fill="#666"/>
            {/* 좌석 */}
            <rect x="276" y="316" width="188" height="46" rx="16" fill="#3A8DC4"/>
            <rect x="279" y="319" width="182" height="40" rx="14" fill="#4A9DD4"/>
            {/* 등받이 (기울어짐) */}
            <rect x="438" y="244" width="50" height="88" rx="14" fill="#3A8DC4" transform="rotate(-18 463 288)"/>
            <rect x="441" y="247" width="44" height="82" rx="12" fill="#4A9DD4" transform="rotate(-18 463 288)"/>
            {/* 헤드레스트 */}
            <rect x="460" y="218" width="38" height="30" rx="12" fill="#2A7DB4" transform="rotate(-18 479 233)"/>
            {/* 발받침 */}
            <rect x="246" y="324" width="36" height="34" rx="10" fill="#4A9DD4"/>
            <rect x="236" y="330" width="16" height="22" rx="8" fill="#3A8DC4"/>
            {/* 팔걸이 */}
            <rect x="276" y="306" width="114" height="13" rx="6" fill="#2A7DB4"/>
            <rect x="460" y="304" width="90" height="13" rx="6" fill="#2A7DB4"/>
            {/* 기구 트레이 암 */}
            <rect x="334" y="284" width="8" height="36" rx="4" fill="#999"/>
            <rect x="304" y="278" width="74" height="10" rx="5" fill="#AAA"/>
            <rect x="310" y="268" width="5" height="14" rx="2.5" fill="#C8C8C8"/>
            <rect x="319" y="266" width="5" height="16" rx="2.5" fill="#B0B0B0"/>
            <rect x="328" y="268" width="5" height="14" rx="2.5" fill="#4A90D9"/>
            <rect x="337" y="267" width="5" height="15" rx="2.5" fill="#C0C0C0"/>
            <rect x="346" y="268" width="5" height="14" rx="2.5" fill="#90BADF"/>
            {/* 조명 암 */}
            <line x1="396" y1="22" x2="396" y2="102" stroke="#AAA" strokeWidth="7" strokeLinecap="round"/>
            <line x1="396" y1="102" x2="356" y2="188" stroke="#AAA" strokeWidth="7" strokeLinecap="round"/>
            <ellipse cx="344" cy="198" rx="44" ry="27" fill="#CCC" transform="rotate(-20 344 198)"/>
            <ellipse cx="344" cy="198" rx="31" ry="18" fill="#00CFFF" opacity="0.65" transform="rotate(-20 344 198)"/>
            <ellipse cx="344" cy="198" rx="17" ry="10" fill="white" opacity="0.88" transform="rotate(-20 344 198)"/>
            <path d="M316,210 L272,332 L422,332 L382,210 Z" fill="rgba(255,255,205,0.09)"/>
            {/* 환자 머리 */}
            <ellipse cx="302" cy="308" rx="26" ry="24" fill="#FFCEA0" opacity="0.75"/>
            </g>
            {/* 라벨 */}
            <rect x="320" y="420" width="158" height="30" rx="15" fill="#1A5C3A"/>
            <text x="399" y="440" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">진료실 엿보기 →</text>
          </g>

          {/* ── ZONE 3: 공룡 액자 + 현미경 ── */}
          <g style={glow(3)} onClick={()=>onEnter(3)} onMouseEnter={()=>setHovered(3)} onMouseLeave={()=>setHovered(null)}>
            {hovered===3 && <ellipse cx="660" cy="404" rx="102" ry="13" fill="rgba(245,200,0,0.3)"/>}
            <g transform="translate(145, 88) scale(0.78)">
            {/* 카운터 */}
            <rect x="556" y="342" width="226" height="56" rx="6" fill="#8A6030"/>
            <rect x="556" y="342" width="226" height="12" rx="4" fill="#A07848"/>
            {/* 현미경 */}
            <ellipse cx="628" cy="350" rx="27" ry="7" fill="#444"/>
            <rect x="617" y="258" width="12" height="94" rx="4" fill="#555"/>
            <rect x="605" y="304" width="58" height="10" rx="4" fill="#555" transform="rotate(-12 634 309)"/>
            <rect x="603" y="310" width="54" height="10" rx="4" fill="#666"/>
            <rect x="616" y="244" width="24" height="20" rx="5" fill="#555"/>
            <circle cx="628" cy="247" r="8" fill="#3A3A6A"/>
            <circle cx="628" cy="247" r="5" fill="#1A1A4A"/>
            <rect x="610" y="315" width="42" height="7" rx="2" fill="#B0C8E0"/>
            {/* 시험관 */}
            <rect x="680" y="322" width="7" height="26" rx="3.5" fill="#A8C8F8"/>
            <rect x="692" y="318" width="7" height="30" rx="3.5" fill="#A8F8B8"/>
            <rect x="704" y="320" width="7" height="28" rx="3.5" fill="#F8C8A8"/>
            <rect x="675" y="346" width="44" height="6" rx="2" fill="#555"/>
            </g>
            {/* 라벨 */}
            <rect x="587" y="420" width="148" height="30" rx="15" fill="#4A1A7C"/>
            <text x="661" y="440" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">치아의 놀라운 비밀 →</text>
          </g>

          {/* ── ZONE 2: 책장 ── */}
          <g style={glow(2)} onClick={()=>onEnter(2)} onMouseEnter={()=>setHovered(2)} onMouseLeave={()=>setHovered(null)}>
            {hovered===2 && <ellipse cx="876" cy="404" rx="100" ry="13" fill="rgba(245,200,0,0.3)"/>}
            <g transform="translate(195, 90) scale(0.78)">
            {/* 책장 프레임 */}
            <rect x="794" y="78" width="188" height="332" rx="6" fill="#7A4E28"/>
            <rect x="802" y="86" width="172" height="316" rx="3" fill="#9A6238"/>
            {/* 학사모 */}
            <rect x="826" y="60" width="130" height="20" rx="4" fill="#1A1A2A"/>
            <ellipse cx="891" cy="60" rx="58" ry="10" fill="#1A1A2A"/>
            <rect x="885" y="48" width="12" height="16" rx="4" fill="#1A1A2A"/>
            <line x1="912" y1="62" x2="935" y2="90" stroke="#F5C800" strokeWidth="3"/>
            <circle cx="937" cy="94" r="7" fill="#F5C800"/>
            {/* 선반 */}
            <rect x="802" y="180" width="172" height="8" rx="2" fill="#7A4E28"/>
            <rect x="802" y="270" width="172" height="8" rx="2" fill="#7A4E28"/>
            <rect x="802" y="360" width="172" height="8" rx="2" fill="#7A4E28"/>
            {/* 책 1단 */}
            {[[805,22,90,'#E74C3C'],[829,14,84,'#3498DB'],[845,21,92,'#F5C800'],[868,16,86,'#1A5C3A'],[886,25,90,'#8E44AD'],[913,17,82,'#E67E22'],[932,21,88,'#2C3E50'],[955,14,84,'#C0392B','0.6']].map(([x,w,h,f,op],i)=>(
              <g key={i}><rect x={x} y={180-h} width={w} height={h} rx="2" fill={f} opacity={op||1}/><rect x={x} y={180-h} width={w} height={6} rx="1" fill="rgba(255,255,255,0.22)"/></g>
            ))}
            {/* 책 2단 */}
            {[[805,25,90,'#16A085'],[832,16,84,'#C0392B'],[850,21,88,'#2980B9'],[873,17,82,'#7D6608'],[892,23,86,'#E91E63'],[917,16,84,'#4CAF50'],[935,21,88,'#FF5722'],[958,12,80,'#607D8B']].map(([x,w,h,f],i)=>(
              <g key={i}><rect x={x} y={270-h} width={w} height={h} rx="2" fill={f}/><rect x={x} y={270-h} width={w} height={6} rx="1" fill="rgba(255,255,255,0.22)"/></g>
            ))}
            {/* 책 3단 */}
            {[[805,28,88,'#9C27B0'],[835,14,82,'#00BCD4'],[851,23,90,'#FF9800'],[876,20,84,'#795548'],[898,17,86,'#607D8B'],[917,25,88,'#F44336'],[944,21,82,'#009688']].map(([x,w,h,f],i)=>(
              <g key={i}><rect x={x} y={360-h} width={w} height={h} rx="2" fill={f}/><rect x={x} y={360-h} width={w} height={6} rx="1" fill="rgba(255,255,255,0.22)"/></g>
            ))}
            {/* 하단 소품 */}
            <rect x="805" y="364" width="28" height="38" rx="3" fill="#888" opacity="0.8"/>
            <circle cx="819" cy="362" r="12" fill="#CCC"/>
            <rect x="840" y="370" width="38" height="28" rx="4" fill="#4A7A4A"/>
            <text x="859" y="389" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">해부학</text>
            <rect x="886" y="362" width="22" height="38" rx="4" fill="#6A8ABE"/>
            <rect x="914" y="366" width="20" height="34" rx="4" fill="#BE6A8A"/>
            <rect x="940" y="364" width="26" height="36" rx="4" fill="#8ABE6A"/>
            </g>
            {/* 라벨 */}
            <rect x="812" y="420" width="130" height="30" rx="15" fill="#1A3A7C"/>
            <text x="877" y="440" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">치과의사가 되는 길 →</text>
          </g>
        </svg>
      </div>
    </div>
  )
}

/* ── SECTION 0: 치과의사의 하루 — 진료실 6칸 일러스트 ── */
function DaySection({ onBack }) {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered]   = useState(null)
  const roomBgs = ['#FFFDE7','#E8F4FD','#FFF8EE','#F5EEFF','#FFF0F0','#F4F4F4']

  return (
    <div style={{ width:'100vw', height:'100vh', background:'linear-gradient(160deg,#FFFBEA,#FFF3A0)', display:'flex', flexDirection:'column', overflow:'hidden', fontFamily:"'Noto Sans KR',sans-serif" }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, padding:'18px 40px', flexShrink:0 }}>
        <BackBtn onClick={onBack} />
        <h1 style={{ fontSize:'2rem', fontWeight:900 }}>치과의사의 <span style={{ color:'#1A5C3A' }}>하루</span></h1>
        <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
          {[['09:00','진료 시작'],['12:30','점심 30분'],['18:00','진료 마감'],['평균','30명 진료']].map(([t,l],i) => (
            <div key={i} style={{ background:'white', borderRadius:12, padding:'8px 16px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', minWidth:80 }}>
              <div style={{ fontWeight:900, fontSize:'1rem', color:'#1A5C3A' }}>{t}</div>
              <div style={{ fontSize:'0.78rem', color:'#888' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1, padding:'0 14px 14px' }}>
        <svg viewBox="0 0 984 444" style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="xMidYMid meet">
          {/* 건물 상단 간판 */}
          <rect x="0" y="0" width="984" height="26" rx="6" fill="#7A5030"/>
          <rect x="3" y="4" width="978" height="14" rx="3" fill="#9A6040"/>
          <rect x="332" y="0" width="320" height="24" rx="5" fill="#1A5C3A"/>
          <text x="492" y="16" textAnchor="middle" fontSize="12.5" fill="white" fontWeight="bold">🏥 리라 치과의원 — 오늘의 진료실</text>

          {treatments.map((t, i) => {
            const x = 3 + i * 163
            const W = 157
            const ac = t.badgeColor
            const bg = roomBgs[i]
            const isH = hovered === i
            return (
              <g key={i}
                onClick={() => setSelected(t)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor:'pointer', filter: isH ? `drop-shadow(0 0 16px ${ac}CC)` : 'none', transition:'filter 0.18s' }}
              >
                <rect x={x} y={26} width={W} height={316} fill={bg} stroke={isH ? ac : '#CCC'} strokeWidth={isH ? 2.5 : 1}/>
                <rect x={x} y={26} width={W} height={11} fill={ac} opacity="0.45"/>
                {/* 천장 조명 */}
                <rect x={x+W/2-22} y={26} width={44} height={7} rx="3.5" fill="#DDD"/>
                <rect x={x+W/2-20} y={31} width={40} height={9} rx="3" fill="white" opacity="0.9"/>
                <path d={`M${x+W/2-18},40 L${x+W/2-40},112 L${x+W/2+40},112 L${x+W/2+18},40 Z`} fill="rgba(255,255,230,0.22)"/>
                {/* 방 칸막이 */}
                {i < 5 && <rect x={x+W} y={26} width={6} height={316} fill="#B09070"/>}
                {/* 바닥 */}
                <rect x={x} y={334} width={W} height={8} fill="#C4905C"/>
                {/* 뱃지 */}
                <rect x={x+10} y={44} width={W-20} height={21} rx={10.5} fill={ac}/>
                <text x={x+W/2} y={59} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">{t.badge}</text>
                {/* 메인 이모지 */}
                <text x={x+W/2} y={205} textAnchor="middle" fontSize="84" style={{userSelect:'none'}}>{t.emoji}</text>
                {/* 하단 컬러 박스 */}
                <rect x={x} y={342} width={W} height={102} fill={ac}/>
                <text x={x+W/2} y={368} textAnchor="middle" fontSize="15.5" fill="white" fontWeight="bold">{t.name}</text>
                <text x={x+W/2} y={385} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.75)">{t.english}</text>
                <rect x={x+28} y={395} width={W-56} height={22} rx={11} fill="rgba(255,255,255,0.18)"/>
                <text x={x+W/2} y={410} textAnchor="middle" fontSize="10.5" fill="white" fontWeight="bold">자세히 보기 →</text>
              </g>
            )
          })}
        </svg>
      </div>

      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300 }} onClick={() => setSelected(null)}>
          <div style={{ background:'white', borderRadius:24, padding:'36px', maxWidth:660, width:'90%', maxHeight:'85vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:20 }}>
              <span style={{ fontSize:'3rem' }}>{selected.emoji}</span>
              <div style={{ flex:1 }}>
                <span style={{ background:selected.badgeColor, color:'white', fontSize:'0.78rem', fontWeight:700, padding:'3px 12px', borderRadius:20, display:'inline-block', marginBottom:6 }}>{selected.badge}</span>
                <h2 style={{ fontSize:'1.9rem', fontWeight:900, marginBottom:2 }}>{selected.name}</h2>
                <p style={{ color:'#aaa', fontSize:'0.88rem' }}>{selected.english}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'#f0f0f0', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div style={{ background:'#f8f8f8', borderRadius:14, padding:16 }}>
                <p style={{ fontWeight:900, marginBottom:6 }}>🤔 왜 필요할까요?</p>
                <p style={{ color:'#555', lineHeight:1.7, fontSize:'0.9rem' }}>{selected.why}</p>
              </div>
              <div style={{ background:'#f8f8f8', borderRadius:14, padding:16 }}>
                <p style={{ fontWeight:900, marginBottom:6 }}>⏱ 치료 시간</p>
                <p style={{ color:'#333', fontWeight:700, fontSize:'1.1rem' }}>{selected.time}</p>
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <p style={{ fontWeight:900, marginBottom:12, fontSize:'1rem' }}>📋 치료 과정</p>
              {selected.steps.map((step, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:selected.badgeColor, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'0.8rem', flexShrink:0 }}>{i+1}</div>
                  <span style={{ fontSize:'0.93rem', color:'#333' }}>{step}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'#F0FAF5', borderLeft:`4px solid ${selected.badgeColor}`, borderRadius:'0 12px 12px 0', padding:'14px 18px', color:'#1A5C3A', fontSize:'0.9rem', lineHeight:1.6 }}>
              💡 {selected.tip}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── SECTION 1: 진료실 엿보기 — 도구 6개 한눈에 + 클릭 상세 ── */
function ToolsSection({ onBack }) {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered]   = useState(null)
  const [playing, setPlaying]   = useState(false)
  const [imgOk, setImgOk]       = useState(null)
  const audioRef = useRef(null)
  const tool = tools[selected]

  function stopSound() {
    if (audioRef.current) {
      try { audioRef.current.close() } catch(_) {}
      audioRef.current = null
    }
    setPlaying(false)
  }

  function playSound() {
    stopSound()
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    try {
      const ctx = new AC()
      audioRef.current = ctx
      setPlaying(true)
      const g = ctx.createGain()
      g.connect(ctx.destination)
      let dur = 2
      const { key } = tool

      if (key === 'handpiece') {
        dur = 2.5
        // 고속 드릴 — 거친 톱니파 + 주파수 변조
        const osc = ctx.createOscillator()
        const mod = ctx.createOscillator()
        const modG = ctx.createGain()
        mod.frequency.value = 120; modG.gain.value = 400
        mod.connect(modG); modG.connect(osc.frequency)
        osc.type = 'sawtooth'; osc.frequency.value = 3800
        g.gain.setValueAtTime(0.18, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        osc.connect(g)
        osc.start(); mod.start(); osc.stop(ctx.currentTime + dur); mod.stop(ctx.currentTime + dur)
      } else if (key === 'scaler') {
        dur = 2.2
        // 초음파 — 고음 사인파, 약간 흔들림
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(8500, ctx.currentTime)
        osc.frequency.setValueAtTime(9200, ctx.currentTime + 0.5)
        osc.frequency.setValueAtTime(7800, ctx.currentTime + 1.1)
        osc.frequency.setValueAtTime(8500, ctx.currentTime + 1.7)
        g.gain.setValueAtTime(0.09, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        osc.connect(g); osc.start(); osc.stop(ctx.currentTime + dur)
      } else if (key === 'suction') {
        dur = 2.2
        // 석션 — 화이트 노이즈 + 밴드패스 필터
        const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
        const src = ctx.createBufferSource()
        src.buffer = buf
        const flt = ctx.createBiquadFilter()
        flt.type = 'bandpass'; flt.frequency.value = 700; flt.Q.value = 1.2
        g.gain.setValueAtTime(0.32, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        src.connect(flt); flt.connect(g); src.start()
      } else if (key === 'light') {
        dur = 0.9
        // 광중합기 삑 — 짧은 전자음
        const osc = ctx.createOscillator()
        osc.type = 'sine'; osc.frequency.value = 1760
        g.gain.setValueAtTime(0.2, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        osc.connect(g); osc.start(); osc.stop(ctx.currentTime + dur)
      } else if (key === 'mirror') {
        dur = 1.8
        // 거울 핑 — 청명한 금속음
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(2400, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + dur)
        g.gain.setValueAtTime(0.15, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        osc.connect(g); osc.start(); osc.stop(ctx.currentTime + dur)
      } else if (key === 'explorer') {
        dur = 0.5
        // 탐침 클릭
        const osc = ctx.createOscillator()
        osc.type = 'triangle'; osc.frequency.value = 900
        g.gain.setValueAtTime(0.18, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        osc.connect(g); osc.start(); osc.stop(ctx.currentTime + dur)
      }

      setTimeout(() => {
        setPlaying(false)
        if (audioRef.current === ctx) audioRef.current = null
      }, dur * 1000 + 200)
    } catch(_) { setPlaying(false) }
  }

  useEffect(() => { stopSound(); setImgOk(null) }, [selected])
  useEffect(() => () => stopSound(), [])

  return (
    <div style={{ width:'100vw', height:'100vh', background:'linear-gradient(160deg,#0A2416,#1A5C3A)', display:'flex', flexDirection:'column', overflow:'hidden', fontFamily:"'Noto Sans KR', sans-serif" }}>

      {/* 헤더 */}
      <div style={{ padding:'16px 40px', display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
        <span style={{ color:'white' }}><BackBtn onClick={onBack} /></span>
        <h1 style={{ fontSize:'1.8rem', fontWeight:900, color:'white' }}>진료실 <span style={{ color:'#F5C800' }}>엿보기</span></h1>
        <p style={{ color:'rgba(255,255,255,0.5)', marginLeft:10, fontSize:'0.88rem' }}>도구를 클릭해서 알아봐요!</p>
      </div>

      {/* 도구 트레이 (6개 나란히) */}
      <div style={{ flexShrink:0, padding:'0 32px' }}>
        <div style={{ display:'flex', gap:6, background:'rgba(0,0,0,0.22)', borderRadius:'16px 16px 0 0', border:'1px solid rgba(255,255,255,0.1)', borderBottom:'none', padding:'14px 14px 0' }}>
          {tools.map((t, i) => (
            <button key={t.key}
              onClick={() => setSelected(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex:1,
                background: selected===i ? 'rgba(245,200,0,0.15)' : hovered===i ? 'rgba(255,255,255,0.07)' : 'transparent',
                border: selected===i ? '2px solid #F5C800' : '2px solid rgba(255,255,255,0.12)',
                borderBottom: selected===i ? '2px solid transparent' : '2px solid rgba(255,255,255,0.12)',
                borderRadius:'12px 12px 0 0', padding:'10px 6px 0', cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center', gap:4, transition:'all 0.16s',
              }}
            >
              <div style={{ width:48, height:96, opacity: selected===i ? 1 : 0.65, transition:'opacity 0.16s' }}>
                <t.Svg />
              </div>
              <p style={{ fontSize:'0.74rem', fontWeight:700, color: selected===i ? '#F5C800' : 'rgba(255,255,255,0.65)', marginBottom:8, whiteSpace:'nowrap' }}>
                {t.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 도구 상세 — 3열: 일러스트 | 실제사진 | 텍스트 */}
      <div style={{ flex:1, display:'flex', background:'rgba(0,0,0,0.18)', borderTop:'2px solid #F5C800', margin:'0 32px', padding:'22px 28px', overflow:'hidden', gap:0 }}>

        {/* 일러스트 + 소리 버튼 */}
        <div style={{ flex:'0 0 120px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
          <div key={selected} style={{ width:88, animation:'fadeScaleIn 0.35s ease' }}>
            <tool.Svg />
          </div>
          <button onClick={playSound} disabled={playing} style={{
            background: playing ? 'rgba(245,200,0,0.28)' : 'rgba(245,200,0,0.12)',
            border:'1px solid rgba(245,200,0,0.55)', borderRadius:50,
            padding:'7px 13px', color:'#F5C800', fontSize:'0.76rem', fontWeight:700,
            cursor: playing ? 'default' : 'pointer', fontFamily:'inherit',
            display:'flex', alignItems:'center', gap:5, transition:'all 0.18s', whiteSpace:'nowrap',
          }}>
            {playing ? '🔊 재생 중' : '🔊 소리 듣기'}
          </button>
        </div>

        {/* 실제 사진 */}
        <div style={{ flex:'0 0 200px', display:'flex', flexDirection:'column', gap:8, padding:'0 18px' }}>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.68rem', fontWeight:700, letterSpacing:2, textTransform:'uppercase', flexShrink:0 }}>실제 모습</p>
          <div style={{ flex:1, minHeight:0, position:'relative' }}>
            <img
              key={tool.key}
              src={`/tools/${tool.key}.jpg`}
              alt={tool.name}
              onLoad={() => setImgOk(true)}
              onError={() => setImgOk(false)}
              style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:14, display: imgOk === true ? 'block' : 'none', border:'1px solid rgba(255,255,255,0.15)' }}
            />
            {imgOk !== true && (
              <div style={{ width:'100%', height:'100%', borderRadius:14, border:'1px dashed rgba(255,255,255,0.2)', background:'rgba(0,0,0,0.18)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, color:'rgba(255,255,255,0.28)', fontSize:'0.72rem', textAlign:'center', padding:'0 14px', lineHeight:1.6 }}>
                <span style={{ fontSize:'2rem' }}>📷</span>
                <span>public/tools/<br/><strong style={{ color:'rgba(255,255,255,0.45)' }}>{tool.key}.jpg</strong><br/>파일을 넣으면<br/>사진이 표시돼요</span>
              </div>
            )}
          </div>
        </div>

        {/* 텍스트 */}
        <div style={{ flex:1, overflowY:'auto', paddingLeft:14 }}>
          <p style={{ color:'#F5C800', fontWeight:700, letterSpacing:3, fontSize:'0.76rem', marginBottom:8 }}>
            TOOL {selected+1} / {tools.length}
          </p>
          <h2 key={`n${selected}`} style={{ fontSize:'2.4rem', fontWeight:900, color:'white', marginBottom:4, lineHeight:1.1, animation:'fadeScaleIn 0.35s ease' }}>
            {tool.name}
          </h2>
          <p style={{ color:'#F5C800', fontWeight:700, fontSize:'0.95rem', marginBottom:14 }}>{tool.english}</p>
          <p style={{ color:'rgba(255,255,255,0.84)', fontSize:'1rem', lineHeight:1.82, marginBottom:14 }}>{tool.desc}</p>
          <div style={{ background:'rgba(245,200,0,0.12)', border:'1px solid rgba(245,200,0,0.35)', borderRadius:12, padding:'13px 18px', color:'#F5C800', fontSize:'0.9rem', lineHeight:1.65 }}>
            💡 {tool.fact}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── SECTION 2: 치과의사가 되는 길 — 교육 여정 일러스트 ── */
function CareerSection({ onBack }) {
  return (
    <div style={{ width:'100vw', height:'100vh', background:'linear-gradient(160deg,#1A3A7C,#0A1E40)', display:'flex', flexDirection:'column', overflow:'hidden', fontFamily:"'Noto Sans KR', sans-serif" }}>
      <div style={{ padding:'16px 40px', display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
        <BackBtn onClick={onBack} />
        <h1 style={{ fontSize:'1.8rem', fontWeight:900, color:'white' }}>치과의사가 되는 <span style={{ color:'#F5C800' }}>길</span></h1>
        <p style={{ color:'rgba(255,255,255,0.5)', marginLeft:10, fontSize:'0.88rem' }}>초등학교부터 치과의사까지 거치는 여정</p>
      </div>

      {/* Journey Illustration */}
      <div style={{ padding:'0 16px 6px', flexShrink:0 }}>
        <svg viewBox="0 0 1200 320" style={{ width:'100%', display:'block', maxHeight:'44vh' }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="cg_sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5BAEE8"/>
              <stop offset="100%" stopColor="#C5E8FA"/>
            </linearGradient>
            <linearGradient id="cg_gnd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5DB830"/>
              <stop offset="100%" stopColor="#3A8A1A"/>
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="1200" height="270" fill="url(#cg_sky)"/>

          {/* Sun */}
          <circle cx="58" cy="52" r="32" fill="#FFE566" opacity="0.95"/>
          <circle cx="58" cy="52" r="24" fill="#FFD700"/>

          {/* Clouds */}
          <g opacity="0.85">
            <ellipse cx="200" cy="44" rx="50" ry="20" fill="white"/>
            <ellipse cx="230" cy="37" rx="36" ry="22" fill="white"/>
            <ellipse cx="168" cy="50" rx="30" ry="16" fill="white"/>
          </g>
          <g opacity="0.72">
            <ellipse cx="745" cy="36" rx="44" ry="17" fill="white"/>
            <ellipse cx="773" cy="30" rx="32" ry="19" fill="white"/>
            <ellipse cx="720" cy="42" rx="28" ry="14" fill="white"/>
          </g>
          <g opacity="0.65">
            <ellipse cx="1096" cy="48" rx="38" ry="15" fill="white"/>
            <ellipse cx="1122" cy="42" rx="28" ry="17" fill="white"/>
          </g>

          {/* Ground */}
          <rect x="0" y="265" width="1200" height="55" fill="url(#cg_gnd)"/>
          {[...Array(30)].map((_,i) => (
            <ellipse key={i} cx={20+i*40} cy="266" rx="12" ry="5" fill="#6CC82C" opacity="0.65"/>
          ))}

          {/* Road */}
          <rect x="0" y="248" width="1200" height="20" fill="#9A9A9A"/>
          <rect x="0" y="250" width="1200" height="16" fill="#ABABAB"/>
          {[...Array(22)].map((_,i) => (
            <rect key={i} x={i*56+4} y={256} width={34} height={4} rx="2" fill="#FFD700" opacity="0.8"/>
          ))}

          {/* ── Building 1: 초등학교 ── */}
          <g>
            <rect x="42" y="158" width="74" height="92" rx="2" fill="#FFF176" stroke="#F9A825" strokeWidth="1.5"/>
            <polygon points="28,160 118,160 73,110" fill="#E53935"/>
            <rect x="92" y="118" width="10" height="24" fill="#BDBDBD"/>
            <rect x="50" y="174" width="20" height="18" rx="2" fill="#90CAF9" stroke="#1565C0" strokeWidth="1"/>
            <rect x="88" y="174" width="20" height="18" rx="2" fill="#90CAF9" stroke="#1565C0" strokeWidth="1"/>
            <line x1="60" y1="174" x2="60" y2="192" stroke="#1565C0" strokeWidth="0.7"/>
            <line x1="50" y1="183" x2="70" y2="183" stroke="#1565C0" strokeWidth="0.7"/>
            <line x1="98" y1="174" x2="98" y2="192" stroke="#1565C0" strokeWidth="0.7"/>
            <line x1="88" y1="183" x2="108" y2="183" stroke="#1565C0" strokeWidth="0.7"/>
            <rect x="65" y="215" width="22" height="35" rx="3" fill="#A5D6A7" stroke="#388E3C" strokeWidth="1"/>
            <circle cx="83" cy="232" r="2" fill="#388E3C"/>
            <rect x="38" y="200" width="86" height="14" rx="7" fill="#E53935"/>
            <text x="81" y="210" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">초등학교</text>
            <text x="81" y="196" textAnchor="middle" fontSize="11" fill="#E53935" fontWeight="bold">①</text>
            <line x1="100" y1="110" x2="100" y2="87" stroke="#AAA" strokeWidth="1.5"/>
            <rect x="100" y="87" width="22" height="13" rx="1" fill="#E53935" opacity="0.9"/>
          </g>

          {/* Arrow */}
          <text x="156" y="243" textAnchor="middle" fontSize="20" fill="#F5C800" fontWeight="bold">→</text>
          {/* Tree */}
          <rect x="153" y="232" width="5" height="18" fill="#6D4C41"/>
          <ellipse cx="155" cy="224" rx="12" ry="14" fill="#43A047"/>
          <ellipse cx="155" cy="220" rx="9" ry="10" fill="#66BB6A"/>

          {/* ── Building 2: 중학교 ── */}
          <g>
            <rect x="195" y="138" width="80" height="112" rx="2" fill="#90CAF9" stroke="#1565C0" strokeWidth="1.5"/>
            <rect x="190" y="133" width="90" height="9" rx="2" fill="#1565C0"/>
            {[148,174].map((y,ri) => [202,226,250].map((x,ci) => (
              <rect key={`${ri}-${ci}`} x={x} y={y} width="18" height="16" rx="1" fill="#E3F2FD" stroke="#1565C0" strokeWidth="0.8"/>
            )))}
            <rect x="222" y="218" width="26" height="32" rx="3" fill="#1565C0"/>
            <circle cx="244" cy="234" r="2" fill="#90CAF9"/>
            <rect x="196" y="200" width="78" height="14" rx="7" fill="#1565C0"/>
            <text x="235" y="210" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">중학교</text>
            <text x="235" y="196" textAnchor="middle" fontSize="11" fill="#1565C0" fontWeight="bold">②</text>
          </g>

          {/* Arrow */}
          <text x="328" y="243" textAnchor="middle" fontSize="20" fill="#F5C800" fontWeight="bold">→</text>
          {/* Tree */}
          <rect x="325" y="232" width="5" height="18" fill="#6D4C41"/>
          <ellipse cx="327" cy="224" rx="12" ry="14" fill="#43A047"/>
          <ellipse cx="327" cy="220" rx="9" ry="10" fill="#66BB6A"/>

          {/* ── Building 3: 고등학교 ── */}
          <g>
            <rect x="362" y="118" width="86" height="132" rx="2" fill="#80CBC4" stroke="#00695C" strokeWidth="1.5"/>
            <rect x="357" y="113" width="96" height="9" rx="2" fill="#00695C"/>
            {[128,155,182].map((y,ri) => [369,393,418].map((x,ci) => (
              <rect key={`${ri}-${ci}`} x={x} y={y} width="16" height="14" rx="1" fill="#E0F2F1" stroke="#00695C" strokeWidth="0.8"/>
            )))}
            <rect x="388" y="218" width="26" height="32" rx="3" fill="#00695C"/>
            <circle cx="410" cy="234" r="2" fill="#80CBC4"/>
            <rect x="363" y="200" width="84" height="14" rx="7" fill="#00695C"/>
            <text x="405" y="210" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">고등학교</text>
            <text x="405" y="196" textAnchor="middle" fontSize="11" fill="#00695C" fontWeight="bold">③</text>
          </g>

          {/* Arrow */}
          <text x="500" y="243" textAnchor="middle" fontSize="20" fill="#F5C800" fontWeight="bold">→</text>

          {/* ── Building 4: 치과대학 (BIGGEST) ── */}
          <g>
            {[0,22,44,66,88,110,132,154,176,198,220,242,264,286,308,330].map((deg,i) => {
              const r = deg * Math.PI / 180
              return <line key={i} x1={585+Math.cos(r)*58} y1={148+Math.sin(r)*58} x2={585+Math.cos(r)*76} y2={148+Math.sin(r)*76} stroke="#F5C800" strokeWidth="3" opacity="0.4"/>
            })}
            <rect x="532" y="52" width="106" height="198" rx="3" fill="#FFF9C4" stroke="#F5C800" strokeWidth="3"/>
            <rect x="528" y="46" width="114" height="10" rx="2" fill="#F5C800"/>
            {[532,550,568,586,604,622].map((x,i) => (
              <rect key={i} x={x} y="32" width="12" height="18" rx="2" fill="#F5C800"/>
            ))}
            {[541,561,601,621].map((x,i) => (
              <rect key={i} x={x} y="190" width="9" height="60" rx="4" fill="#F9A825" opacity="0.65"/>
            ))}
            {[64,90,116,142].map((y,ri) => [540,566,592,618].map((x,ci) => (
              <rect key={`${ri}-${ci}`} x={x} y={y} width="18" height="16" rx="1" fill="#FFF176" stroke="#F9A825" strokeWidth="1"/>
            )))}
            <text x="585" y="198" textAnchor="middle" fontSize="36">🦷</text>
            <rect x="572" y="214" width="26" height="36" rx="3" fill="#F9A825"/>
            <circle cx="593" cy="232" r="2.5" fill="#FFF176"/>
            <rect x="532" y="200" width="106" height="16" rx="8" fill="#F9A825"/>
            <text x="585" y="211" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">치과대학 (6년)</text>
            <text x="585" y="196" textAnchor="middle" fontSize="11" fill="#F9A825" fontWeight="bold">④</text>
          </g>

          {/* Arrow */}
          <text x="690" y="243" textAnchor="middle" fontSize="20" fill="#F5C800" fontWeight="bold">→</text>
          {/* Tree */}
          <rect x="687" y="232" width="5" height="18" fill="#6D4C41"/>
          <ellipse cx="689" cy="224" rx="12" ry="14" fill="#43A047"/>
          <ellipse cx="689" cy="220" rx="9" ry="10" fill="#66BB6A"/>

          {/* ── Building 5: 국가면허시험 ── */}
          <g>
            <rect x="720" y="148" width="76" height="102" rx="2" fill="#A5D6A7" stroke="#2E7D32" strokeWidth="1.5"/>
            <polygon points="710,150 806,150 758,108" fill="#2E7D32"/>
            <text x="758" y="198" textAnchor="middle" fontSize="32">📋</text>
            <rect x="742" y="218" width="24" height="32" rx="3" fill="#2E7D32"/>
            <circle cx="762" cy="234" r="2" fill="#A5D6A7"/>
            <rect x="722" y="200" width="72" height="14" rx="7" fill="#2E7D32"/>
            <text x="758" y="210" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">국가면허시험</text>
            <text x="758" y="196" textAnchor="middle" fontSize="11" fill="#2E7D32" fontWeight="bold">⑤</text>
          </g>

          {/* Arrow */}
          <text x="852" y="243" textAnchor="middle" fontSize="20" fill="#F5C800" fontWeight="bold">→</text>
          {/* Tree */}
          <rect x="849" y="232" width="5" height="18" fill="#6D4C41"/>
          <ellipse cx="851" cy="224" rx="12" ry="14" fill="#43A047"/>
          <ellipse cx="851" cy="220" rx="9" ry="10" fill="#66BB6A"/>

          {/* ── Building 6: 인턴·레지던트 ── */}
          <g>
            <rect x="874" y="118" width="90" height="132" rx="2" fill="white" stroke="#E53935" strokeWidth="2"/>
            <rect x="870" y="113" width="98" height="9" rx="2" fill="#E53935"/>
            <rect x="900" y="130" width="16" height="38" rx="2" fill="#E53935"/>
            <rect x="888" y="142" width="40" height="16" rx="2" fill="#E53935"/>
            {[882,906,930].map((x,i) => (
              <rect key={i} x={x} y="182" width="18" height="16" rx="1" fill="#BBDEFB" stroke="#1565C0" strokeWidth="0.8"/>
            ))}
            <rect x="903" y="216" width="24" height="34" rx="3" fill="#E53935"/>
            <circle cx="923" cy="233" r="2" fill="white"/>
            <rect x="875" y="200" width="88" height="14" rx="7" fill="#E53935"/>
            <text x="919" y="210" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">인턴·레지던트</text>
            <text x="919" y="196" textAnchor="middle" fontSize="11" fill="#E53935" fontWeight="bold">⑥</text>
          </g>

          {/* Arrow */}
          <text x="1018" y="243" textAnchor="middle" fontSize="20" fill="#F5C800" fontWeight="bold">→</text>

          {/* ── Building 7: 치과의사! ── */}
          <g>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => {
              const r = deg * Math.PI / 180
              return <line key={i} x1={1091+Math.cos(r)*62} y1={178+Math.sin(r)*62} x2={1091+Math.cos(r)*78} y2={178+Math.sin(r)*78} stroke="#F5C800" strokeWidth="3" opacity="0.6"/>
            })}
            <rect x="1046" y="120" width="90" height="130" rx="4" fill="#E8F5E9" stroke="#1A5C3A" strokeWidth="2.5"/>
            <rect x="1042" y="115" width="98" height="9" rx="3" fill="#1A5C3A"/>
            <text x="1091" y="184" textAnchor="middle" fontSize="40">🦷</text>
            <rect x="1058" y="188" width="66" height="18" rx="9" fill="#1A5C3A"/>
            <text x="1091" y="200" textAnchor="middle" fontSize="8.5" fill="#F5C800" fontWeight="bold">치과의원 OPEN!</text>
            {[1054,1076,1098,1120].map((x,i) => (
              <rect key={i} x={x} y="128" width="16" height="15" rx="1" fill="#A5D6A7" stroke="#1A5C3A" strokeWidth="0.8"/>
            ))}
            <rect x="1074" y="211" width="26" height="39" rx="3" fill="#1A5C3A"/>
            <circle cx="1096" cy="230" r="2.5" fill="#A5D6A7"/>
            <rect x="1047" y="200" width="88" height="14" rx="7" fill="#1A5C3A"/>
            <text x="1091" y="210" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">치과의사 완성!</text>
            <text x="1091" y="196" textAnchor="middle" fontSize="11" fill="#1A5C3A" fontWeight="bold">⑦</text>
          </g>

          {/* Subtitle labels below road */}
          <text x="81"   y="283" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)">수학·과학 기초</text>
          <text x="235"  y="283" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)">생물·화학 탐구</text>
          <text x="405"  y="283" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)">이과·화학·생물</text>
          <text x="585"  y="283" textAnchor="middle" fontSize="9" fill="#F5C800">기초·임상·실습</text>
          <text x="758"  y="283" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)">치과의사 면허</text>
          <text x="919"  y="283" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)">전문의 취득(선택)</text>
          <text x="1091" y="283" textAnchor="middle" fontSize="9" fill="#A5D6A7">개업 or 취직</text>
        </svg>
      </div>

      {/* Specialties */}
      <div style={{ flex:1, padding:'4px 20px 14px', display:'flex', flexDirection:'column', minHeight:0 }}>
        <p style={{ color:'#F5C800', fontWeight:900, fontSize:'0.88rem', letterSpacing:2, marginBottom:8, flexShrink:0 }}>⭐ 전문의 취득 후 선택할 수 있는 치과 6대 전문 분야</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8, flex:1, minHeight:0 }}>
          {specialties.map((s,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.1)', borderRadius:14, padding:'12px 10px', textAlign:'center', borderTop:`3px solid ${s.color}`, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
              <div style={{ fontSize:'1.6rem' }}>{s.emoji}</div>
              <p style={{ fontWeight:900, color:'white', fontSize:'0.82rem', margin:0 }}>{s.name}</p>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.72rem', lineHeight:1.45, margin:0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── SECTION 3: 치아의 비밀 ── */
function FactsSection({ onBack }) {
  const [idx, setIdx] = useState(0)
  const fact = facts[idx]

  return (
    <div style={{ width:'100vw', height:'100vh', background:`linear-gradient(135deg,${fact.bg[0]},${fact.bg[1]})`, transition:'background 0.5s ease', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', right:-80, bottom:-80, width:360, height:360, borderRadius:'50%', background:'rgba(255,255,255,0.25)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', left:-50, top:-50, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.25)', pointerEvents:'none' }}/>

      <div style={{ padding:'22px 40px', display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
        <BackBtn onClick={onBack} />
        <h1 style={{ fontSize:'1.9rem', fontWeight:900, color:'#1A1A1A' }}>치아의 <span style={{ color:'#1A5C3A' }}>놀라운 비밀</span></h1>
        <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
          {facts.map((_,i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ width:i===idx?28:8, height:8, borderRadius:4, background:i===idx?'#1A5C3A':'rgba(0,0,0,0.2)', cursor:'pointer', transition:'all 0.3s' }}/>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 80px' }}>
        <div key={idx} style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
          <div style={{ fontSize:'9rem', lineHeight:1, marginBottom:28, animation:'bounceIn 0.5s ease' }}>{fact.emoji}</div>
          <p style={{ fontSize:'2.4rem', fontWeight:900, maxWidth:720, lineHeight:1.4, color:'#1A1A1A', marginBottom:18, whiteSpace:'pre-line' }}>{fact.text}</p>
          <p style={{ fontSize:'1.15rem', color:'#555', maxWidth:580, lineHeight:1.75 }}>{fact.sub}</p>
        </div>
      </div>

      <div style={{ padding:'0 40px 36px', display:'flex', justifyContent:'center', gap:12 }}>
        <button disabled={idx===0} onClick={() => setIdx(i=>i-1)} style={{ background:'rgba(0,0,0,0.1)', border:'none', borderRadius:50, padding:'12px 28px', fontFamily:'inherit', fontWeight:700, fontSize:'1rem', cursor:idx===0?'default':'pointer', opacity:idx===0?0.35:1, color:'#333' }}>← 이전</button>
        <button disabled={idx===facts.length-1} onClick={() => setIdx(i=>i+1)} style={{ background:idx===facts.length-1?'rgba(26,92,58,0.25)':'#1A5C3A', border:'none', borderRadius:50, padding:'12px 28px', fontFamily:'inherit', fontWeight:700, fontSize:'1rem', cursor:idx===facts.length-1?'default':'pointer', opacity:idx===facts.length-1?0.5:1, color:'white' }}>다음 사실 →</button>
      </div>
    </div>
  )
}
