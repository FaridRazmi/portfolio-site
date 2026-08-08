/**
 * Content data store.
 *
 * Persists all site sections in Supabase Postgres (single `content` table,
 * one JSONB row per section). When Supabase is unreachable or not configured,
 * falls back to the defaults bundled in data/*.json so the site still renders.
 *
 * All functions are async because they hit the database. API routes must
 * `await` them. The browser-facing behavior is unchanged: sections still
 * fetch from the same API routes.
 */

import fs from "fs";
import path from "path";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

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

// Cold-start defaults from bundled JSON (used only when the DB is unavailable).
function load<T>(filename: string, fallback: T): T {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "data", filename), "utf-8"),
    );
  } catch {
    return fallback;
  }
}

const DEFAULT_ABOUT: AboutData = { name: "", bioWords: [], details: [], techStack: [] };
const DEFAULT_CONTACT: ContactData = {
  heading: "", subtitle: "", email: "", web3formsAccessKey: "", sectionLabel: "", github: "", linkedin: "",
};
const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: "",
  brandSuffix: "",
  footer: { tagline: "", copyrightName: "" },
  navbar: { links: [], socials: [] },
  seo: {
    title: "", description: "", keywords: [], ogTitle: "", ogDescription: "", themeColor: "",
  },
};

// Lazy-loaded defaults (avoids reading disk unless Supabase is down).
let jsonDefaults: Record<string, unknown> | null = null;
function getJsonDefaults(): Record<string, unknown> {
  if (!jsonDefaults) {
    jsonDefaults = {
      projects: load("projects.json", [] as Project[]),
      about: load("about.json", DEFAULT_ABOUT),
      stats: load("stats.json", { stats: [] as StatItem[] }).stats,
      testimonials: load("testimonials.json", { testimonials: [] as Testimonial[] }).testimonials,
      hero: load("hero.json", { overlays: [] as HeroOverlay[] }).overlays,
      contact: load("contact.json", DEFAULT_CONTACT),
      siteConfig: load("site-config.json", DEFAULT_SITE_CONFIG),
      comments: load("comments.json", { comments: [] as Comment[] }).comments,
    };
  }
  return jsonDefaults;
}

// ---------- Supabase helpers ----------
const TABLE = "content";

async function readSection<T>(key: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) {
    return deepClone(getJsonDefaults()[key] as T ?? fallback);
  }
  try {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select("data")
      .eq("id", key)
      .maybeSingle();
    if (error) throw error;
    if (!data?.data) return deepClone(getJsonDefaults()[key] as T ?? fallback);
    return deepClone(data.data as T);
  } catch {
    return deepClone(getJsonDefaults()[key] as T ?? fallback);
  }
}

async function writeSection(key: string, value: unknown): Promise<void> {
  if (!isSupabaseConfigured()) {
    // No DB configured: keep changes in-process so the session still works,
    // and surface a console warning so it's obvious edits won't persist.
    console.warn(`[data-store] Supabase not configured — "${key}" change is not persisted.`);
    memoryFallback[key] = deepClone(value);
    return;
  }
  const { error } = await getSupabase()
    .from(TABLE)
    .upsert(
      { id: key, data: JSON.parse(JSON.stringify(value)), updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );
  if (error) throw error;
}

// In-process cache for the un-configured fallback path.
const memoryFallback: Record<string, unknown> = {};

// ---------- Projects ----------
export async function getProjects(): Promise<Project[]> {
  return readSection<Project[]>("projects", [] as Project[]);
}
export async function setProjects(d: Project[]) {
  await writeSection("projects", d);
}
export async function addProject(p: Project) {
  const list = await getProjects();
  list.push(p);
  await writeSection("projects", list);
}
export async function updateProject(id: string, u: Partial<Project>) {
  const list = await getProjects();
  const i = list.findIndex((x) => x.id === id);
  if (i !== -1) list[i] = { ...list[i], ...u };
  await writeSection("projects", list);
}
export async function deleteProject(id: string) {
  const list = await getProjects();
  await writeSection("projects", list.filter((x) => x.id !== id));
}

// ---------- About ----------
export async function getAbout(): Promise<AboutData> {
  return readSection<AboutData>("about", DEFAULT_ABOUT);
}
export async function setAbout(d: AboutData) {
  await writeSection("about", d);
}

// ---------- Stats ----------
export async function getStats(): Promise<StatItem[]> {
  return readSection<StatItem[]>("stats", [] as StatItem[]);
}
export async function setStats(d: StatItem[]) {
  await writeSection("stats", d);
}

// ---------- Testimonials ----------
export async function getTestimonials(): Promise<Testimonial[]> {
  return readSection<Testimonial[]>("testimonials", [] as Testimonial[]);
}
export async function setTestimonials(d: Testimonial[]) {
  await writeSection("testimonials", d);
}
export async function addTestimonial(t: Testimonial) {
  const list = await getTestimonials();
  list.push(t);
  await writeSection("testimonials", list);
}
export async function updateTestimonial(id: string, u: Partial<Testimonial>) {
  const list = await getTestimonials();
  const i = list.findIndex((x) => x.id === id);
  if (i !== -1) list[i] = { ...list[i], ...u };
  await writeSection("testimonials", list);
}
export async function deleteTestimonial(id: string) {
  const list = await getTestimonials();
  await writeSection("testimonials", list.filter((x) => x.id !== id));
}

// ---------- Hero ----------
export async function getHeroOverlays(): Promise<HeroOverlay[]> {
  return readSection<HeroOverlay[]>("hero", [] as HeroOverlay[]);
}
export async function setHeroOverlays(d: HeroOverlay[]) {
  await writeSection("hero", d);
}

// ---------- Contact ----------
export async function getContact(): Promise<ContactData> {
  return readSection<ContactData>("contact", DEFAULT_CONTACT);
}
export async function setContact(d: ContactData) {
  await writeSection("contact", d);
}

// ---------- Site config ----------
export async function getSiteConfig(): Promise<SiteConfig> {
  return readSection<SiteConfig>("siteConfig", DEFAULT_SITE_CONFIG);
}
export async function setSiteConfig(d: SiteConfig) {
  await writeSection("siteConfig", d);
}

// ---------- Comments ----------
export async function getComments(): Promise<Comment[]> {
  return readSection<Comment[]>("comments", [] as Comment[]);
}
export async function addComment(c: Comment) {
  const list = await getComments();
  list.unshift(c);
  await writeSection("comments", list);
}
export async function deleteComment(id: string) {
  const list = await getComments();
  await writeSection("comments", list.filter((x) => x.id !== id));
}
