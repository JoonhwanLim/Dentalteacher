import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const mob = () => window.innerWidth < 768

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
      <circle cx="50" cy="10" r="9" fill="#888"/>
      <circle cx="50" cy="10" r="5" fill="#666"/>
      <rect x="44" y="8" width="12" height="22" rx="3" fill="#999"/>
      <rect x="41" y="26" width="18" height="14" rx="5" fill="#B5B5B5"/>
      <rect x="34" y="38" width="32" height="106" rx="16" fill="#D8D8D8"/>
      {[...Array(8)].map((_,i)=>(
        <rect key={i} x="34" y={50+i*11} width="32" height="5" rx="2.5" fill="rgba(0,0,0,0.11)"/>
      ))}
      <rect x="36" y="42" width="9" height="88" rx="4.5" fill="rgba(255,255,255,0.3)"/>
      <rect x="39" y="140" width="22" height="16" rx="5" fill="#C0C0C0"/>
      <ellipse cx="50" cy="166" rx="14" ry="14" fill="#CACACA"/>
      <ellipse cx="50" cy="166" rx="9" ry="9" fill="#B8B8B8"/>
      <ellipse cx="50" cy="166" rx="12.5" ry="12.5" fill="none" stroke="#40D0FF" strokeWidth="2.5" opacity="0.85"/>
      <rect x="47.5" y="173" width="5" height="8" rx="2" fill="#AAA"/>
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
  { key:'mirror',    name:'구강 거울',       english:'Dental Mirror',         desc:'입 안을 환하게 들여다볼 수 있어요. 작은 거울로 치아 뒤쪽과 구석구석 확인해요!', fact:'치과 진료의 시작점! 이 거울 없이는 아무것도 못 봐요.', Svg: ToolSVGs.mirror },
  { key:'explorer',  name:'치아 탐침',       english:'Dental Explorer',       desc:'뾰족한 끝으로 치아 표면을 살살 눌러 확인해요. 충치가 있으면 탐침이 걸려요!', fact:'전혀 아프지 않아요~ 살살 확인만 하는 도구예요.', Svg: ToolSVGs.explorer },
  { key:'scaler',    name:'초음파 스케일러', english:'Ultrasonic Scaler',     desc:'초음파 진동으로 치석을 분리·제거해요. 물도 같이 나와서 시원하게 청소해줘요!', fact:'"끼이잉~" 소리의 정체예요! 무섭게 들리지만 전혀 위험하지 않아요.', Svg: ToolSVGs.scaler },
  { key:'handpiece', name:'핸드피스',        english:'High-speed Handpiece', desc:'충치를 정밀하게 깎아내는 드릴이에요. 무려 분당 40만 번이나 회전해요!', fact:'마취 후에는 전혀 아프지 않아요! 소리만 무섭지 안심해도 돼요 😊', Svg: ToolSVGs.handpiece },
  { key:'suction',   name:'석션 팁',         english:'Suction Tip',          desc:'치료 중 입 안의 침과 물을 빨아들여요. 덕분에 치료 내내 입을 다물지 않아도 돼요!', fact:'입 안의 작은 청소기예요. 이게 없으면 물이 가득 차서 힘들어요!', Svg: ToolSVGs.suction },
  { key:'light',     name:'광중합기',        english:'Curing Light',         desc:'파란 빛으로 레진 재료를 딱딱하게 굳혀요. 단 20초면 완성!', fact:'눈이 부셔서 치과의사도 선글라스를 쓰고 사용해요 😎', Svg: ToolSVGs.light },
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
  { emoji:'📚', label:'초등학교',      desc:'수학·과학 기초',      detail:'수학과 과학에 흥미를 갖는 시간이에요.\n호기심이 많고 꼼꼼한 어린이가 되어보세요!',                           color:'#E53935', years:'6년'  },
  { emoji:'🔭', label:'중학교',        desc:'생물·화학 탐구',      detail:'생물·화학 과목을 열심히 공부해요.\n인체와 세포에 대한 호기심을 키워가는 시간이에요!',                        color:'#1976D2', years:'3년'  },
  { emoji:'⚗️', label:'고등학교',     desc:'이과·화학·생물',      detail:'이과를 선택하고 화학·생물을 집중 공부해요.\n수능을 열심히 준비하는 중요한 시간이에요!',                       color:'#00897B', years:'3년'  },
  { emoji:'🦷', label:'치과대학',      desc:'기초·임상·실습',      detail:'치의학의 모든 것을 배워요!\n해부학·치과재료부터\n환자 실습까지 6년 동안 공부해요.',                          color:'#F9A825', years:'6년', highlight:true },
  { emoji:'📋', label:'국가면허시험',  desc:'치과의사 면허 취득',  detail:'대학 졸업 후 국가고시에 응시해요.\n합격하면 드디어 치과의사 면허증을 받아요!',                               color:'#2E7D32', years:'시험'  },
  { emoji:'🏥', label:'인턴·레지던트', desc:'전문의 취득 (선택)',  detail:'병원에서 1~4년 더 수련하면 전문의가 돼요.\n교정·소아치과 등 전문 분야를 선택할 수 있어요!',                  color:'#C62828', years:'1~4년' },
  { emoji:'👨‍⚕️', label:'치과의사!',   desc:'개업 or 취직',        detail:'드디어 치과의사가 됐어요! 🎉\n자신의 치과를 열거나 병원에 취직해요.',                                        color:'#1A8C5A', years:'완성!', final:true },
]

/* ── SPECIALTIES DATA ── */
const specialties = [
  { emoji:'😁', name:'교정과',         desc:'브라켓·와이어·투명교정으로 비뚤어진 치아를 가지런하게!',              color:'#E67E22' },
  { emoji:'🔪', name:'구강악안면외과', desc:'임플란트 수술, 사랑니, 얼굴뼈 수술 전문',                           color:'#E74C3C' },
  { emoji:'🦠', name:'치주과',         desc:'잇몸병(치주염) 치료와 잇몸 수술 전문',                              color:'#27AE60' },
  { emoji:'👶', name:'소아치과',       desc:'어린이·청소년 전문 치과 진료',                                      color:'#3498DB' },
  { emoji:'👑', name:'보철과',         desc:'임플란트·틀니·크라운 등 인공 치아 전문',                            color:'#8E44AD' },
  { emoji:'💤', name:'치과마취과',     desc:'전신마취·수면치료 등 통증 없는 치과 전문',                          color:'#16A085' },
  { emoji:'🦷', name:'보존과',         desc:'충치 치료·신경 치료·치아 미백 등 치아를 최대한 살리는 치료 전문!', color:'#2196F3' },
  { emoji:'🔬', name:'연구하는 의사',  desc:'치과 재료, 임플란트 설계, 신약 개발 등 치의학 발전을 위해 연구하는 치과의사!', color:'#FF7043' },
]

/* ── TIMELINE DATA ── */
const timeline = [
  { time:'08:30', emoji:'🌅', color:'#FF8A65', title:'출근!', sub:'하루의 시작',
    desc:'오늘 만날 환자들의 차트를 미리 확인해요.',
    detail:'각 환자마다 어떤 치료가 필요한지, 알레르기는 없는지 살펴봐요. 하루의 시작은 철저한 준비예요.' },
  { time:'09:00', emoji:'🧹', color:'#26A69A', title:'진료실 준비', sub:'도구 소독 & 세팅',
    desc:'모든 도구를 소독하고 진료실을 깨끗이 준비해요.',
    detail:'환자 오기 전 모든 치료 도구를 고압증기로 소독하고 유닛 체어를 세팅해요. 위생이 가장 중요해요!' },
  { time:'09:30', emoji:'🦷', color:'#42A5F5', title:'오전 진료 시작!', sub:'치아 구조대 출동',
    desc:'충치 치료, 스케일링, 정기 검진 등 다양한 치료를 해요.',
    detail:'하루에 보통 15~20명의 환자를 만나요. 집중력이 중요한 시간이에요.' },
  { time:'11:00', emoji:'😰', color:'#AB47BC', title:'겁 많은 어린이 환자', sub:'달래고 또 달래고',
    desc:'"괜찮아요, 전혀 안 아파요!" 용기를 북돋아줘요.',
    detail:'스티커와 칭찬 도장으로 씩씩한 친구로 만들어줘요! 아이들을 잘 다루는 것도 치과의사의 중요한 능력이에요.' },
  { time:'12:30', emoji:'🍚', color:'#66BB6A', title:'점심 & 양치질', sub:'선생님도 양치는 필수!',
    desc:'맛있는 점심 후 제일 먼저 하는 건 양치질!',
    detail:'3분 안에 3면을 꼼꼼히. 아이들에게 솔선수범하는 치과의사 선생님이에요.' },
  { time:'14:00', emoji:'⚗️', color:'#FFA726', title:'오후 진료 시작', sub:'집중력이 필요한 시간',
    desc:'교정 조정, 신경 치료, 보철 장착 등 복잡한 치료들.',
    detail:'한 번에 1~2시간 걸리는 치료들이 오후에 집중돼요. 정밀하게, 꼼꼼하게!' },
  { time:'17:30', emoji:'✅', color:'#EF5350', title:'마지막 환자 & 정리', sub:'오늘도 수고했어요!',
    desc:'소독, 기구 정리, 내일 예약 확인까지 꼼꼼히.',
    detail:'하루 동안 15~20명의 치아를 지킨 진짜 영웅! 마무리까지 완벽하게요.' },
  { time:'19:00', emoji:'📚', color:'#5C6BC0', title:'공부는 끝이 없어요', sub:'퇴근 후에도 계속',
    desc:'학회·세미나·논문 읽기로 최신 치의학을 공부해요.',
    detail:'의학은 매일 발전해요. 치과의사는 평생 공부하는 직업이에요. 그래서 더 멋있어요!' },
]

/* ── SHARED BACK BUTTON ── */
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background:'rgba(0,0,0,0.12)', border:'none', borderRadius:50,
      padding:'10px 20px', fontFamily:"'Noto Sans KR', sans-serif",
      fontWeight:700, fontSize:'0.9rem', cursor:'pointer',
      display:'flex', alignItems:'center', gap:6, color:'inherit',
      backdropFilter:'blur(8px)', flexShrink:0,
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
      {section === null    && <MainHub onEnter={s => goTo(s)} onHomework={() => navigate('/homework')} onGoIntro={onGoIntro} onFacts={() => goTo('facts')} />}
      {section === 'facts' && <FactsSection onBack={() => goTo(null)} />}
      {section === 0      && <DaySection onBack={() => goTo(null)} />}
      {section === 1      && <ClinicSection onBack={() => goTo(null)} />}
      {section === 2      && <CareerSection onBack={() => goTo(null)} />}
      {section === 3      && <SpecialtiesSection onBack={() => goTo(null)} />}
    </div>
  )
}

/* ── MAIN HUB ── */
function MainHub({ onEnter, onHomework, onGoIntro, onFacts }) {
  const [hovered, setHovered] = useState(null)
  const labels = ['🦷 치과의사의 하루','⚕️ 치료와 비밀 무기','🎓 치과의사가 되는 법','🌍 치과의사의 다양한 종류']
  const glow = id => ({ cursor:'pointer', filter: hovered===id ? 'drop-shadow(0 0 18px rgba(245,200,0,0.95))' : 'none', transition:'filter 0.18s' })

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', flexDirection:'column', fontFamily:"'Noto Sans KR', sans-serif", background:'#D5E8F0' }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', padding:'13px 30px', gap:14, background:'white', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', zIndex:10, flexShrink:0 }}>
        <img src="/logo2.png" style={{ height:42, cursor:'pointer' }} alt="" onClick={() => window.location.reload()} title="처음으로"/>
        <div>
          <p style={{ fontWeight:900, fontSize:'1rem', color:'#1A1A1A', lineHeight:1.2 }}>리라초등학교 5학년 2반 명예교사</p>
          <p style={{ fontSize:'0.78rem', color:'#888' }}>함께 알아보는 치과의 세계 🦷</p>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:6, flexShrink:0 }}>
          <button onClick={onFacts} style={{ background:'#E8F5E9', border:'1.5px solid #A5D6A7', borderRadius:50, padding:'8px 14px', fontFamily:'inherit', fontWeight:700, fontSize:'0.82rem', cursor:'pointer', color:'#1A5C3A' }}>🦷 치아정보</button>
          <button onClick={onGoIntro} style={{ background:'white', border:'1.5px solid #E0E0E0', borderRadius:50, padding:'8px 14px', fontFamily:'inherit', fontWeight:700, fontSize:'0.82rem', cursor:'pointer', color:'#888' }}>🏠 처음으로</button>
          <button onClick={onHomework} style={{ background:'#F5C800', border:'none', borderRadius:50, padding:'8px 14px', fontFamily:'inherit', fontWeight:700, fontSize:'0.82rem', cursor:'pointer', boxShadow:'0 4px 12px rgba(245,200,0,0.4)', color:'#1A1A1A', whiteSpace:'nowrap' }}>{mob() ? '학생 참여' : '학생 참여 (퀴즈 & 게임)'}</button>
        </div>
      </div>

      {/* Room */}
      <div style={{ flex:1, position:'relative', overflow: mob() ? 'auto' : 'hidden' }}>
        {hovered !== null && (
          <div style={{ position:'absolute', top:12, left:'50%', transform:'translateX(-50%)', background:'rgba(10,20,10,0.88)', color:'white', borderRadius:50, padding:'8px 26px', fontWeight:700, fontSize:'1rem', zIndex:20, pointerEvents:'none', whiteSpace:'nowrap', boxShadow:'0 4px 20px rgba(0,0,0,0.35)' }}>
            {labels[hovered]} — 클릭해서 탐험하기 →
          </div>
        )}

        <svg viewBox="0 0 1000 520" style={{ width:'100%', height:'100%', display:'block', minWidth: mob() ? 700 : undefined }} preserveAspectRatio="xMidYMid meet">
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
            <ellipse cx="135" cy="408" rx="19" ry="7" fill="#222"/>
            <ellipse cx="174" cy="408" rx="19" ry="7" fill="#222"/>
            <rect x="125" y="354" width="25" height="58" rx="10" fill="#3A5890"/>
            <rect x="157" y="354" width="25" height="58" rx="10" fill="#3A5890"/>
            <path d="M116,222 Q96,265 100,315 Q102,350 115,372" stroke="#4A2010" strokeWidth="28" fill="none" strokeLinecap="round"/>
            <path d="M194,222 Q214,265 210,315 Q208,350 195,372" stroke="#4A2010" strokeWidth="28" fill="none" strokeLinecap="round"/>
            <rect x="112" y="275" width="86" height="92" rx="14" fill="white" stroke="#DDD" strokeWidth="1.5"/>
            <rect x="141" y="275" width="28" height="36" rx="4" fill="#5A9FD4"/>
            <rect x="118" y="293" width="36" height="18" rx="3" fill="#4A90D9"/>
            <text x="136" y="305" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">치과의사</text>
            <path d="M141,285 Q131,308 124,320 Q118,330 123,338" stroke="#777" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="123" cy="340" r="6" fill="#777"/>
            <path d="M169,285 Q179,308 186,320 Q192,330 187,338" stroke="#777" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="187" cy="340" r="6" fill="#777"/>
            <rect x="93" y="282" width="21" height="60" rx="9" fill="white" stroke="#DDD" strokeWidth="1.5"/>
            <rect x="196" y="282" width="21" height="60" rx="9" fill="white" stroke="#DDD" strokeWidth="1.5"/>
            <circle cx="103" cy="347" r="11" fill="#FFCEA0"/>
            <rect x="97" y="342" width="5" height="34" rx="2.5" fill="#C8C8C8"/>
            <circle cx="99" cy="337" r="8" fill="#B8B8B8"/>
            <circle cx="99" cy="337" r="6" fill="#E0E0E0"/>
            <circle cx="207" cy="347" r="11" fill="#FFCEA0"/>
            <rect x="143" y="252" width="24" height="27" rx="10" fill="#FFCEA0"/>
            <ellipse cx="155" cy="232" rx="38" ry="39" fill="#FFCEA0"/>
            <ellipse cx="155" cy="196" rx="40" ry="20" fill="#4A2010"/>
            <rect x="115" y="198" width="80" height="22" rx="6" fill="#4A2010"/>
            <ellipse cx="117" cy="234" rx="8" ry="10" fill="#FFCEA0"/>
            <ellipse cx="193" cy="234" rx="8" ry="10" fill="#FFCEA0"/>
            <circle cx="143" cy="232" r="9.5" fill="none" stroke="#555" strokeWidth="2"/>
            <circle cx="170" cy="232" r="9.5" fill="none" stroke="#555" strokeWidth="2"/>
            <line x1="152.5" y1="232" x2="160.5" y2="232" stroke="#555" strokeWidth="2"/>
            <line x1="133.5" y1="230" x2="126" y2="228" stroke="#555" strokeWidth="2"/>
            <line x1="179.5" y1="230" x2="187" y2="228" stroke="#555" strokeWidth="2"/>
            <path d="M135,221 Q143,217 151,221" stroke="#4A2010" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <path d="M160,221 Q168,217 176,221" stroke="#4A2010" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <circle cx="143" cy="232" r="5" fill="#2A1808"/>
            <circle cx="170" cy="232" r="5" fill="#2A1808"/>
            <circle cx="144.5" cy="230" r="1.8" fill="white"/>
            <circle cx="171.5" cy="230" r="1.8" fill="white"/>
            <line x1="138" y1="224" x2="136.5" y2="221" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="143" y1="222.5" x2="143" y2="219.5" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="148" y1="224" x2="149.5" y2="221" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="165" y1="224" x2="163.5" y2="221" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="170" y1="222.5" x2="170" y2="219.5" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="175" y1="224" x2="176.5" y2="221" stroke="#2A1808" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M143,250 Q155,262 168,250" stroke="#C07050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="130" cy="245" rx="12" ry="7" fill="#FFB0A0" opacity="0.55"/>
            <ellipse cx="180" cy="245" rx="12" ry="7" fill="#FFB0A0" opacity="0.55"/>
            </g>
            <rect x="66" y="412" width="182" height="42" rx="15" fill="#1A5C3A"/>
            <text x="157" y="428" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">치과의사의 하루 →</text>
            <text x="157" y="444" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.78)">출근부터 퇴근까지</text>
          </g>

          {/* ── ZONE 1: 치과 유닛 체어 ── */}
          <g style={glow(1)} onClick={()=>onEnter(1)} onMouseEnter={()=>setHovered(1)} onMouseLeave={()=>setHovered(null)}>
            {hovered===1 && <ellipse cx="398" cy="404" rx="125" ry="13" fill="rgba(245,200,0,0.3)"/>}
            <image href="/zone1.png" x="238" y="0" width="320" height="385" preserveAspectRatio="xMidYMax meet"/>
            <rect x="289" y="412" width="220" height="42" rx="15" fill="#1A5C3A"/>
            <text x="399" y="428" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">치료와 비밀 무기 →</text>
            <text x="399" y="444" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.78)">치료 종류 &amp; 도구</text>
          </g>

          {/* ── ZONE 3: 현미경 ── */}
          <g style={glow(3)} onClick={()=>onEnter(3)} onMouseEnter={()=>setHovered(3)} onMouseLeave={()=>setHovered(null)}>
            {hovered===3 && <ellipse cx="660" cy="404" rx="102" ry="13" fill="rgba(245,200,0,0.3)"/>}
            <image href="/zone3.png" x="538" y="0" width="250" height="385" preserveAspectRatio="xMidYMax meet"/>
            <rect x="564" y="412" width="196" height="42" rx="15" fill="#1A7C5C"/>
            <text x="662" y="428" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">치과의사의 종류 →</text>
            <text x="662" y="444" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.78)">교정과·소아치과 등</text>
          </g>

          {/* ── ZONE 2: 책장 ── */}
          <g style={glow(2)} onClick={()=>onEnter(2)} onMouseEnter={()=>setHovered(2)} onMouseLeave={()=>setHovered(null)}>
            {hovered===2 && <ellipse cx="876" cy="404" rx="100" ry="13" fill="rgba(245,200,0,0.3)"/>}
            <image href="/zone2.png" x="793" y="18" width="168" height="306" preserveAspectRatio="xMidYMid meet"/>
            <rect x="780" y="412" width="192" height="42" rx="15" fill="#1A3A7C"/>
            <text x="876" y="428" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">치과의사가 되는 법 →</text>
            <text x="876" y="444" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.78)">공부와 국가고시</text>
          </g>
        </svg>
      </div>
    </div>
  )
}

/* ── SECTION 0: 치과의사의 하루 — 타임라인 ── */
function DaySection({ onBack }) {
  const [selected, setSelected] = useState(0)
  const item = timeline[selected]
  const isMob = mob()

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') setSelected(s => Math.min(s + 1, timeline.length - 1))
      if (e.key === 'ArrowLeft')  setSelected(s => Math.max(s - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', flexDirection:'column', background:'linear-gradient(160deg,#F0FFF4,#E8F5E9)', fontFamily:"'Noto Sans KR',sans-serif" }}>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:16, padding: isMob ? '14px 20px' : '16px 40px', flexShrink:0, background:'white', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
        <BackBtn onClick={onBack} />
        <div>
          <h1 style={{ fontSize: isMob ? '1.3rem' : '1.8rem', fontWeight:900, color:'#1A1A1A', lineHeight:1.1 }}>치과의사의 <span style={{ color:'#1A5C3A' }}>하루</span></h1>
          <p style={{ fontSize:'0.8rem', color:'#888', marginTop:2 }}>출근부터 퇴근까지</p>
        </div>
      </div>

      {isMob ? (
        /* ── Mobile: vertical expandable list ── */
        <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:21, top:8, bottom:8, width:4, background:'linear-gradient(to bottom,#FF8A65,#26A69A,#42A5F5,#AB47BC,#66BB6A,#FFA726,#EF5350,#5C6BC0)', borderRadius:2 }}/>
            {timeline.map((it, i) => (
              <div key={i}>
                <div onClick={() => setSelected(selected === i ? -1 : i)} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', cursor:'pointer' }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background: selected===i ? it.color : `${it.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0, boxShadow: selected===i ? `0 4px 12px ${it.color}66` : 'none', transition:'all 0.18s', zIndex:1, position:'relative' }}>{it.emoji}</div>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:'0.72rem', color:it.color, fontWeight:800 }}>{it.time}</span>
                    <p style={{ fontWeight:800, fontSize:'0.92rem', color:'#1A1A1A', margin:'1px 0 0' }}>{it.title}</p>
                    <p style={{ fontSize:'0.75rem', color:'#999', margin:0 }}>{it.sub}</p>
                  </div>
                  <span style={{ color:'#bbb', fontSize:'1.1rem', transition:'transform 0.2s', transform: selected===i ? 'rotate(90deg)' : 'none', flexShrink:0 }}>›</span>
                </div>
                {selected === i && (
                  <div style={{ marginLeft:56, marginBottom:8, background:'white', borderRadius:14, padding:'14px 16px', boxShadow:`0 4px 16px ${it.color}33`, borderLeft:`4px solid ${it.color}`, animation:'slideIn 0.25s ease' }}>
                    <p style={{ color:'#333', lineHeight:1.7, marginBottom:6, fontSize:'0.88rem' }}>{it.desc}</p>
                    <p style={{ color:'#777', lineHeight:1.65, fontSize:'0.82rem' }}>{it.detail}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Desktop: split view ── */
        <div style={{ flex:1, display:'flex', minHeight:0 }}>
          {/* Left panel */}
          <div style={{ width:290, background:'white', boxShadow:'4px 0 20px rgba(0,0,0,0.07)', overflowY:'auto', flexShrink:0, position:'relative' }}>
            <div style={{ position:'absolute', left:36, top:20, bottom:20, width:4, background:'linear-gradient(to bottom,#FF8A65,#26A69A,#42A5F5,#AB47BC,#66BB6A,#FFA726,#EF5350,#5C6BC0)', borderRadius:2 }}/>
            <div style={{ padding:'16px 12px' }}>
              {timeline.map((it, i) => (
                <div key={i} onClick={() => setSelected(i)} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 8px', borderRadius:12, cursor:'pointer', background: selected===i ? `${it.color}18` : 'transparent', border: selected===i ? `1.5px solid ${it.color}55` : '1.5px solid transparent', marginBottom:4, transition:'all 0.18s', position:'relative' }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background: selected===i ? it.color : `${it.color}2A`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0, boxShadow: selected===i ? `0 4px 12px ${it.color}55` : 'none', transition:'all 0.18s', zIndex:1 }}>{it.emoji}</div>
                  <div>
                    <span style={{ fontSize:'0.68rem', color:it.color, fontWeight:800 }}>{it.time}</span>
                    <p style={{ fontWeight:800, fontSize:'0.84rem', color:'#1A1A1A', margin:'1px 0 0', lineHeight:1.3 }}>{it.title}</p>
                    <p style={{ fontSize:'0.7rem', color:'#aaa', margin:'1px 0 0' }}>{it.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ flex:1, overflowY:'auto', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 48px' }}>
            <div key={selected} style={{ maxWidth:580, width:'100%', animation:'slideIn 0.28s ease' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:`${item.color}18`, border:`2px solid ${item.color}44`, borderRadius:50, padding:'6px 20px', marginBottom:20 }}>
                <span style={{ fontSize:'0.88rem', fontWeight:800, color:item.color }}>{item.time}</span>
              </div>
              <div style={{ fontSize:'5.5rem', lineHeight:1, marginBottom:16 }}>{item.emoji}</div>
              <h2 style={{ fontSize:'2.2rem', fontWeight:900, color:'#1A1A1A', marginBottom:4, lineHeight:1.2 }}>{item.title}</h2>
              <p style={{ color:item.color, fontWeight:700, fontSize:'1rem', marginBottom:24 }}>{item.sub}</p>
              <div style={{ background:'white', borderRadius:20, padding:'24px 28px', boxShadow:`0 8px 32px ${item.color}22`, borderLeft:`5px solid ${item.color}` }}>
                <p style={{ color:'#333', fontSize:'1.08rem', lineHeight:1.8, marginBottom:14 }}>{item.desc}</p>
                <p style={{ color:'#777', fontSize:'0.95rem', lineHeight:1.75 }}>{item.detail}</p>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:20, gap:8 }}>
                <button disabled={selected===0} onClick={() => setSelected(i => i-1)} style={{ background:selected===0?'#f0f0f0':'white', border:'none', borderRadius:50, padding:'10px 24px', cursor:selected===0?'default':'pointer', opacity:selected===0?0.35:1, fontWeight:700, fontSize:'0.9rem', boxShadow: selected===0 ? 'none' : '0 2px 10px rgba(0,0,0,0.1)', fontFamily:'inherit', color:'#333', transition:'all 0.18s' }}>← 이전</button>
                <button disabled={selected===timeline.length-1} onClick={() => setSelected(i => i+1)} style={{ background:selected===timeline.length-1?'#eee':item.color, border:'none', borderRadius:50, padding:'10px 24px', cursor:selected===timeline.length-1?'default':'pointer', opacity:selected===timeline.length-1?0.4:1, fontWeight:700, fontSize:'0.9rem', color:'white', boxShadow: selected===timeline.length-1 ? 'none' : `0 4px 14px ${item.color}55`, fontFamily:'inherit', transition:'all 0.18s' }}>다음 →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── SECTION 1: 치료와 비밀 무기 — 탭 (치료 종류 + 진료 도구) ── */
function ClinicSection({ onBack }) {
  const [tab, setTab] = useState(0)
  const isMob = mob()

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', flexDirection:'column', fontFamily:"'Noto Sans KR',sans-serif" }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding: isMob ? '12px 16px' : '14px 32px', background:'linear-gradient(135deg,#0A2416,#1A5C3A)', boxShadow:'0 2px 16px rgba(0,0,0,0.2)', flexShrink:0, flexWrap: isMob ? 'wrap' : 'nowrap', color:'white' }}>
        <BackBtn onClick={onBack} />
        <h1 style={{ fontSize: isMob ? '1.2rem' : '1.7rem', fontWeight:900, color:'white', whiteSpace:'nowrap' }}>치료와 <span style={{ color:'#F5C800' }}>비밀 무기</span></h1>
        <div style={{ marginLeft: isMob ? 0 : 'auto', display:'flex', gap:8, flexShrink:0 }}>
          <button onClick={() => setTab(0)} style={{ background: tab===0 ? '#F5C800' : 'rgba(255,255,255,0.12)', border:'none', borderRadius:50, padding: isMob ? '7px 16px' : '9px 22px', fontFamily:'inherit', fontWeight:800, fontSize: isMob ? '0.8rem' : '0.88rem', cursor:'pointer', color: tab===0 ? '#1A1A1A' : 'rgba(255,255,255,0.8)', transition:'all 0.18s' }}>🦷 치료 종류</button>
          <button onClick={() => setTab(1)} style={{ background: tab===1 ? '#F5C800' : 'rgba(255,255,255,0.12)', border:'none', borderRadius:50, padding: isMob ? '7px 16px' : '9px 22px', fontFamily:'inherit', fontWeight:800, fontSize: isMob ? '0.8rem' : '0.88rem', cursor:'pointer', color: tab===1 ? '#1A1A1A' : 'rgba(255,255,255,0.8)', transition:'all 0.18s' }}>🔧 진료 도구</button>
        </div>
      </div>

      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {tab === 0 && <TreatmentsContent />}
        {tab === 1 && <ToolsContent />}
      </div>
    </div>
  )
}

function TreatmentsContent() {
  const [selected,  setSelected]  = useState(null)
  const [jellyIdx,  setJellyIdx]  = useState(-1)
  const containerRef = useRef(null)
  const domRefs      = useRef([])
  const physRef      = useRef(null)
  const rafRef       = useRef(null)
  const isMob = mob()
  const csz = isMob ? 180 : 244
  const bR  = csz / 2

  const bStyles = [
    { bg:'rgba(155,235,190,0.54)', shine:'rgba(215,255,238,0.90)', glow:'rgba(50,195,115,0.55)'  },
    { bg:'rgba(155,208,252,0.54)', shine:'rgba(212,240,255,0.90)', glow:'rgba(50,155,235,0.55)'  },
    { bg:'rgba(255,228,130,0.54)', shine:'rgba(255,250,205,0.90)', glow:'rgba(228,185,25,0.55)'  },
    { bg:'rgba(212,170,255,0.54)', shine:'rgba(240,220,255,0.90)', glow:'rgba(160,88,242,0.55)'  },
    { bg:'rgba(255,178,198,0.54)', shine:'rgba(255,222,235,0.90)', glow:'rgba(228,82,125,0.55)'  },
    { bg:'rgba(188,218,255,0.54)', shine:'rgba(225,242,255,0.90)', glow:'rgba(95,160,242,0.55)'  },
  ]

  function fireJelly(i) {
    setJellyIdx(i)
    setTimeout(() => setJellyIdx(p => p === i ? -1 : p), 720)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const W = container.offsetWidth
    const H = container.offsetHeight
    const r = bR

    /* 초기 위치: 겹치지 않게 격자 배치 후 랜덤 흩뿌리기 */
    const phys = treatments.map((_, i) => {
      const col = i % 3, row = Math.floor(i / 3)
      const baseX = (col + 0.5) / 3 * W
      const baseY = (row + 0.5) / 2 * H
      const spd   = 1.4 + Math.random() * 0.9
      const dir   = Math.random() * Math.PI * 2
      return {
        x:  Math.max(r, Math.min(W - r, baseX + (Math.random() - 0.5) * 90)),
        y:  Math.max(r, Math.min(H - r, baseY + (Math.random() - 0.5) * 60)),
        vx: Math.cos(dir) * spd,
        vy: Math.sin(dir) * spd,
      }
    })
    physRef.current = phys

    /* 충돌 시 jelly 트리거용 콜백 (ref로 최신 함수 유지) */
    const jellyRef = { fire: (i) => {} }

    function step() {
      const ps = physRef.current
      if (!ps) { rafRef.current = requestAnimationFrame(step); return }
      const W = container.offsetWidth
      const H = container.offsetHeight

      /* 이동 */
      for (const b of ps) { b.x += b.vx; b.y += b.vy }

      /* 벽 반사 */
      for (const b of ps) {
        if (b.x - r < 0)  { b.x = r;     b.vx =  Math.abs(b.vx) }
        if (b.x + r > W)  { b.x = W - r; b.vx = -Math.abs(b.vx) }
        if (b.y - r < 0)  { b.y = r;     b.vy =  Math.abs(b.vy) }
        if (b.y + r > H)  { b.y = H - r; b.vy = -Math.abs(b.vy) }
      }

      /* 버블끼리 충돌 (탄성 충돌) */
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j]
          const dx = b.x - a.x, dy = b.y - a.y
          const d2 = dx*dx + dy*dy
          const minD = r * 2
          if (d2 < minD * minD && d2 > 0.001) {
            const d  = Math.sqrt(d2)
            const nx = dx/d, ny = dy/d
            /* 분리 */
            const ov = (minD - d) * 0.52
            a.x -= nx * ov; a.y -= ny * ov
            b.x += nx * ov; b.y += ny * ov
            /* 속도 교환 */
            const rv = (b.vx - a.vx)*nx + (b.vy - a.vy)*ny
            if (rv < 0) {
              a.vx += rv * nx; a.vy += rv * ny
              b.vx -= rv * nx; b.vy -= rv * ny
            }
            jellyRef.fire(i)
            jellyRef.fire(j)
          }
        }
      }

      /* 속도 범위 유지 (너무 빠르거나 멈추지 않게) */
      for (const b of ps) {
        const spd = Math.sqrt(b.vx*b.vx + b.vy*b.vy)
        if (spd > 3.2) { b.vx = b.vx/spd*3.2; b.vy = b.vy/spd*3.2 }
        if (spd < 0.7) { b.vx = b.vx/spd*0.7; b.vy = b.vy/spd*0.7 }
      }

      /* DOM 직접 업데이트 (React 재렌더 없이 60fps) */
      ps.forEach((b, i) => {
        const el = domRefs.current[i]
        if (el) { el.style.left = `${b.x - r}px`; el.style.top = `${b.y - r}px` }
      })

      rafRef.current = requestAnimationFrame(step)
    }

    /* 충돌 jelly — 너무 잦으면 무시 */
    const jellyTimers = {}
    jellyRef.fire = (i) => {
      if (jellyTimers[i]) return
      jellyTimers[i] = true
      setJellyIdx(i)
      setTimeout(() => { setJellyIdx(p => p === i ? -1 : p); delete jellyTimers[i] }, 680)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [bR])

  return (
    <>
      <style>{`
        @keyframes bJelly {
          0%  {transform:scale(1,1)         rotate(0deg)   }
          16% {transform:scale(1.068,0.940) rotate(-1.6deg)}
          34% {transform:scale(0.948,1.064) rotate(1.4deg) }
          52% {transform:scale(1.040,0.964) rotate(-0.6deg)}
          70% {transform:scale(0.984,1.024) rotate(0.3deg) }
          86% {transform:scale(1.010,0.992) rotate(0deg)   }
          100%{transform:scale(1,1)         rotate(0deg)   }
        }
        @keyframes cloudDrift {
          0%,100%{transform:translate(0,0)}
          40%    {transform:translate(14px,-10px)}
          70%    {transform:translate(-10px,8px)}
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          flex:1, overflow:'hidden', position:'relative',
          background:'linear-gradient(155deg, #FFD0EC 0%, #F0BEFF 46%, #CAD4FF 100%)',
        }}
      >
        {/* 몽환 구름 */}
        {[['6%','4%','230px','180px',0.26,'0s'],['58%','70%','185px','145px',0.21,'1.3s'],
          ['62%','8%','155px','125px',0.23,'2.2s'],['16%','66%','205px','160px',0.19,'0.8s']
        ].map(([t,l,w,h,o,d],i)=>(
          <div key={i} style={{
            position:'absolute', top:t, left:l, width:w, height:h,
            borderRadius:'50%', background:`rgba(255,255,255,${o})`,
            filter:'blur(24px)', pointerEvents:'none',
            animation:`cloudDrift ${7.5+i*1.4}s ease-in-out ${d} infinite`,
          }}/>
        ))}

        {/* 클릭 힌트 */}
        <div style={{
          position:'absolute', top: isMob?10:14, left:'50%', transform:'translateX(-50%)',
          background:'rgba(255,255,255,0.68)', backdropFilter:'blur(10px)',
          border:'1.5px solid rgba(255,255,255,0.88)', borderRadius:50,
          padding: isMob?'5px 16px':'7px 22px',
          fontSize: isMob?'0.70rem':'0.80rem', fontWeight:700,
          color:'rgba(80,40,120,0.72)', whiteSpace:'nowrap', zIndex:10, pointerEvents:'none',
        }}>🫧 버블을 찾아서 클릭해봐요!</div>

        {/* 자유 이동 버블 */}
        {treatments.map((t, i) => {
          const bb  = bStyles[i]
          const isJ = jellyIdx === i
          return (
            <div
              key={i}
              ref={el => domRefs.current[i] = el}
              onClick={() => { fireJelly(i); setSelected(t) }}
              style={{
                position:'absolute',
                width:csz, height:csz, borderRadius:'50%',
                background:`radial-gradient(circle at 30% 26%, ${bb.shine} 0%, ${bb.bg} 56%, ${bb.bg.replace('0.54','0.22')} 100%)`,
                border:'2.5px solid rgba(255,255,255,0.82)',
                boxShadow:`inset 0 6px 20px rgba(255,255,255,0.72), inset 0 -5px 12px rgba(0,0,0,0.05), 0 10px 38px ${bb.glow}, 0 4px 14px rgba(0,0,0,0.07)`,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                cursor:'pointer', userSelect:'none',
                animation: isJ ? 'bJelly 0.70s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
                zIndex: isJ ? 10 : 2,
              }}
            >
              <div style={{ position:'absolute', top:'10%', left:'18%', width:'38%', height:'26%', borderRadius:'50%', background:'rgba(255,255,255,0.78)', filter:'blur(5px)', transform:'rotate(-26deg)', pointerEvents:'none' }}/>
              <span style={{ fontSize: csz*0.29, lineHeight:1, position:'relative', zIndex:1, filter:`drop-shadow(0 3px 9px ${bb.glow})` }}>{t.emoji}</span>
              <p style={{
                fontSize: isMob?'0.60rem':'0.70rem', fontWeight:900,
                color:'rgba(44,28,80,0.82)', marginTop: isMob?4:6,
                textAlign:'center', lineHeight:1.25, padding:`0 ${isMob?6:10}px`,
                position:'relative', zIndex:1, textShadow:'0 1px 4px rgba(255,255,255,0.9)',
              }}>{t.name}</p>
            </div>
          )
        })}
      </div>

      {/* 상세 모달 */}
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
              <button onClick={() => setSelected(null)} style={{ background:'#f0f0f0', border:'none', borderRadius:'50%', width:36, height:36, cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns: mob() ? '1fr' : '1fr 1fr', gap:12, marginBottom:16 }}>
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
    </>
  )
}

function ToolsContent() {
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
        const osc = ctx.createOscillator()
        osc.type = 'sine'; osc.frequency.value = 1760
        g.gain.setValueAtTime(0.2, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        osc.connect(g); osc.start(); osc.stop(ctx.currentTime + dur)
      } else if (key === 'mirror') {
        dur = 1.8
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(2400, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + dur)
        g.gain.setValueAtTime(0.15, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
        osc.connect(g); osc.start(); osc.stop(ctx.currentTime + dur)
      } else if (key === 'explorer') {
        dur = 0.5
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
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'linear-gradient(160deg,#0A2416,#1A5C3A)', overflow:'hidden' }}>
      {/* Tool tray */}
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

      {/* Detail */}
      <div style={{ flex:1, display:'flex', flexDirection: mob() ? 'column' : 'row', background:'rgba(0,0,0,0.18)', borderTop:'2px solid #F5C800', margin: mob() ? '0 10px' : '0 32px', padding: mob() ? '14px' : '22px 28px', overflowY:'auto', gap: mob() ? 12 : 0 }}>
        <div style={{ flex: mob() ? '0 0 auto' : '0 0 120px', display:'flex', flexDirection: mob() ? 'row' : 'column', alignItems:'center', justifyContent: mob() ? 'flex-start' : 'center', gap:16 }}>
          <div key={selected} style={{ width: mob() ? 64 : 88, flexShrink:0 }}>
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

        {!mob() && (
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
        )}

        <div style={{ flex:1, overflowY:'auto', paddingLeft: mob() ? 0 : 14 }}>
          <p style={{ color:'#F5C800', fontWeight:700, letterSpacing:3, fontSize:'0.76rem', marginBottom:8 }}>
            TOOL {selected+1} / {tools.length}
          </p>
          <h2 key={`n${selected}`} style={{ fontSize:'2.4rem', fontWeight:900, color:'white', marginBottom:4, lineHeight:1.1 }}>
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

/* ── BOOK RAIN configs — 순서대로 스텝별 추가됨 ── */
const FALL_BOOKS = [
  { left:'22%', delay:'0s',    dur:'2.2s'  },  // 0 — 초등학교~
  { left:'68%', delay:'0.40s', dur:'1.9s'  },  // 1 — 초등학교~
  { left:'45%', delay:'1.10s', dur:'2.35s' },  // 2 — 중학교~
  { left:'8%',  delay:'0.60s', dur:'2.0s'  },  // 3 — 고등학교~
  { left:'85%', delay:'0.20s', dur:'2.1s'  },  // 4 — 고등학교~
  { left:'55%', delay:'1.50s', dur:'1.85s' },  // 5 — 치과대학~
  { left:'33%', delay:'0.80s', dur:'2.4s'  },  // 6 — 치과대학~
  { left:'77%', delay:'0.30s', dur:'2.15s' },  // 7 — 국가면허~
  { left:'15%', delay:'1.20s', dur:'2.05s' },  // 8 — 국가면허~
  { left:'91%', delay:'0.90s', dur:'1.95s' },  // 9 — 인턴~
]
// 스텝별 보이는 책 수: 초등(1)→중학(2)→고등(4)→치대(7)→면허(9)→인턴(10)→의사(0)
const BOOK_COUNTS = [1, 2, 4, 7, 9, 10, 0]

/* ── BUILDING ILLUSTRATIONS (each step's standalone SVG) ── */
function BuildingIllustration({ step }) {
  const id = `bld${step}`
  const cfgs = [
    { vb:'20 80 112 178', gY:248, gH:12, jsx: <>
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
      <line x1="100" y1="110" x2="100" y2="87" stroke="#AAA" strokeWidth="1.5"/>
      <rect x="100" y="87" width="22" height="13" rx="1" fill="#E53935" opacity="0.9"/>
    </> },
    { vb:'183 128 108 128', gY:248, gH:9, jsx: <>
      <rect x="195" y="138" width="80" height="112" rx="2" fill="#90CAF9" stroke="#1565C0" strokeWidth="1.5"/>
      <rect x="190" y="133" width="90" height="9" rx="2" fill="#1565C0"/>
      {[148,174].map((y,ri) => [202,226,250].map((x,ci) => (
        <rect key={`${ri}-${ci}`} x={x} y={y} width="18" height="16" rx="1" fill="#E3F2FD" stroke="#1565C0" strokeWidth="0.8"/>
      )))}
      <rect x="222" y="218" width="26" height="32" rx="3" fill="#1565C0"/>
      <circle cx="244" cy="234" r="2" fill="#90CAF9"/>
    </> },
    { vb:'350 108 105 148', gY:248, gH:9, jsx: <>
      <rect x="362" y="118" width="86" height="132" rx="2" fill="#80CBC4" stroke="#00695C" strokeWidth="1.5"/>
      <rect x="357" y="113" width="96" height="9" rx="2" fill="#00695C"/>
      {[128,155,182].map((y,ri) => [369,393,418].map((x,ci) => (
        <rect key={`${ri}-${ci}`} x={x} y={y} width="16" height="14" rx="1" fill="#E0F2F1" stroke="#00695C" strokeWidth="0.8"/>
      )))}
      <rect x="388" y="218" width="26" height="32" rx="3" fill="#00695C"/>
      <circle cx="410" cy="234" r="2" fill="#80CBC4"/>
    </> },
    { vb:'505 25 165 232', gY:248, gH:9, jsx: <>
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
    </> },
    { vb:'702 100 115 157', gY:248, gH:9, jsx: <>
      <rect x="720" y="148" width="76" height="102" rx="2" fill="#A5D6A7" stroke="#2E7D32" strokeWidth="1.5"/>
      <polygon points="710,150 806,150 758,108" fill="#2E7D32"/>
      <text x="758" y="198" textAnchor="middle" fontSize="32">📋</text>
      <rect x="742" y="218" width="24" height="32" rx="3" fill="#2E7D32"/>
      <circle cx="762" cy="234" r="2" fill="#A5D6A7"/>
    </> },
    { vb:'862 106 110 150', gY:248, gH:9, jsx: <>
      <rect x="874" y="118" width="90" height="132" rx="2" fill="white" stroke="#E53935" strokeWidth="2"/>
      <rect x="870" y="113" width="98" height="9" rx="2" fill="#E53935"/>
      <rect x="900" y="130" width="16" height="38" rx="2" fill="#E53935"/>
      <rect x="888" y="142" width="40" height="16" rx="2" fill="#E53935"/>
      {[882,906,930].map((x,i) => (
        <rect key={i} x={x} y="182" width="18" height="16" rx="1" fill="#BBDEFB" stroke="#1565C0" strokeWidth="0.8"/>
      ))}
      <rect x="903" y="216" width="24" height="34" rx="3" fill="#E53935"/>
      <circle cx="923" cy="233" r="2" fill="white"/>
    </> },
    { vb:'1004 92 180 165', gY:248, gH:9, jsx: <>
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
    </> },
  ]
  const c = cfgs[step]
  if (!c) return null
  const [vbX, vbY, vbW] = c.vb.split(' ').map(Number)
  return (
    <svg viewBox={c.vb} style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5BAEE8"/>
          <stop offset="100%" stopColor="#C5E8FA"/>
        </linearGradient>
      </defs>
      <rect x={vbX} y={vbY} width={vbW} height={c.gY - vbY} fill={`url(#${id}sky)`}/>
      <rect x={vbX} y={c.gY} width={vbW} height={c.gH} fill="#5DB830"/>
      {c.jsx}
    </svg>
  )
}

/* ── SECTION 2: 치과의사가 되는 법 — 교육 여정 ── */
function CareerSection({ onBack }) {
  const [idx, setIdx]               = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [bounceKey, setBounceKey]   = useState(0)
  const [bounceDir, setBounceDir]   = useState(null)
  const dragRef    = useRef(null)
  const wasDragRef = useRef(false)
  const [escape, setEscape] = useState({ x: 0, caught: false })
  const isMob = mob()

  useEffect(() => { setEscape({ x: 0, caught: false }) }, [idx])

  const s    = careerSteps[idx]
  const cardW = isMob ? 255 : 420
  const cardH = isMob ? 400 : 490
  const gap   = isMob ? 152 : 270

  function go(n) {
    if (n < 0 || n >= careerSteps.length) {
      setBounceDir(n < 0 ? 'right' : 'left')
      setBounceKey(k => k + 1)
      setTimeout(() => setBounceDir(null), 500)
      return
    }
    setIdx(n)
  }

  function onPtrDown(x) { dragRef.current = { x, moved: false } }
  function onPtrMove(x) {
    if (dragRef.current && Math.abs(x - dragRef.current.x) > 8)
      dragRef.current.moved = true
  }
  function onPtrUp(x) {
    if (!dragRef.current) return
    const { x: startX, moved } = dragRef.current
    dragRef.current = null
    if (!moved) return
    const dx = x - startX
    if (Math.abs(dx) > 50) {
      wasDragRef.current = true
      go(dx < 0 ? idx + 1 : idx - 1)
      requestAnimationFrame(() => { wasDragRef.current = false })
    }
  }

  return (
    <div style={{ width:'100vw', height:'100vh', background:'linear-gradient(160deg,#1A2A6C,#0A1230)', display:'flex', flexDirection:'column', overflow:'hidden', fontFamily:"'Noto Sans KR', sans-serif" }}>
      <style>{`
        @keyframes careerBounceLeft {
          0%   { transform: translateX(0px); }
          28%  { transform: translateX(-52px); }
          58%  { transform: translateX(16px); }
          78%  { transform: translateX(-8px); }
          92%  { transform: translateX(3px); }
          100% { transform: translateX(0px); }
        }
        @keyframes careerBounceRight {
          0%   { transform: translateX(0px); }
          28%  { transform: translateX(52px); }
          58%  { transform: translateX(-16px); }
          78%  { transform: translateX(8px); }
          92%  { transform: translateX(-3px); }
          100% { transform: translateX(0px); }
        }
        @keyframes bookFall {
          0%   { top: -60px; opacity: 0;   transform: rotate(-20deg) scale(0.8); }
          8%   { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 108%;  opacity: 0;   transform: rotate(200deg) scale(1.1); }
        }
        @keyframes caughtPop {
          0%   { transform: scale(0.4); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      {/* 헤더 */}
      <div style={{ padding: isMob?'12px 16px':'16px 40px', display:'flex', alignItems:'center', gap:12, flexShrink:0, color:'white' }}>
        <BackBtn onClick={onBack} />
        <h1 style={{ fontSize: isMob?'1.2rem':'1.8rem', fontWeight:900, color:'white' }}>
          치과의사가 되는 <span style={{ color:'#F5C800' }}>법</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.45)', marginLeft:6, fontSize:'0.82rem' }}>초등학교부터 치과의사까지 7단계 여정</p>
      </div>

      {/* 카드 스테이지 */}
      <div
        style={{ flex:1, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', userSelect:'none', touchAction:'none', cursor:'grab' }}
        onMouseDown={e => onPtrDown(e.clientX)}
        onMouseMove={e => onPtrMove(e.clientX)}
        onMouseUp={e => onPtrUp(e.clientX)}
        onMouseLeave={e => { onPtrUp(e.clientX); dragRef.current = null }}
        onTouchStart={e => onPtrDown(e.touches[0].clientX)}
        onTouchMove={e => onPtrMove(e.touches[0].clientX)}
        onTouchEnd={e => onPtrUp(e.changedTouches[0].clientX)}
      >
        {/* 📚 책 비 — 스텝별로 점점 많아짐 */}
        {FALL_BOOKS.slice(0, BOOK_COUNTS[idx]).map((b, bi) => (
          <span key={`book-${bi}`} style={{
            position:'absolute', left: b.left, fontSize: isMob?'1.6rem':'2.2rem',
            pointerEvents:'none', zIndex:5,
            animation: `bookFall ${b.dur} ${b.delay} linear infinite`,
          }}>📚</span>
        ))}

        {/* 화살표 버튼 */}
        {[[-1,'←',isMob?10:36],[1,'→',isMob?10:36]].map(([dir, label, edge]) => {
          const target = idx + dir
          const ok = target >= 0 && target < careerSteps.length
          return (
            <button key={dir} onClick={() => go(target)}
              style={{
                position:'absolute', [dir===-1?'left':'right']: edge, zIndex:30,
                width: isMob?42:54, height: isMob?42:54, borderRadius:'50%',
                background: ok ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                border:`1.5px solid rgba(255,255,255,${ok?0.22:0.07})`,
                backdropFilter:'blur(10px)', color:'white',
                fontSize: isMob?'1.2rem':'1.5rem',
                cursor: ok ? 'pointer' : 'default',
                opacity: ok ? 1 : 0.25, transition:'all 0.18s',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'inherit',
              }}
            >{label}</button>
          )
        })}

        {/* 카드 트랙 — 바운스 wrapper */}
        <div key={bounceKey} style={{
          position:'absolute', inset:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          animation: bounceDir ? `careerBounce${bounceDir === 'left' ? 'Left' : 'Right'} 0.50s cubic-bezier(0.36,0.07,0.19,0.97) both` : 'none',
          pointerEvents:'none',
        }}>
          {careerSteps.map((cs, i) => {
            const diff      = i - idx
            const abs       = Math.abs(diff)
            const isHov     = hoveredIdx === i && abs > 0
            const baseScale = abs === 0 ? 1 : abs === 1 ? 0.70 : abs === 2 ? 0.50 : 0.36
            const scale     = isHov ? Math.min(baseScale + 0.10, 0.82) : baseScale
            const tx        = diff * gap
            const op        = abs === 0 ? 1 : abs === 1 ? 0.55 : abs === 2 ? 0.25 : 0
            const zI        = 20 - abs * 5
            const active    = abs === 0

            return (
              <div key={i}
                onClick={() => { if (wasDragRef.current) return; !active && go(i) }}
                onMouseEnter={() => abs > 0 && setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position:'absolute',
                  width: cardW, height: cardH,
                  transform: `translateX(${tx}px) scale(${scale})`,
                  opacity: op,
                  zIndex: zI,
                  transition:'transform 0.40s cubic-bezier(0.22,0.8,0.36,1), opacity 0.40s, box-shadow 0.40s',
                  cursor: active ? 'default' : 'pointer',
                  pointerEvents: abs > 2 ? 'none' : 'auto',
                  background: active
                    ? `linear-gradient(160deg, ${cs.color}20, ${cs.color}08)`
                    : 'rgba(255,255,255,0.05)',
                  backdropFilter:'blur(20px)',
                  borderRadius: isMob ? 28 : 36,
                  border:`2px solid ${active ? cs.color+'88' : 'rgba(255,255,255,0.10)'}`,
                  boxShadow: active
                    ? `0 0 120px ${cs.color}2A, 0 24px 64px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.12)`
                    : 'none',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  textAlign:'center', padding: isMob?'16px 14px':'24px 36px', gap: isMob?8:12,
                  overflow:'hidden',
                }}
              >
                {/* 상단 뱃지 */}
                <div style={{ display:'flex', gap:8, alignItems:'center', opacity: active?1:0, transition:'opacity 0.35s', flexShrink:0 }}>
                  <div style={{ background:`${cs.color}28`, border:`1.5px solid ${cs.color}55`, borderRadius:50, padding: isMob?'3px 12px':'4px 16px', fontSize: isMob?'0.68rem':'0.76rem', fontWeight:800, color:cs.color }}>
                    STEP {i + 1}
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.10)', border:'1.5px solid rgba(255,255,255,0.18)', borderRadius:50, padding: isMob?'3px 12px':'4px 16px', fontSize: isMob?'0.68rem':'0.76rem', fontWeight:800, color:'rgba(255,255,255,0.75)' }}>
                    {cs.years}
                  </div>
                </div>

                {/* 건물 일러스트 (치과대학은 마우스로 도망감) */}
                <div style={{ width:'100%', height: isMob?96:138, flexShrink:0, position:'relative',
                  filter: active ? `drop-shadow(0 4px 16px ${cs.color}66)` : 'none',
                  transition:'filter 0.4s', opacity: active ? 1 : 0.72 }}>
                  <div
                    style={{
                      width:'100%', height:'100%', borderRadius:12, overflow:'hidden',
                      transform: (active && i === 3) ? `translateX(${escape.x}px)` : 'none',
                      transition: 'transform 0.20s ease-out',
                      cursor: (active && i === 3) ? 'pointer' : 'default',
                    }}
                    onMouseMove={(active && i === 3) ? (e => {
                      if (escape.caught) return
                      const r = e.currentTarget.getBoundingClientRect()
                      const side = e.clientX < r.left + r.width / 2 ? 1 : -1
                      setEscape(prev => ({ ...prev, x: side * 28 }))
                    }) : undefined}
                    onMouseLeave={(active && i === 3) ? (() => setEscape(prev => ({ ...prev, x: 0 }))) : undefined}
                    onClick={(active && i === 3) ? (e => {
                      e.stopPropagation()
                      setEscape({ x: 0, caught: true })
                      setTimeout(() => setEscape({ x: 0, caught: false }), 1400)
                    }) : undefined}
                  >
                    <BuildingIllustration step={i} />
                  </div>
                  {active && i === 3 && escape.caught && (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize: isMob?'1.1rem':'1.4rem', fontWeight:900, color:'#F9A825',
                      textShadow:'0 2px 10px rgba(0,0,0,0.7)', pointerEvents:'none',
                      animation:'caughtPop 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
                      잡았다! 🎉
                    </div>
                  )}
                  {active && i === 3 && !escape.caught && escape.x === 0 && (
                    <div style={{ position:'absolute', bottom:6, right:8, fontSize:'0.65rem', color:'rgba(255,255,255,0.45)', pointerEvents:'none' }}>
                      건물을 잡아봐요 👆
                    </div>
                  )}
                </div>

                {/* 이름 */}
                <p style={{
                  fontWeight:900, margin:0, lineHeight:1.2,
                  fontSize: active ? (isMob?'1.6rem':'2.3rem') : (isMob?'1.05rem':'1.45rem'),
                  color: active ? cs.color : 'rgba(255,255,255,0.60)',
                  transition:'all 0.4s',
                }}>{cs.label}</p>

                {/* 구분선 + 설명 (활성만 페이드인) */}
                <div style={{ opacity: active?1:0, maxHeight: active ? 240 : 0, overflow:'hidden', transition:'opacity 0.35s 0.1s, max-height 0.40s', display:'flex', flexDirection:'column', alignItems:'center', gap: isMob?10:14 }}>
                  <div style={{ width:44, height:3, background:cs.color, borderRadius:2, opacity:0.65 }}/>
                  <p style={{ fontSize: isMob?'0.9rem':'1.05rem', color:'rgba(255,255,255,0.65)', fontWeight:700, margin:0 }}>{cs.desc}</p>
                  <p style={{ fontSize: isMob?'0.82rem':'0.95rem', color:'rgba(255,255,255,0.78)', lineHeight:1.8, margin:0, whiteSpace:'pre-line' }}>{cs.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 하단: 도트 + 슬라이더 */}
      <div style={{ padding: isMob?'10px 24px 22px':'14px 60px 28px', display:'flex', flexDirection:'column', alignItems:'center', gap:12, flexShrink:0 }}>
        <div style={{ display:'flex', gap:7 }}>
          {careerSteps.map((cs, i) => (
            <div key={i} onClick={() => go(i)} style={{
              width: i===idx?26:8, height:8, borderRadius:4,
              background: i===idx ? cs.color : 'rgba(255,255,255,0.20)',
              cursor:'pointer', transition:'all 0.28s',
            }}/>
          ))}
        </div>
        <div
          style={{ width: isMob?'88%':'68%', height:6, background:'rgba(255,255,255,0.10)', borderRadius:3, cursor:'pointer', position:'relative' }}
          onClick={e => {
            const r = e.currentTarget.getBoundingClientRect()
            go(Math.round((e.clientX - r.left) / r.width * (careerSteps.length - 1)))
          }}
        >
          <div style={{ position:'absolute', left:0, top:0, bottom:0, borderRadius:3, transition:'width 0.28s, background 0.28s',
            width:`${idx/(careerSteps.length-1)*100}%`, background:s.color }}/>
          <div style={{ position:'absolute', top:'50%', transform:'translate(-50%,-50%)', transition:'left 0.28s, background 0.28s',
            left:`${idx/(careerSteps.length-1)*100}%`,
            width:18, height:18, borderRadius:'50%', background:s.color,
            border:'2.5px solid white', boxShadow:`0 0 10px ${s.color}88` }}/>
        </div>
      </div>
    </div>
  )
}

/* ── SECTION 3: 치과의사의 다양한 종류 ── */
function SpecialtiesSection({ onBack }) {
  const [idx, setIdx]               = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [bounceKey, setBounceKey]   = useState(0)
  const [bounceDir, setBounceDir]   = useState(null)
  const dragRef    = useRef(null)
  const wasDragRef = useRef(false)
  const isMob = mob()
  const s    = specialties[idx]
  const cardW = isMob ? 230 : 400
  const cardH = isMob ? 330 : 400
  const gap   = isMob ? 138 : 250

  function go(n) {
    if (n < 0 || n >= specialties.length) {
      setBounceDir(n < 0 ? 'right' : 'left')
      setBounceKey(k => k + 1)
      setTimeout(() => setBounceDir(null), 500)
      return
    }
    setIdx(n)
  }

  function onPtrDown(x) { dragRef.current = { x, moved: false } }
  function onPtrMove(x) {
    if (dragRef.current && Math.abs(x - dragRef.current.x) > 8)
      dragRef.current.moved = true
  }
  function onPtrUp(x) {
    if (!dragRef.current) return
    const { x: startX, moved } = dragRef.current
    dragRef.current = null
    if (!moved) return
    const dx = x - startX
    if (Math.abs(dx) > 50) {
      wasDragRef.current = true
      go(dx < 0 ? idx + 1 : idx - 1)
      requestAnimationFrame(() => { wasDragRef.current = false })
    }
  }

  return (
    <div style={{ width:'100vw', height:'100vh', background:'linear-gradient(160deg,#1A3A7C,#0A1E40)', display:'flex', flexDirection:'column', overflow:'hidden', fontFamily:"'Noto Sans KR', sans-serif" }}>
      <style>{`
        @keyframes bounceLeft {
          0%   { transform: translateX(0px); }
          28%  { transform: translateX(-52px); }
          58%  { transform: translateX(16px); }
          78%  { transform: translateX(-8px); }
          92%  { transform: translateX(3px); }
          100% { transform: translateX(0px); }
        }
        @keyframes bounceRight {
          0%   { transform: translateX(0px); }
          28%  { transform: translateX(52px); }
          58%  { transform: translateX(-16px); }
          78%  { transform: translateX(8px); }
          92%  { transform: translateX(-3px); }
          100% { transform: translateX(0px); }
        }
      `}</style>

      {/* 헤더 */}
      <div style={{ padding: isMob?'12px 16px':'16px 40px', display:'flex', alignItems:'center', gap:12, flexShrink:0, color:'white' }}>
        <BackBtn onClick={onBack} />
        <h1 style={{ fontSize: isMob?'1.2rem':'1.8rem', fontWeight:900, color:'white' }}>
          치과의사의 다양한 <span style={{ color:'#F5C800' }}>종류</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.45)', marginLeft:6, fontSize:'0.82rem' }}>8가지 전문 분야</p>
      </div>

      {/* 카드 스테이지 */}
      <div
        style={{ flex:1, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', userSelect:'none', touchAction:'none', cursor:'grab' }}
        onMouseDown={e => onPtrDown(e.clientX)}
        onMouseMove={e => onPtrMove(e.clientX)}
        onMouseUp={e => onPtrUp(e.clientX)}
        onMouseLeave={e => { onPtrUp(e.clientX); dragRef.current = null }}
        onTouchStart={e => onPtrDown(e.touches[0].clientX)}
        onTouchMove={e => onPtrMove(e.touches[0].clientX)}
        onTouchEnd={e => onPtrUp(e.changedTouches[0].clientX)}
      >
        {/* 화살표 버튼 */}
        {[[-1,'←',isMob?10:36],[1,'→',isMob?10:36]].map(([dir, label, edge]) => {
          const target = idx + dir
          const ok = target >= 0 && target < specialties.length
          return (
            <button key={dir} onClick={() => go(target)}
              style={{
                position:'absolute', [dir===-1?'left':'right']: edge, zIndex:30,
                width: isMob?42:54, height: isMob?42:54, borderRadius:'50%',
                background: ok ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                border:`1.5px solid rgba(255,255,255,${ok?0.22:0.07})`,
                backdropFilter:'blur(10px)', color:'white',
                fontSize: isMob?'1.2rem':'1.5rem',
                cursor: ok ? 'pointer' : 'default',
                opacity: ok ? 1 : 0.25, transition:'all 0.18s',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'inherit',
              }}
            >{label}</button>
          )
        })}

        {/* 카드 트랙 — 바운스 wrapper */}
        <div key={bounceKey} style={{
          position:'absolute', inset:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          animation: bounceDir ? `bounce${bounceDir === 'left' ? 'Left' : 'Right'} 0.50s cubic-bezier(0.36,0.07,0.19,0.97) both` : 'none',
          pointerEvents:'none',
        }}>
          {specialties.map((sp, i) => {
            const diff      = i - idx
            const abs       = Math.abs(diff)
            const isHov     = hoveredIdx === i && abs > 0
            const baseScale = abs === 0 ? 1 : abs === 1 ? 0.72 : abs === 2 ? 0.52 : 0.38
            const scale     = isHov ? Math.min(baseScale + 0.10, 0.84) : baseScale
            const tx        = diff * gap
            const op        = abs === 0 ? 1 : abs === 1 ? 0.60 : abs === 2 ? 0.28 : 0
            const zI        = 20 - abs * 5
            const active    = abs === 0

            return (
              <div key={i}
                onClick={() => { if (wasDragRef.current) return; !active && go(i) }}
                onMouseEnter={() => abs > 0 && setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  position:'absolute',
                  width: cardW, height: cardH,
                  transform: `translateX(${tx}px) scale(${scale})`,
                  opacity: op,
                  zIndex: zI,
                  transition:'transform 0.40s cubic-bezier(0.22,0.8,0.36,1), opacity 0.40s, box-shadow 0.40s',
                  cursor: active ? 'default' : 'pointer',
                  pointerEvents: abs > 2 ? 'none' : 'auto',
                  background: active ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)',
                  backdropFilter:'blur(20px)',
                  borderRadius: isMob ? 24 : 32,
                  border:`2px solid ${active ? sp.color+'66' : 'rgba(255,255,255,0.10)'}`,
                  boxShadow: active ? `0 0 100px ${sp.color}38, 0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)` : 'none',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  textAlign:'center', padding: isMob?'22px 16px':'36px 44px', gap: isMob?10:16,
                  overflow:'hidden',
                }}
              >
                {/* 번호 뱃지 (활성만) */}
                <div style={{ opacity: active?1:0, transition:'opacity 0.35s',
                  background:`${sp.color}28`, border:`1.5px solid ${sp.color}55`,
                  borderRadius:50, padding: isMob?'3px 12px':'4px 16px',
                  fontSize: isMob?'0.68rem':'0.76rem', fontWeight:800, color:sp.color }}>
                  {i+1} / {specialties.length}
                </div>

                {/* 이모지 */}
                <div style={{
                  fontSize: isMob?'3.8rem':'5.8rem', lineHeight:1,
                  filter: active ? `drop-shadow(0 0 24px ${sp.color}BB)` : 'none',
                  transition:'filter 0.4s',
                }}>{sp.emoji}</div>

                {/* 이름 */}
                <p style={{
                  fontWeight:900, margin:0, lineHeight:1.2,
                  fontSize: active ? (isMob?'1.5rem':'2.1rem') : (isMob?'1.0rem':'1.4rem'),
                  color: active ? sp.color : 'rgba(255,255,255,0.65)',
                  transition:'all 0.4s',
                }}>{sp.name}</p>

                {/* 구분선 + 설명 (활성만 페이드인) */}
                <div style={{ opacity: active?1:0, maxHeight: active ? 200 : 0, overflow:'hidden', transition:'opacity 0.35s 0.1s, max-height 0.35s', display:'flex', flexDirection:'column', alignItems:'center', gap: isMob?8:12 }}>
                  <div style={{ width:44, height:3, background:sp.color, borderRadius:2, opacity:0.65 }}/>
                  <p style={{ fontSize: isMob?'0.88rem':'1.02rem', color:'rgba(255,255,255,0.82)', lineHeight:1.70, margin:0 }}>{sp.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 하단: 도트 + 슬라이더 */}
      <div style={{ padding: isMob?'10px 24px 22px':'14px 60px 28px', display:'flex', flexDirection:'column', alignItems:'center', gap:12, flexShrink:0 }}>
        <div style={{ display:'flex', gap:7 }}>
          {specialties.map((sp, i) => (
            <div key={i} onClick={() => go(i)} style={{
              width: i===idx?26:8, height:8, borderRadius:4,
              background: i===idx ? sp.color : 'rgba(255,255,255,0.20)',
              cursor:'pointer', transition:'all 0.28s',
            }}/>
          ))}
        </div>
        <div
          style={{ width: isMob?'88%':'68%', height:6, background:'rgba(255,255,255,0.10)', borderRadius:3, cursor:'pointer', position:'relative' }}
          onClick={e => {
            const r = e.currentTarget.getBoundingClientRect()
            go(Math.round((e.clientX - r.left) / r.width * (specialties.length - 1)))
          }}
        >
          <div style={{ position:'absolute', left:0, top:0, bottom:0, borderRadius:3, transition:'width 0.28s, background 0.28s',
            width:`${idx/(specialties.length-1)*100}%`, background:s.color }}/>
          <div style={{ position:'absolute', top:'50%', transform:'translate(-50%,-50%)', transition:'left 0.28s, background 0.28s',
            left:`${idx/(specialties.length-1)*100}%`,
            width:18, height:18, borderRadius:'50%', background:s.color,
            border:'2.5px solid white', boxShadow:`0 0 10px ${s.color}88` }}/>
        </div>
      </div>
    </div>
  )
}

/* ── FACTS SECTION: 치아 정보 ── */
function FactsSection({ onBack }) {
  const [idx, setIdx] = useState(0)
  const fact = facts[idx]

  return (
    <div style={{ width:'100vw', height:'100vh', background:`linear-gradient(135deg,${fact.bg[0]},${fact.bg[1]})`, transition:'background 0.5s ease', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', right:-80, bottom:-80, width:360, height:360, borderRadius:'50%', background:'rgba(255,255,255,0.25)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', left:-50, top:-50, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.25)', pointerEvents:'none' }}/>

      <div style={{ padding:'22px 40px', display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
        <BackBtn onClick={onBack} />
        <h1 style={{ fontSize:'1.9rem', fontWeight:900, color:'#1A1A1A' }}>🦷 <span style={{ color:'#1A5C3A' }}>치아 정보</span></h1>
        <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
          {facts.map((_,i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ width:i===idx?28:8, height:8, borderRadius:4, background:i===idx?'#1A5C3A':'rgba(0,0,0,0.2)', cursor:'pointer', transition:'all 0.3s' }}/>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding: mob() ? '0 20px' : '0 80px', overflowY:'auto' }}>
        <div key={idx} style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
          <div style={{ fontSize: mob() ? '5rem' : '9rem', lineHeight:1, marginBottom: mob() ? 16 : 28 }}>{fact.emoji}</div>
          <p style={{ fontSize: mob() ? '1.6rem' : '2.4rem', fontWeight:900, maxWidth:720, lineHeight:1.4, color:'#1A1A1A', marginBottom: mob() ? 12 : 18, whiteSpace:'pre-line' }}>{fact.text}</p>
          <p style={{ fontSize: mob() ? '0.95rem' : '1.15rem', color:'#555', maxWidth:580, lineHeight:1.75 }}>{fact.sub}</p>
        </div>
      </div>

      <div style={{ padding:'0 40px 36px', display:'flex', justifyContent:'center', gap:12 }}>
        <button disabled={idx===0} onClick={() => setIdx(i=>i-1)} style={{ background:'rgba(0,0,0,0.1)', border:'none', borderRadius:50, padding:'12px 28px', fontFamily:'inherit', fontWeight:700, fontSize:'1rem', cursor:idx===0?'default':'pointer', opacity:idx===0?0.35:1, color:'#333' }}>← 이전</button>
        <button disabled={idx===facts.length-1} onClick={() => setIdx(i=>i+1)} style={{ background:idx===facts.length-1?'rgba(26,92,58,0.25)':'#1A5C3A', border:'none', borderRadius:50, padding:'12px 28px', fontFamily:'inherit', fontWeight:700, fontSize:'1rem', cursor:idx===facts.length-1?'default':'pointer', opacity:idx===facts.length-1?0.5:1, color:'white' }}>다음 사실 →</button>
      </div>
    </div>
  )
}
