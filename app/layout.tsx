import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reid — Software Engineer & Creative Technologist",
  description:
    "Portfolio of Reid, a creative developer specializing in low-level systems, AI pipelines, and full-stack web experiences.",
  keywords: [
    "portfolio",
    "software engineer",
    "C++",
    "AI",
    "Next.js",
    "Python",
  ],
  openGraph: {
    title: "Reid — Software Engineer & Creative Technologist",
    description: "Building at the intersection of systems, AI, and the web.",
    type: "website",
  },
};

export const viewport: import("next").Viewport = {
  themeColor: "#0c0c0c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="noise">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
