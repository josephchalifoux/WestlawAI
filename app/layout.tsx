// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WestlawAI — Draft court-ready pleadings with provenance.",
  description:
    "Minimal UI. Maximal clarity. Research with provenance, assemble arguments, and export DOCX/PDF in court-ready formats.",
  openGraph: {
    title: "WestlawAI",
    description:
      "Research with provenance, assemble arguments, and export court-ready pleadings.",
    url: "https://westlawai.com",
    siteName: "WestlawAI",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "WestlawAI" }],
  },
  twitter: { card: "summary_large_image", title: "WestlawAI" },
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
