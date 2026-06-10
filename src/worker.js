async function handleComments(request, env) {
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT id, student_name, content, created_at FROM comments ORDER BY created_at DESC LIMIT 50'
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

async function handleQuizResults(request, env) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })
  const { student_name, score, total } = await request.json()
  if (!student_name) return new Response('Bad Request', { status: 400 })
  await env.DB.prepare(
    'INSERT INTO quiz_results (student_name, score, total) VALUES (?, ?, ?)'
  ).bind(student_name, score ?? 0, total ?? 0).run()
  return Response.json({ ok: true })
}

async function handleGameScores(request, env) {
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT student_name, score FROM game_scores ORDER BY score DESC LIMIT 10'
    ).all()
    return Response.json(results)
  }
  if (request.method === 'POST') {
    const { student_name, score } = await request.json()
    if (!student_name) return new Response('Bad Request', { status: 400 })
    const existing = await env.DB.prepare(
      'SELECT id, score FROM game_scores WHERE student_name = ? ORDER BY score DESC LIMIT 1'
    ).bind(student_name).first()
    if (existing && score <= existing.score) return Response.json({ updated: false })
    if (existing) {
      await env.DB.prepare('UPDATE game_scores SET score = ? WHERE id = ?')
        .bind(score, existing.id).run()
    } else {
      await env.DB.prepare('INSERT INTO game_scores (student_name, score) VALUES (?, ?)')
        .bind(student_name, score).run()
    }
    return Response.json({ updated: true })
  }
  return new Response('Method Not Allowed', { status: 405 })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/comments')     return handleComments(request, env)
    if (url.pathname === '/api/quiz-results') return handleQuizResults(request, env)
    if (url.pathname === '/api/game-scores')  return handleGameScores(request, env)

    return env.ASSETS.fetch(request)
  },
}
