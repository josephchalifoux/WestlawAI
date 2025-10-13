'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [resp, setResp] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const r = await fetch('/api/echo', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: text }),
    });
    setResp(await r.json());
  }

  return (
    <main style={{padding:24, fontFamily:'system-ui, sans-serif'}}>
      <h1>Pleadings Pro</h1>
      <form onSubmit={onSubmit} style={{margin:'16px 0'}}>
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Type anything…"
          style={{padding:8, width:280, marginRight:8}}
        />
        <button type="submit" style={{padding:'8px 12px'}}>Send</button>
      </form>
      {resp && (
        <pre style={{background:'#f7f7f7', padding:12, borderRadius:8}}>
{JSON.stringify(resp, null, 2)}
        </pre>
      )}
      <p>Health check: <a href="/api/health" target="_blank">/api/health</a></p>
    </main>
  );
}
