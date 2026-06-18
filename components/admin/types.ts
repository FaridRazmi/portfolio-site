export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  accent: string;
  link: string;
  image: string;
  order: number;
}

// About section
export interface AboutDetail {
  label: string;
  value: string;
}

export interface AboutData {
  name: string;
  bioWords: string[];
  details: AboutDetail[];
  techStack: string[];
}

// Stats section
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface StatsData {
  stats: StatItem[];
}

// Testimonials
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export interface TestimonialsData {
  testimonials: Testimonial[];
}

// Hero / Sequence Scroll overlays
export interface HeroOverlay {
  id: string;
  start: number;
  end: number;
  align: "center" | "left" | "right";
  heading: string;
  sub: string;
  label: string;
  isCTA: boolean;
}

export interface HeroData {
  overlays: HeroOverlay[];
}

// Contact / CTA section
export interface ContactData {
  heading: string;
  subtitle: string;
  email: string;
  web3formsAccessKey: string;
  sectionLabel: string;
  github: string;
  linkedin: string;
}

// Site configuration (Footer, Navbar, SEO)
export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface NavbarConfig {
  links: NavLink[];
  socials: SocialLink[];
}

export interface FooterConfig {
  tagline: string;
  copyrightName: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  themeColor: string;
}

export interface SiteConfig {
  brandName: string;
  brandSuffix: string;
  footer: FooterConfig;
  navbar: NavbarConfig;
  seo: SEOConfig;
}

// Comments section
export interface Comment {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export interface CommentsData {
  comments: Comment[];
}
