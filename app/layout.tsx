import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/data-store";
import "./globals.css";

const config = getSiteConfig();

const defaultTitle = "ReidTech | Software Engineer & Creative Technologist";
const defaultDesc =
  "Portfolio of Reid, a creative developer specializing in low-level systems, AI pipelines, and full-stack web experiences.";
const defaultOgTitle = "Reid — Software Engineer & Creative Technologist";
const defaultOgDesc =
  "Building at the intersection of systems, AI, and the web.";

const ogTitle =
  config?.seo?.ogTitle ?? "Reid — Software Engineer & Creative Technologist";
const ogDescription =
  config?.seo?.ogDescription ??
  "Building at the intersection of systems, AI, and the web.";
const title =
  config?.seo?.title ?? "ReidTech | Software Engineer & Creative Technologist";
const description =
  config?.seo?.description ??
  "Portfolio of Reid, a creative developer specializing in low-level systems, AI pipelines, and full-stack web experiences.";

export const metadata: Metadata = {
  title,
  description,
  keywords: config?.seo?.keywords ?? [
    "portfolio",
    "software engineer",
    "C++",
    "AI",
    "Next.js",
    "Python",
  ],
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    type: "website",
    url: "https://reidtech.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: ogTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: ["/og-image.png"],
  },
};

export const viewport: import("next").Viewport = {
  themeColor: config?.seo?.themeColor ?? "#0c0c0c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Reid",
  givenName: "Reid",
  url: "https://reidtech.dev",
  jobTitle: "Software Engineer & Creative Technologist",
  description:
    "Software engineer specializing in low-level systems, AI pipelines, and full-stack web experiences.",
  knowsAbout: [
    "C++",
    "Python",
    "AI",
    "Machine Learning",
    "Full-Stack Development",
    "Next.js",
    "PyTorch",
  ],
  sameAs: ["https://github.com/FaridRazmi", "https://linkedin.com"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
