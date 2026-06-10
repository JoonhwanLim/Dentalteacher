const BASE = '/api'

export const api = {
  comments: {
    async list() {
      try {
        const r = await fetch(`${BASE}/comments`)
        return r.ok ? r.json() : []
      } catch { return [] }
    },
    async insert(student_name, content) {
      try {
        const r = await fetch(`${BASE}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_name, content }),
        })
        return r.ok ? r.json() : null
      } catch { return null }
    },
  },

  quizResults: {
    async insert(student_name, score, total) {
      try {
        await fetch(`${BASE}/quiz-results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_name, score, total }),
        })
      } catch { /* 저장 실패해도 퀴즈 진행에 영향 없음 */ }
    },
  },

  gameScores: {
    async leaderboard() {
      try {
        const r = await fetch(`${BASE}/game-scores`)
        return r.ok ? r.json() : []
      } catch { return [] }
    },
    async upsert(student_name, score) {
      try {
        const r = await fetch(`${BASE}/game-scores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_name, score }),
        })
        return r.ok ? r.json() : { updated: false }
      } catch { return { updated: false } }
    },
  },
}
