export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, received: body }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
}
