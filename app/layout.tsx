import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import "./globals.css";

function getSiteConfig() {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "data", "site-config.json"),
      "utf-8",
    );
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const config = getSiteConfig();

export const metadata: Metadata = {
  title:
    config?.seo?.title ??
    "ReidTech | Software Engineer & Creative Technologist",
  description:
    config?.seo?.description ??
    "Portfolio of Reid, a creative developer specializing in low-level systems, AI pipelines, and full-stack web experiences.",
  keywords: config?.seo?.keywords ?? [
    "portfolio",
    "software engineer",
    "C++",
    "AI",
    "Next.js",
    "Python",
  ],
  openGraph: {
    title:
      config?.seo?.ogTitle ??
      "Reid — Software Engineer & Creative Technologist",
    description:
      config?.seo?.ogDescription ??
      "Building at the intersection of systems, AI, and the web.",
    type: "website",
  },
};

export const viewport: import("next").Viewport = {
  themeColor: config?.seo?.themeColor ?? "#0c0c0c",
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
