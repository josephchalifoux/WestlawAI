export const metadata = {
  title: "Pleadings Pro",
  description: "Minimal Next.js app deployed on Vercel"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 24 }}>
        {children}
      </body>
    </html>
  );
}
