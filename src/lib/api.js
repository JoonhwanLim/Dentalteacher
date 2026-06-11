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
    async remove(id, student_name) {
      try {
        const r = await fetch(`${BASE}/comments/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_name }),
        })
        return r.ok
      } catch { return false }
    },
  },

  quizResults: {
    async isCompleted(student_name) {
      try {
        const r = await fetch(`${BASE}/quiz-results?name=${encodeURIComponent(student_name)}`)
        if (!r.ok) return false
        const data = await r.json()
        return data.completed === true
      } catch { return false }
    },
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
    async leaderboard(studentName) {
      try {
        const qs = studentName ? `?me=${encodeURIComponent(studentName)}` : ''
        const r = await fetch(`${BASE}/game-scores${qs}`)
        if (!r.ok) return { leaderboard: [], myAttempts: 0, myBonusUsed: false }
        return r.json()
      } catch { return { leaderboard: [], myAttempts: 0, myBonusUsed: false } }
    },
    async useBonus(student_name) {
      try {
        const r = await fetch(`${BASE}/game-scores/bonus`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_name }),
        })
        return r.ok ? r.json() : { ok: false }
      } catch { return { ok: false } }
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
