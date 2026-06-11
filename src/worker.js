async function handleComments(request, env) {
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT id, student_name, content, created_at FROM comments WHERE is_deleted = 0 ORDER BY created_at DESC LIMIT 50'
    ).all()
    return Response.json(results)
  }
  if (request.method === 'POST') {
    const { student_name, content } = await request.json()
    if (!student_name || !content) return new Response('Bad Request', { status: 400 })
    const result = await env.DB.prepare(
      'INSERT INTO comments (student_name, content) VALUES (?, ?)'
    ).bind(student_name, content.slice(0, 200)).run()
    return Response.json({
      id: result.meta.last_row_id,
      student_name,
      content,
      created_at: new Date().toISOString(),
    })
  }
  return new Response('Method Not Allowed', { status: 405 })
}

async function handleDeleteComment(request, env, id) {
  if (request.method !== 'DELETE') return new Response('Method Not Allowed', { status: 405 })
  const { student_name } = await request.json()
  if (!student_name || !id) return new Response('Bad Request', { status: 400 })
  // 본인 댓글만 삭제 가능 (서버에서도 검증)
  const row = await env.DB.prepare(
    'SELECT id FROM comments WHERE id = ? AND student_name = ? AND is_deleted = 0'
  ).bind(id, student_name).first()
  if (!row) return new Response('Forbidden', { status: 403 })
  await env.DB.prepare('UPDATE comments SET is_deleted = 1 WHERE id = ?').bind(id).run()
  return Response.json({ ok: true })
}

async function handleQuizResults(request, env) {
  if (request.method === 'GET') {
    const url = new URL(request.url)
    const name = url.searchParams.get('name')
    if (!name) return new Response('Bad Request', { status: 400 })
    const row = await env.DB.prepare(
      'SELECT id, score, total FROM quiz_results WHERE student_name = ? ORDER BY id DESC LIMIT 1'
    ).bind(name).first()
    return Response.json({ completed: !!row, score: row?.score ?? 0, total: row?.total ?? 0 })
  }
  if (request.method === 'POST') {
    const { student_name, score, total } = await request.json()
    if (!student_name) return new Response('Bad Request', { status: 400 })
    await env.DB.prepare(
      'INSERT INTO quiz_results (student_name, score, total) VALUES (?, ?, ?)'
    ).bind(student_name, score ?? 0, total ?? 0).run()
    return Response.json({ ok: true })
  }
  return new Response('Method Not Allowed', { status: 405 })
}

async function handleGameScores(request, env) {
  if (request.method === 'GET') {
    const url = new URL(request.url)
    const me = url.searchParams.get('me')
    const { results } = await env.DB.prepare(
      'SELECT student_name, score, attempts FROM game_scores ORDER BY score DESC LIMIT 10'
    ).all()
    let myAttempts = 0, myBonusUsed = false
    if (me) {
      const myRow = await env.DB.prepare(
        'SELECT attempts, bonus_used FROM game_scores WHERE student_name = ?'
      ).bind(me).first()
      myAttempts  = myRow?.attempts   ?? 0
      myBonusUsed = !!(myRow?.bonus_used)
    }
    return Response.json({ leaderboard: results, myAttempts, myBonusUsed })
  }
  if (request.method === 'POST') {
    const { student_name, score } = await request.json()
    if (!student_name) return new Response('Bad Request', { status: 400 })
    const existing = await env.DB.prepare(
      'SELECT id, score FROM game_scores WHERE student_name = ? ORDER BY score DESC LIMIT 1'
    ).bind(student_name).first()
    if (existing) {
      if (score > existing.score) {
        await env.DB.prepare('UPDATE game_scores SET score = ?, attempts = attempts + 1 WHERE id = ?')
          .bind(score, existing.id).run()
        return Response.json({ updated: true })
      } else {
        await env.DB.prepare('UPDATE game_scores SET attempts = attempts + 1 WHERE id = ?')
          .bind(existing.id).run()
        return Response.json({ updated: false })
      }
    } else {
      await env.DB.prepare('INSERT INTO game_scores (student_name, score, attempts) VALUES (?, ?, 1)')
        .bind(student_name, score).run()
      return Response.json({ updated: true })
    }
  }
  return new Response('Method Not Allowed', { status: 405 })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/game-scores/bonus' && request.method === 'POST') {
      const { student_name } = await request.json()
      if (!student_name) return new Response('Bad Request', { status: 400 })
      const row = await env.DB.prepare(
        'SELECT id, bonus_used FROM game_scores WHERE student_name = ?'
      ).bind(student_name).first()
      if (!row)           return Response.json({ ok: false, reason: 'no_record' })
      if (row.bonus_used) return Response.json({ ok: false, reason: 'already_used' })
      await env.DB.prepare('UPDATE game_scores SET bonus_used = 1 WHERE id = ?').bind(row.id).run()
      return Response.json({ ok: true })
    }
    if (url.pathname === '/api/comments')     return handleComments(request, env)
    if (url.pathname.startsWith('/api/comments/') && request.method === 'DELETE') {
      const id = parseInt(url.pathname.split('/')[3])
      return handleDeleteComment(request, env, id)
    }
    if (url.pathname === '/api/quiz-results') return handleQuizResults(request, env)
    if (url.pathname === '/api/game-scores')  return handleGameScores(request, env)
    if (url.pathname === '/api/game-logs' && request.method === 'POST') {
      const { student_name, score } = await request.json()
      if (!student_name) return new Response('Bad Request', { status: 400 })
      await env.DB.prepare(
        'INSERT INTO game_logs (student_name, score) VALUES (?, ?)'
      ).bind(student_name, score ?? 0).run()
      return Response.json({ ok: true })
    }

    const res = await env.ASSETS.fetch(request)
    if (res.status === 404) {
      return env.ASSETS.fetch(new Request(new URL('/', request.url).toString(), request))
    }
    return res
  },
}
