export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT id, student_name, content, created_at FROM comments ORDER BY created_at DESC LIMIT 50'
  ).all()
  return Response.json(results)
}

export async function onRequestPost({ request, env }) {
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
