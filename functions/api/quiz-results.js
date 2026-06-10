export async function onRequestPost({ request, env }) {
  const { student_name, score, total } = await request.json()
  if (!student_name) return new Response('Bad Request', { status: 400 })

  await env.DB.prepare(
    'INSERT INTO quiz_results (student_name, score, total) VALUES (?, ?, ?)'
  ).bind(student_name, score ?? 0, total ?? 0).run()

  return Response.json({ ok: true })
}
