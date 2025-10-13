export const metadata = { title: 'Pleadings Pro' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0, fontFamily:'system-ui, sans-serif'}}>
        <header style={{padding:'12px 24px', borderBottom:'1px solid #eee'}}>
          <a href="/" style={{marginRight:16}}>Home</a>
          <a href="/about">About</a>
          <a href="/api/health" style={{marginLeft:16}}>Health</a>
        </header>
        {children}
      </body>
    </html>
  );
}
