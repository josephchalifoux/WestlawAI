export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto" }}>
      <h1>Pleadings Pro</h1>
      <p>If you can see this, deployment worked 🎉</p>
      <p><a href="/api/health" style={{ textDecoration: "underline" }}>Health check</a></p>
    </main>
  );
}
