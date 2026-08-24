import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { getSiteConfig } from "@/lib/data-store";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const defaultTitle = "ReidTech | Software Engineer & Creative Technologist";
const defaultDesc =
  "Portfolio of Reid, a creative developer specializing in low-level systems, AI pipelines, and full-stack web experiences.";
const defaultOgTitle = "Reid — Software Engineer & Creative Technologist";
const defaultOgDesc =
  "Building at the intersection of systems, AI, and the web.";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const ogTitle =
    config?.seo?.ogTitle ?? defaultOgTitle;
  const ogDescription =
    config?.seo?.ogDescription ?? defaultOgDesc;
  const title =
    config?.seo?.title ?? defaultTitle;
  const description =
    config?.seo?.description ?? defaultDesc;

  return {
    title,
    description,
    metadataBase: new URL("https://reidworks.my"),
    alternates: {
      canonical: "/",
    },
    keywords: config?.seo?.keywords ?? [
      "portfolio",
      "software engineer",
      "cloud engineer",
      "network engineer",
      "Next.js",
      "Python",
      "Farid Razmi",
      "IIUM",
    ],
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      url: "https://reidworks.my",
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
}

export async function generateViewport(): Promise<Viewport> {
  const config = await getSiteConfig();
  return {
    themeColor: config?.seo?.themeColor ?? "#0c0c0c",
    width: "device-width",
    initialScale: 1,
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Farid Razmi",
  givenName: "Farid",
  familyName: "Razmi",
  url: "https://reidworks.my",
  jobTitle: "Cloud & Network Engineer",
  description:
    "Student at IIUM Gombak and aspiring cloud engineer or network engineer.",
  alumniOf: {
    "@type": "EducationalOrganization",
    "name": "International Islamic University Malaysia",
    "alternateName": "IIUM"
  },
  knowsAbout: [
    "Cloud Engineering",
    "Network Engineering",
    "Systems Security",
    "C++",
    "Python",
    "AI",
    "Full-Stack Development",
    "Next.js"
  ],
  sameAs: ["https://github.com/FaridRazmi", "https://linkedin.com"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`noise ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
