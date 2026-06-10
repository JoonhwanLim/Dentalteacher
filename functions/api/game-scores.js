export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT student_name, score FROM game_scores ORDER BY score DESC LIMIT 10'
  ).all()
  return Response.json(results)
}

export async function onRequestPost({ request, env }) {
  const { student_name, score } = await request.json()
  if (!student_name) return new Response('Bad Request', { status: 400 })

  const existing = await env.DB.prepare(
    'SELECT id, score FROM game_scores WHERE student_name = ? ORDER BY score DESC LIMIT 1'
  ).bind(student_name).first()

  if (existing && score <= existing.score) {
    return Response.json({ updated: false })
  }

  if (existing) {
    await env.DB.prepare('UPDATE game_scores SET score = ? WHERE id = ?')
      .bind(score, existing.id).run()
  } else {
    await env.DB.prepare('INSERT INTO game_scores (student_name, score) VALUES (?, ?)')
      .bind(student_name, score).run()
  }

  return Response.json({ updated: true })
}
