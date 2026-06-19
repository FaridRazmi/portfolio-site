/**
 * In-memory data store for production deployment.
 *
 * On serverless platforms (Vercel, Netlify, etc.) the filesystem is read-only.
 * This store initializes from JSON files at module load time and keeps all data
 * in process memory. All API routes read/write through this store instead of
 * directly using fs.writeFileSync.
 */

import fs from "fs";
import path from "path";

// ---------- Types (mirrors admin/types.ts to avoid circular deps with "use client") ----------
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

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

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

export interface ContactData {
  heading: string;
  subtitle: string;
  email: string;
  web3formsAccessKey: string;
  sectionLabel: string;
  github: string;
  linkedin: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
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
  navbar: { links: NavLink[]; socials: SocialLink[] };
  seo: SEOConfig;
}

export interface Comment {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

// ---------- JSON helper ----------
function loadJson<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "data", filename);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    // Return a safe empty default so the app doesn't crash if a file is missing
    console.warn(
      `[data-store] Could not read ${filename}, using empty default`,
    );
    return JSON.parse("{}");
  }
}

// ---------- In-memory state ----------
let projects: Project[] = loadJson<any>("projects.json");
let about: AboutData = loadJson<AboutData>("about.json");
let stats: StatItem[] =
  loadJson<{ stats: StatItem[] }>("stats.json").stats ?? [];
let testimonials: Testimonial[] =
  loadJson<{ testimonials: Testimonial[] }>("testimonials.json").testimonials ??
  [];
let heroOverlays: HeroOverlay[] =
  loadJson<{ overlays: HeroOverlay[] }>("hero.json").overlays ?? [];
let contact: ContactData = loadJson<ContactData>("contact.json");
let siteConfig: SiteConfig = loadJson<SiteConfig>("site-config.json");
let comments: Comment[] =
  loadJson<{ comments: Comment[] }>("comments.json").comments ?? [];

// ---------- Public API ----------

// Projects
export function getProjects(): Project[] {
  return [...projects];
}
export function setProjects(data: Project[]) {
  projects = data;
}
export function addProject(p: Project) {
  projects.push(p);
}
export function updateProject(id: string, updates: Partial<Project>) {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx !== -1) projects[idx] = { ...projects[idx], ...updates };
}
export function deleteProject(id: string) {
  projects = projects.filter((p) => p.id !== id);
}

// About
export function getAbout(): AboutData {
  return {
    ...about,
    bioWords: [...about.bioWords],
    details: about.details.map((d) => ({ ...d })),
    techStack: [...about.techStack],
  };
}
export function setAbout(data: AboutData) {
  about = data;
}

// Stats
export function getStats(): StatItem[] {
  return stats.map((s) => ({ ...s }));
}
export function setStats(data: StatItem[]) {
  stats = data;
}

// Testimonials
export function getTestimonials(): Testimonial[] {
  return testimonials.map((t) => ({ ...t }));
}
export function setTestimonials(data: Testimonial[]) {
  testimonials = data;
}
export function addTestimonial(t: Testimonial) {
  testimonials.push(t);
}
export function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  const idx = testimonials.findIndex((t) => t.id === id);
  if (idx !== -1) testimonials[idx] = { ...testimonials[idx], ...updates };
}
export function deleteTestimonial(id: string) {
  testimonials = testimonials.filter((t) => t.id !== id);
}

// Hero overlays
export function getHeroOverlays(): HeroOverlay[] {
  return heroOverlays.map((o) => ({ ...o }));
}
export function setHeroOverlays(data: HeroOverlay[]) {
  heroOverlays = data;
}

// Contact
export function getContact(): ContactData {
  return { ...contact };
}
export function setContact(data: ContactData) {
  contact = data;
}

// Site config
export function getSiteConfig(): SiteConfig {
  return JSON.parse(JSON.stringify(siteConfig));
}
export function setSiteConfig(data: SiteConfig) {
  siteConfig = data;
}

// Comments
export function getComments(): Comment[] {
  return comments.map((c) => ({ ...c }));
}
export function addComment(c: Comment) {
  comments.unshift(c);
}
export function deleteComment(id: string) {
  comments = comments.filter((c) => c.id !== id);
}
