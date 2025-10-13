export const metadata = {
title: "WestlawAI — Draft court‑ready pleadings",
description: "Minimal UI. Maximal clarity. Draft pleadings with provenance."
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
