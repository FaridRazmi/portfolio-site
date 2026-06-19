/**
 * In-memory data store.
 *
 * Initializes from data/*.json at module load (deployed defaults).
 * Mutations stay in process memory for the lifetime of the warm lambda.
 *
 * All section components are "use client" and fetch from API routes,
 * so fresh data is always served to the browser regardless of server state.
 * Data resets on cold starts — acceptable for a portfolio/admin site.
 */

import fs from "fs";
import path from "path";

// ---------- Types ----------
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

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function load<T>(filename: string, fallback: T): T {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "data", filename), "utf-8"),
    );
  } catch {
    return fallback;
  }
}

// In-memory state
let projects: Project[] = load("projects.json", [] as Project[]);
let about: AboutData = load("about.json", {
  name: "",
  bioWords: [],
  details: [],
  techStack: [],
} as AboutData);
let stats: StatItem[] = load("stats.json", { stats: [] as StatItem[] }).stats;
let testimonials: Testimonial[] = load("testimonials.json", {
  testimonials: [] as Testimonial[],
}).testimonials;
let heroOverlays: HeroOverlay[] = load("hero.json", {
  overlays: [] as HeroOverlay[],
}).overlays;
let contact: ContactData = load("contact.json", {
  heading: "",
  subtitle: "",
  email: "",
  web3formsAccessKey: "",
  sectionLabel: "",
  github: "",
  linkedin: "",
} as ContactData);
let siteConfig: SiteConfig = load("site-config.json", {
  brandName: "",
  brandSuffix: "",
  footer: { tagline: "", copyrightName: "" },
  navbar: { links: [], socials: [] },
  seo: {
    title: "",
    description: "",
    keywords: [],
    ogTitle: "",
    ogDescription: "",
    themeColor: "",
  },
} as SiteConfig);
let comments: Comment[] = load("comments.json", {
  comments: [] as Comment[],
}).comments;

// Projects
export function getProjects(): Project[] {
  return deepClone(projects);
}
export function setProjects(d: Project[]) {
  projects = d;
}
export function addProject(p: Project) {
  projects.push(p);
}
export function updateProject(id: string, u: Partial<Project>) {
  const i = projects.findIndex((x) => x.id === id);
  if (i !== -1) projects[i] = { ...projects[i], ...u };
}
export function deleteProject(id: string) {
  projects = projects.filter((x) => x.id !== id);
}

// About
export function getAbout(): AboutData {
  return deepClone(about);
}
export function setAbout(d: AboutData) {
  about = d;
}

// Stats
export function getStats(): StatItem[] {
  return deepClone(stats);
}
export function setStats(d: StatItem[]) {
  stats = d;
}

// Testimonials
export function getTestimonials(): Testimonial[] {
  return deepClone(testimonials);
}
export function setTestimonials(d: Testimonial[]) {
  testimonials = d;
}
export function addTestimonial(t: Testimonial) {
  testimonials.push(t);
}
export function updateTestimonial(id: string, u: Partial<Testimonial>) {
  const i = testimonials.findIndex((x) => x.id === id);
  if (i !== -1) testimonials[i] = { ...testimonials[i], ...u };
}
export function deleteTestimonial(id: string) {
  testimonials = testimonials.filter((x) => x.id !== id);
}

// Hero
export function getHeroOverlays(): HeroOverlay[] {
  return deepClone(heroOverlays);
}
export function setHeroOverlays(d: HeroOverlay[]) {
  heroOverlays = d;
}

// Contact
export function getContact(): ContactData {
  return deepClone(contact);
}
export function setContact(d: ContactData) {
  contact = d;
}

// Site config
export function getSiteConfig(): SiteConfig {
  return deepClone(siteConfig);
}
export function setSiteConfig(d: SiteConfig) {
  siteConfig = d;
}

// Comments
export function getComments(): Comment[] {
  return deepClone(comments);
}
export function addComment(c: Comment) {
  comments.unshift(c);
}
export function deleteComment(id: string) {
  comments = comments.filter((x) => x.id !== id);
}
